"use server";

import { db } from "@/drizzle/db";
import { and, eq, like, sql } from "drizzle-orm";
import { users } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import {
  ServerActionResult,
  ServerSearchResult,
  UserData,
} from "@/utils/types";
import { userFields } from "@/drizzle/fields";
import { parseString, parseUserFormData } from "@/utils/server-utils";
import { isAdmin } from "@/utils/admin-only";
import { v4 } from "uuid";

export const createUser = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const { firstName, lastName, mobileNumber, whatsappNumber, email } =
      parseUserFormData(formData);

    return await db
      .insert(users)
      .values({
        id: v4(),
        firstName,
        lastName,
        mobileNumber,
        whatsappNumber,
        email,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "User created." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        if (err?.constraint === "uniqueEmail") {
          throw new Error("Email already registered.");
        }
        if (err?.constraint === "uniqueMobileNumber") {
          throw new Error("Mobile number already registered.");
        }
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

export const editUser = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const { firstName, lastName, mobileNumber, whatsappNumber, email } =
      parseUserFormData(formData);

    if (!id) {
      throw new Error("Invalid id.");
    }

    return await db
      .update(users)
      .set({
        firstName,
        lastName,
        mobileNumber,
        whatsappNumber,
        email,
      })
      .where(eq(users.id, id))
      .returning(userFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("User not found.");
        }
        revalidatePath("/admin");
        return { success: "User data updated." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        if (err?.constraint === "uniqueEmail") {
          throw new Error(
            "Email already registered with a user with this role.",
          );
        }
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

export const deleteUser = async (id: string): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    if (!id) {
      throw new Error("Invalid id.");
    }

    return await db
      .delete(users)
      .where(eq(users.id, id))
      .returning(userFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("User not found.");
        }
        revalidatePath("/admin");
        return { success: "User deleted." };
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

export const getUser = async (
  id: string,
): Promise<ServerSearchResult<UserData>> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    return await db
      .select(userFields)
      .from(users)
      .where(and(eq(users.id, id)))
      .then((res) => {
        if (res.length === 0) {
          throw new Error("User not found");
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

export const searchUser = async (
  formData: FormData,
): Promise<ServerSearchResult<UserData[]>> => {
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

    const query = db.select(userFields).from(users);
    let queryWithFilter;

    if (!searchKey) {
      throw new Error("Invalid search key.");
    } else if (searchKey === "Name") {
      queryWithFilter = query.where(
        like(
          sql`LOWER(COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
          `${searchValue.toLowerCase()}%`,
        ),
      );
    } else if (searchKey === "Email") {
      queryWithFilter = query.where(like(users.email, `${searchValue}%`));
    } else if (searchKey === "Mobile") {
      queryWithFilter = query.where(
        like(users.mobileNumber, `${searchValue}%`),
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
