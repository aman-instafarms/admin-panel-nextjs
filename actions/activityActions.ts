"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { activities } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import { activityFields } from "@/drizzle/fields";
import { parseString } from "@/utils/server-utils";

export const createActivity = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const activity = parseString(formData.get("activity")?.toString());

  if (activity && activity.length > 0) {
    return await db
      .insert(activities)
      .values({
        id: v4(),
        activity: activity,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "Created new activity." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  }
  throw new Error("Please enter activity name.");
};

export const editActivity = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  const activity = parseString(formData.get("activity")?.toString());

  if (!id) {
    throw new Error("Invalid id.");
  }

  if (activity && activity.length > 0) {
    return await db
      .update(activities)
      .set({ activity: activity })
      .where(eq(activities.id, id))
      .returning(activityFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Activity not found.");
        }
        revalidatePath("/admin");
        return { success: "Activity updated." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  }

  throw new Error("Please enter valid activity name.");
};

export const deleteActivity = async (
  id: string,
): Promise<ServerActionResult> => {
  if (!id) {
    throw new Error("Invalid id.");
  }

  return await db
    .delete(activities)
    .where(eq(activities.id, id))
    .returning(activityFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("Activity not found.");
      }
      revalidatePath("/admin");
      return { success: "Activity deleted." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};
