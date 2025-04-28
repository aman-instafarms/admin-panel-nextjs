"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { cities, states } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { CityData, ServerActionResult } from "@/utils/types";
import { _cityFields, cityFields } from "@/drizzle/fields";
import { parseString } from "@/utils/server-utils";
import { isAdmin } from "@/utils/admin-only";

export const createCity = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const editCity = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const deleteCity = async (id: string): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const getCities = async (
  stateId: string,
): Promise<{ data?: CityData[]; error?: string }> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
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
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};
