"use server";

import { db } from "@/drizzle/db";
import { caretakersOnProperties } from "@/drizzle/schema";
import { isAdmin } from "@/utils/admin-only";
import { ServerActionResult } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCaretaker(caretaker: {
  propertyId: string;
  caretakerId: string;
}): Promise<ServerActionResult> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  try {
    return await db
      .insert(caretakersOnProperties)
      .values({
        propertyId: caretaker.propertyId,
        role: "Manager",
        caretakerId: caretaker.caretakerId,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "User added as caretaker." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database Error");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
}

export async function removeCaretaker(caretaker: {
  propertyId: string;
  caretakerId: string;
}): Promise<ServerActionResult> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    return await db
      .delete(caretakersOnProperties)
      .where(
        and(
          eq(caretakersOnProperties.propertyId, caretaker.propertyId),
          eq(caretakersOnProperties.caretakerId, caretaker.caretakerId),
        ),
      )
      .returning({ id: caretakersOnProperties.propertyId })
      .then((res) => {
        if (res.length === 0) {
          throw new Error("User is not registered as caretaker");
        }
        revalidatePath("/admin");
        return { success: "Caretaker Removed" };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database Error");
      });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
}
