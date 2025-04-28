"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { admins } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import { adminFields } from "@/drizzle/fields";
import { parseAdminFormData } from "@/utils/server-utils";
import { isAdmin } from "@/utils/admin-only";

export const createAdmin = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const { firstName, lastName, email, phoneNumber } =
      parseAdminFormData(formData);

    return await db
      .insert(admins)
      .values({
        firstName,
        lastName,
        email,
        phoneNumber,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "Admin added." };
      })
      .catch((err) => {
        console.log("DB Error:　", err);
        throw new Error("Database Error.");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const editAdmin = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const { firstName, lastName, email, phoneNumber } =
      parseAdminFormData(formData);

    if (!id) {
      throw new Error("Invalid id.");
    }

    return await db
      .update(admins)
      .set({ firstName, lastName, email, phoneNumber })
      .where(eq(admins.id, id))
      .returning(adminFields)
      .then((res) => {
        if (res.length === 0) {
          revalidatePath("/admin");
          throw new Error("Admin not found.");
        }
        return { success: "Admin updated." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database Error.");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const deleteAdmin = async (id: string): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    if (!id) {
      throw new Error("Invalid id.");
    }

    return await db
      .delete(admins)
      .where(eq(admins.id, id))
      .returning(adminFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Admin not found.");
        }
        revalidatePath("/admin");
        return { success: "Admin removed." };
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
