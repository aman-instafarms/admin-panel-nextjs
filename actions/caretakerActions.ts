"use server";

import { db } from "@/drizzle/db";
import { caretakersOnProperties } from "@/drizzle/schema";
import { ServerActionResult } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCaretaker(caretaker: {
  propertyId: string;
  caretakerId: string;
}): Promise<ServerActionResult> {
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
}

export async function removeCaretaker(caretaker: {
  propertyId: string;
  caretakerId: string;
}): Promise<ServerActionResult> {
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
}
