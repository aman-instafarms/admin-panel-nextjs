"use server";

import { db } from "@/drizzle/db";
import { eq, like, sql } from "drizzle-orm";
import { properties, propertyTypes, specialDates } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import {
  _PropertyData,
  ServerActionResult,
  ServerSearchResult,
} from "@/utils/types";
import {
  parsePropertyFormData,
  parseSpecialDates,
  parseString,
  validatePropertyData,
} from "@/utils/server-utils";
import { _propertyFields } from "@/drizzle/fields";
import { isAdmin } from "@/utils/admin-only";

export const createProperty = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: "Unauthorized" };
    }
    const data: _PropertyData = parsePropertyFormData(formData);

    const err = validatePropertyData(data);
    if (err) {
      throw new Error(err);
    }

    return await db
      .insert(properties)
      .values(data)
      .then(() => {
        revalidatePath("/admin");
        return { success: "Created new property." };
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

export const editProperty = async (
  propertyId: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    if (!propertyId) {
      throw new Error("Invalid id.");
    }
    const data = parsePropertyFormData(formData);
    const specialDatesData = parseSpecialDates(formData);

    const err = validatePropertyData(data);
    if (err) {
      throw new Error(err);
    }
    if (specialDatesData.error) {
      throw new Error(specialDatesData.error);
    }

    return await db.transaction(async (tx) => {
      await tx
        .delete(specialDates)
        .where(eq(specialDates.propertyId, propertyId))
        .catch((err) => {
          console.log("DB Error: ", err);
          throw new Error("Database Error.");
        });

      if (specialDatesData.data?.length) {
        await tx
          .insert(specialDates)
          .values(
            specialDatesData.data.map((r) => ({
              ...r,
              propertyId: propertyId,
            })),
          )
          .catch((err) => {
            console.log("DB Error: ", err);
            throw new Error("Database Error.");
          });
      }
      return await db
        .update(properties)
        .set({ ...data, id: propertyId })
        .where(eq(properties.id, propertyId))
        .returning(_propertyFields)
        .then((res) => {
          if (res.length === 0) {
            throw new Error("Property not found.");
          }
          revalidatePath("/admin");
          return { success: "Saved Property data." };
        })
        .catch((err) => {
          console.log("DB Error: ", err);
          throw new Error("Database error.");
        });
    });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const deleteProperty = async (
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
      .delete(properties)
      .where(eq(propertyTypes.id, id))
      .returning(_propertyFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Property not found.");
        }
        revalidatePath("/admin");
        return { success: "Property deleted." };
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

export const getPropertyById = async (
  id: string,
): Promise<ServerSearchResult<_PropertyData>> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    return await db
      .select(_propertyFields)
      .from(properties)
      .where(eq(properties.id, id))
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Property not found");
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

export const searchProperty = async (
  formData: FormData,
): Promise<ServerSearchResult<_PropertyData[]>> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const searchKeys = ["Property Name", "Property Code"] as const;
    const searchKey = searchKeys.find(
      (x) => x === formData.get("searchKey")?.toString(),
    );
    const searchValue = parseString(formData.get("searchValue")?.toString());

    if (!searchValue) {
      return { data: [] };
    }

    const query = db.select(_propertyFields).from(properties);
    let queryWithFilter;

    if (!searchKey) {
      throw new Error("Invalid search key.");
    } else if (searchKey === "Property Name") {
      queryWithFilter = query.where(
        like(
          sql`LOWER(COALESCE(${properties.propertyName}, ''))`,
          `${searchValue.toLowerCase()}%`,
        ),
      );
    } else if (searchKey === "Property Code") {
      queryWithFilter = query.where(
        like(
          sql`LOWER(COALESCE(${properties.propertyCode}, ''))`,
          `${searchValue.toLowerCase()}%`,
        ),
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
