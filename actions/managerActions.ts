"use server";

import { db } from "@/drizzle/db";
import { managersOnProperties } from "@/drizzle/schema";
import { isAdmin } from "@/utils/admin-only";
import { ServerActionResult } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addManager(manager: {
  propertyId: string;
  managerId: string;
}): Promise<ServerActionResult> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    return await db
      .insert(managersOnProperties)
      .values({
        propertyId: manager.propertyId,
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
}

export async function removeManager(manager: {
  propertyId: string;
  managerId: string;
}): Promise<ServerActionResult> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
}
