"use server";

import { db } from "@/drizzle/db";
import { managersOnProperties } from "@/drizzle/schema";
import { ServerActionResult } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addManager(manager: {
  propertyId: string;
  managerId: string;
}): Promise<ServerActionResult> {
  return await db
    .insert(managersOnProperties)
    .values({
      propertyId: manager.propertyId,
      role: "Manager",
      managerId: manager.managerId,
    })
    .then(() => {
      revalidatePath("/admin");
      return { success: "User added as manager." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });
}

export async function removeManager(manager: {
  propertyId: string;
  managerId: string;
}): Promise<ServerActionResult> {
  return await db
    .delete(managersOnProperties)
    .where(
      and(
        eq(managersOnProperties.propertyId, manager.propertyId),
        eq(managersOnProperties.managerId, manager.managerId),
      ),
    )
    .returning({ id: managersOnProperties.propertyId })
    .then((res) => {
      if (res.length === 0) {
        throw new Error("User is not registered as manager");
      }
      revalidatePath("/admin");
      return { success: "Manager Removed" };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });
}
