"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { properties, propertyTypes, specialDates } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { _PropertyData, ServerActionResult } from "@/utils/types";
import {
  parsePropertyFormData,
  parseSpecialDates,
  validatePropertyData,
} from "@/utils/server-utils";
import { _propertyFields } from "@/drizzle/fields";

export interface SpecialDateData {
  id: string;
  date: Date;
  price: number | null;
  adultExtraGuestCharge: number | null;
  childExtraGuestCharge: number | null;
  infantExtraGuestCharge: number | null;
  baseGuestCount: number | null;
  discount: number | null;
}

export const createProperty = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const data: _PropertyData = parsePropertyFormData(formData);

  const err = validatePropertyData(data);
  if (err) {
    throw new Error(err);
  }

  return await db
    .insert(properties)
    .values(data)
    .then(() => {
      revalidatePath("/admin");
      return { success: "Created new property type." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const editProperty = async (
  propertyId: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  if (!propertyId) {
    throw new Error("Invalid id.");
  }
  const data = parsePropertyFormData(formData);
  const specialDatesData = parseSpecialDates(formData);

  const err = validatePropertyData(data);
  if (err) {
    throw new Error(err);
  }
  if (specialDatesData.error) {
    throw new Error(specialDatesData.error);
  }

  return await db.transaction(async (tx) => {
    await tx
      .delete(specialDates)
      .where(eq(specialDates.propertyId, propertyId))
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database Error.");
      });

    if (specialDatesData.data?.length) {
      await tx
        .insert(specialDates)
        .values(
          specialDatesData.data.map((r) => ({ ...r, propertyId: propertyId })),
        )
        .catch((err) => {
          console.log("DB Error: ", err);
          throw new Error("Database Error.");
        });
    }
    return await db
      .update(properties)
      .set({ ...data, id: propertyId })
      .where(eq(properties.id, propertyId))
      .returning(_propertyFields)
      .then((res) => {
        if (res.length === 0) {
          throw new Error("Property not found.");
        }
        revalidatePath("/admin");
        return { success: "Saved Property data." };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
  });
};

export const deleteProperty = async (
  id: string,
): Promise<ServerActionResult> => {
  if (!id) {
    throw new Error("Invalid id.");
  }

  return await db
    .delete(properties)
    .where(eq(propertyTypes.id, id))
    .returning(_propertyFields)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("Property not found.");
      }
      revalidatePath("/admin");
      return { success: "Property type deleted." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};
