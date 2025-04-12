"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { states } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import { stateFields } from "@/drizzle/fields";

export const createState = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const state = formData.get("state")?.toString();

  if (state && state.length > 0) {
    return await db
      .insert(states)
      .values({
        id: v4(),
        state: state,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "Created new state." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  }
  throw new Error("Please enter state name.");
};

export const editState = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  const state = formData.get("state")?.toString();

  if (!id) {
    throw new Error("Invalid id.");
  }

  if (state && state.length > 0) {
    return await db
      .update(states)
      .set({ state: state })
      .where(eq(states.id, id))
      .returning(stateFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("State not found.");
        }
        revalidatePath("/admin");
        return { success: "State updated." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  }

  throw new Error("Please enter valid name.");
};

export const deleteState = async (id: string): Promise<ServerActionResult> => {
  if (!id) {
    throw new Error("Invalid id.");
  }

  return await db
    .delete(states)
    .where(eq(states.id, id))
    .returning(stateFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("State not found.");
      }
      revalidatePath("/admin");
      return { success: "State deleted." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};
