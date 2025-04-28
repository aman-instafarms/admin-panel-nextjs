"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { propertyTypes } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import { isAdmin } from "@/utils/admin-only";

export const createPropertyType = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const name = formData.get("propertyType")?.toString();

    if (name && name.length > 0) {
      return await db
        .insert(propertyTypes)
        .values({
          id: v4(),
          name: name,
        })
        .then(() => {
          revalidatePath("/admin");
          return { success: "Created new property type." };
        })
        .catch((err) => {
          console.log("DB Error: ", err);
          throw new Error("Database error.");
        });
    }
    throw new Error("Please enter valid name.");
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const editPropertyType = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const name = formData.get("propertyType")?.toString();

    if (!id) {
      throw new Error("Invalid id.");
    }

    if (name && name.length > 0) {
      return await db
        .update(propertyTypes)
        .set({ name: name })
        .where(eq(propertyTypes.id, id))
        .then((res) => {
          if (res.rows.length === 0) {
            throw new Error("Property type not found.");
          }
          revalidatePath("/admin");
          return { success: "Property type updated." };
        })
        .catch((err) => {
          console.log("DB Error: ", err);
          throw new Error("Database error.");
        });
    }

    throw new Error("Please enter valid name.");
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const deletePropertyType = async (
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
      .delete(propertyTypes)
      .where(eq(propertyTypes.id, id))
      .then((res) => {
        if (res.rows.length === 0) {
          throw new Error("Property type not found.");
        }
        revalidatePath("/admin");
        return { success: "Property type deleted." };
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
