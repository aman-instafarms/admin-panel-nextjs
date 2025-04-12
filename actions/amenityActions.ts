"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { amenities } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import { amenityFields } from "@/drizzle/fields";
import { parseString } from "@/utils/server-utils";

export const createAmenity = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const amenity = parseString(formData.get("amenity")?.toString());

  if (amenity && amenity.length > 0) {
    return await db
      .insert(amenities)
      .values({
        id: v4(),
        amenity: amenity,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "Created new amenity." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  }
  throw new Error("Please enter amenity name.");
};

export const editAmenity = async (
  id: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  const amenity = parseString(formData.get("amenity")?.toString());

  if (!id) {
    throw new Error("Invalid id.");
  }

  if (amenity && amenity.length > 0) {
    return await db
      .update(amenities)
      .set({ amenity: amenity })
      .where(eq(amenities.id, id))
      .returning(amenityFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Amenity not found.");
        }
        revalidatePath("/admin");
        return { success: "Amenity updated." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  }

  throw new Error("Please enter valid amenity name.");
};

export const deleteAmenity = async (
  id: string,
): Promise<ServerActionResult> => {
  if (!id) {
    throw new Error("Invalid id.");
  }

  return await db
    .delete(amenities)
    .where(eq(amenities.id, id))
    .returning(amenityFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("Amenity not found.");
      }
      revalidatePath("/admin");
      return { success: "Amenity deleted." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};
