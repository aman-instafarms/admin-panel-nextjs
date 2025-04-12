"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { cities, states } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { CityData, ServerActionResult } from "@/utils/types";
import { _cityFields, cityFields } from "@/drizzle/fields";
import { parseString } from "@/utils/server-utils";

export const createCity = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const city = parseString(formData.get("city")?.toString());
  const stateId = parseString(formData.get("stateId")?.toString());

  if (!city || city.length === 0) {
    throw new Error("Invalid City Name.");
  }

  if (!stateId || stateId.length === 0) {
    throw new Error("Invalid State.");
  }

  return await db
    .insert(cities)
    .values({
      id: v4(),
      city: city,
      stateId: stateId,
    })
    .then(() => {
      revalidatePath("/admin");
      return { success: "Created new city." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const editCity = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  const city = parseString(formData.get("city")?.toString());
  const stateId = parseString(formData.get("stateId")?.toString());

  if (!id) {
    throw new Error("Invalid id.");
  }

  if (!city || city.length === 0) {
    throw new Error("Invalid City Name.");
  }

  if (!stateId || stateId.length === 0) {
    throw new Error("Invalid State.");
  }

  return await db
    .update(cities)
    .set({ stateId, city })
    .where(eq(cities.id, id))
    .returning(_cityFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("City not found.");
      }
      revalidatePath("/admin");
      return { success: "City updated." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const deleteCity = async (id: string): Promise<ServerActionResult> => {
  if (!id) {
    throw new Error("Invalid id.");
  }

  return await db
    .delete(cities)
    .where(eq(cities.id, id))
    .returning(_cityFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("City not found.");
      }
      revalidatePath("/admin");
      return { success: "City deleted." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const getCities = async (
  stateId: string,
): Promise<{ data?: CityData[]; error?: string }> => {
  return await db
    .select(cityFields)
    .from(cities)
    .leftJoin(states, eq(cities.stateId, states.id))
    .where(eq(cities.stateId, stateId))
    .then((res) => ({ data: res }))
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};
