"use server";

import { db } from "@/drizzle/db";
import { ownersOnProperties } from "@/drizzle/schema";
import { isAdmin } from "@/utils/admin-only";
import { ServerActionResult } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addOwner(owner: {
  propertyId: string;
  ownerId: string;
}): Promise<ServerActionResult> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    return await db
      .insert(ownersOnProperties)
      .values({
        propertyId: owner.propertyId,
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
}

export async function removeOwner(owner: {
  propertyId: string;
  ownerId: string;
}): Promise<ServerActionResult> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
}
