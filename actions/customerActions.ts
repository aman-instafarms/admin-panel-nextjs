"use server";

import { db } from "@/drizzle/db";
import { eq, like, sql } from "drizzle-orm";
import { customers } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import {
  CustomerData,
  ServerActionResult,
  ServerSearchResult,
} from "@/utils/types";
import { customerFields } from "@/drizzle/fields";
import { parseCustomerFormData, parseString } from "@/utils/server-utils";
import { v4 } from "uuid";
import { isAdmin } from "@/utils/admin-only";

export const createCustomer = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const { firstName, lastName, mobileNumber, email, dob, gender } =
      parseCustomerFormData(formData);

    return await db
      .insert(customers)
      .values({
        id: v4(),
        firstName,
        lastName,
        mobileNumber,
        gender,
        dob,
        email,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "Customer created." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const editCustomer = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const { firstName, lastName, mobileNumber, email, gender, dob } =
      parseCustomerFormData(formData);

    if (!id) {
      throw new Error("Invalid id.");
    }

    return await db
      .update(customers)
      .set({
        firstName,
        lastName,
        mobileNumber,
        email,
        dob,
        gender,
      })
      .where(eq(customers.id, id))
      .returning(customerFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Customer not found.");
        }
        revalidatePath("/admin");
        return { success: "Customer data updated." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const deleteCustomer = async (
  id: string,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    if (!id) {
      throw new Error("Invalid id.");
    }

    return await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning(customerFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Customer not found.");
        }
        revalidatePath("/admin");
        return { success: "Customer deleted." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const getCustomerById = async (
  id: string,
): Promise<ServerSearchResult<CustomerData>> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    return await db
      .select(customerFields)
      .from(customers)
      .where(eq(customers.id, id))
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Customer not found");
        }
        return { data: res[0] };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const searchCustomer = async (
  formData: FormData,
): Promise<ServerSearchResult<CustomerData[]>> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const searchKeys = ["Name", "Email", "Mobile"] as const;
    const searchKey = searchKeys.find(
      (x) => x === formData.get("searchKey")?.toString(),
    );
    const searchValue = parseString(formData.get("searchValue")?.toString());

    if (!searchValue) {
      return { data: [] };
    }

    const query = db.select(customerFields).from(customers);
    let queryWithFilter;

    if (!searchKey) {
      throw new Error("Invalid search key.");
    } else if (searchKey === "Name") {
      queryWithFilter = query.where(
        like(
          sql`LOWER(COALESCE(${customers.firstName}, '') || ' ' || COALESCE(${customers.lastName}, ''))`,
          `${searchValue.toLowerCase()}%`,
        ),
      );
    } else if (searchKey === "Email") {
      queryWithFilter = query.where(like(customers.email, `${searchValue}%`));
    } else if (searchKey === "Mobile") {
      queryWithFilter = query.where(
        like(customers.mobileNumber, `${searchValue}%`),
      );
    }

    return await (queryWithFilter ? queryWithFilter : query)
      .limit(5)
      .then((res) => {
        return { data: res };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        return { error: "Database error" };
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};
