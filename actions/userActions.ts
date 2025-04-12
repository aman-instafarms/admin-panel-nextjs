"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { users } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import { userFields } from "@/drizzle/fields";
import { parseUserFormData } from "@/utils/server-utils";

export const createUser = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const { firstName, lastName, mobileNumber, whatsappNumber, email, role } =
    parseUserFormData(formData);

  return await db
    .insert(users)
    .values({
      firstName,
      lastName,
      mobileNumber,
      role,
      whatsappNumber,
      email,
    })
    .then(() => {
      revalidatePath("/admin");
      return { success: "User created." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const editUser = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  const { firstName, lastName, mobileNumber, whatsappNumber, email, role } =
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
      role,
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
      throw new Error("Database error.");
    });
};

export const deleteUser = async (id: string): Promise<ServerActionResult> => {
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
};
