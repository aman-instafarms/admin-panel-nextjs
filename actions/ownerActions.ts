"use server";

import { db } from "@/drizzle/db";
import { ownersOnProperties } from "@/drizzle/schema";
import { ServerActionResult } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addOwner(owner: {
  propertyId: string;
  ownerId: string;
}): Promise<ServerActionResult> {
  return await db
    .insert(ownersOnProperties)
    .values({
      propertyId: owner.propertyId,
      role: "Owner",
      ownerId: owner.ownerId,
    })
    .then(() => {
      revalidatePath("/admin");
      return { success: "User added as owner." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });
}

export async function removeOwner(owner: {
  propertyId: string;
  ownerId: string;
}): Promise<ServerActionResult> {
  return await db
    .delete(ownersOnProperties)
    .where(
      and(
        eq(ownersOnProperties.propertyId, owner.propertyId),
        eq(ownersOnProperties.ownerId, owner.ownerId),
      ),
    )
    .returning({ id: ownersOnProperties.propertyId })
    .then((res) => {
      if (res.length === 0) {
        throw new Error("User is not registered as owner");
      }
      revalidatePath("/admin");
      return { success: "Owner Removed" };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });
}
