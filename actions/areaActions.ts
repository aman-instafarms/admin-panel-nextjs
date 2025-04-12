"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { areas, cities, states } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { AreaData, ServerActionResult } from "@/utils/types";
import { _areaFields, areaFields } from "@/drizzle/fields";
import { parseString } from "@/utils/server-utils";

export const createArea = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const area = parseString(formData.get("area")?.toString());
  const cityId = parseString(formData.get("cityId")?.toString());

  if (!area || area.length === 0) {
    throw new Error("Invalid Area Name.");
  }

  console.log(1, cityId);
  if (!cityId || cityId.length === 0) {
    throw new Error("Invalid City.");
  }

  return await db
    .insert(areas)
    .values({
      id: v4(),
      area: area,
      cityId: cityId,
    })
    .then(() => {
      revalidatePath("/admin");
      return { success: "Created new area." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const editArea = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  const area = parseString(formData.get("area")?.toString());
  const cityId = parseString(formData.get("cityId")?.toString());

  if (!id) {
    throw new Error("Invalid id.");
  }

  if (!area || area.length === 0) {
    throw new Error("Invalid Area Name.");
  }

  if (!cityId || cityId.length === 0) {
    throw new Error("Invalid City.");
  }

  return await db
    .update(areas)
    .set({ area, cityId })
    .where(eq(areas.id, id))
    .returning(_areaFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("Area not found.");
      }
      revalidatePath("/admin");
      return { success: "Area updated." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const deleteArea = async (id: string): Promise<ServerActionResult> => {
  if (!id) {
    throw new Error("Invalid id.");
  }

  return await db
    .delete(areas)
    .where(eq(areas.id, id))
    .returning(_areaFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("Area not found.");
      }
      revalidatePath("/admin");
      return { success: "Area deleted." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const getAreas = async (
  cityId: string,
): Promise<{ data?: AreaData[]; error?: string }> => {
  return await db
    .select(areaFields)
    .from(areas)
    .leftJoin(cities, eq(areas.cityId, cities.id))
    .leftJoin(states, eq(cities.stateId, states.id))
    .where(eq(areas.cityId, cityId))
    .then((res) => ({ data: res }))
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};
