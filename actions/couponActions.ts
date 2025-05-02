"use server";

import { db } from "@/drizzle/db";
import {
  coupons,
  properties,
  propertiesOnCoupons,
  users,
  ownersOnProperties,
  managersOnProperties,
  caretakersOnProperties,
} from "@/drizzle/schema";
import { or, exists, eq, inArray } from "drizzle-orm";
import { parseFilterParams, parseLimitOffset } from "@/utils/server-utils";
import { like } from "drizzle-orm/pg-core/expressions";
import { v4 as uuidv4 } from "uuid";
import { CouponFormData } from "@/utils/types";

export async function getCouponsWithProperties(searchParams: any) {
  try {
    const { limit, offset } = parseLimitOffset(searchParams);
    const filterParams = parseFilterParams(searchParams);

    // 1. First get the coupons based on filters
    const query = db.select().from(coupons);

    let queryWithFilter;
    if (filterParams) {
      if (filterParams.searchKey === "Name") {
        queryWithFilter = query.where(
          like(coupons.name, `%${filterParams.searchValue}%`),
        );
      } else if (filterParams.searchKey === "Code") {
        queryWithFilter = query.where(
          like(coupons.code, `%${filterParams.searchValue}%`),
        );
      }
    }

    const couponsData = await (queryWithFilter ? queryWithFilter : query)
      .limit(limit)
      .offset(offset);

    // 2. For each coupon, get the associated properties
    const couponsWithProperties = await Promise.all(
      couponsData.map(async (coupon) => {
        // Query to get all property names associated with this coupon
        const associatedProperties = await db
          .select({
            propertyName: properties.propertyName,
          })
          .from(propertiesOnCoupons)
          .innerJoin(
            properties,
            eq(propertiesOnCoupons.propertyId, properties.id),
          )
          .where(eq(propertiesOnCoupons.couponId, coupon.id));

        // Extract just the property names
        const propertyNames = associatedProperties
          .map((prop) => prop.propertyName)
          .filter(Boolean); // Filter out any null/undefined property names
        const days = coupon.applicableDays.split("\n");

        // Return the coupon with the added property names
        return {
          ...coupon,
          days,
          propertiesList: propertyNames,
        };
      }),
    );

    return {
      data: couponsWithProperties,
      limit,
      offset,
    };
  } catch (error) {
    console.error("DB Error: ", error);
    throw new Error("Database Error");
  }
}

export async function getUsersWithProperties() {
  try {
    const result = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(users)
      .where(
        or(
          exists(
            db
              .select()
              .from(ownersOnProperties)
              .where(eq(ownersOnProperties.ownerId, users.id)),
          ),
          exists(
            db
              .select()
              .from(managersOnProperties)
              .where(eq(managersOnProperties.managerId, users.id)),
          ),
          exists(
            db
              .select()
              .from(caretakersOnProperties)
              .where(eq(caretakersOnProperties.caretakerId, users.id)),
          ),
        ),
      );

    return result;
  } catch (error) {
    console.error("Failed to fetch users with properties:", error);
    throw new Error("Error fetching users with properties");
  }
}

export async function getPropertyNamesByUserId(userId: string) {
  try {
    // Step 1: Get property IDs from all roles
    const ownerProps = await db
      .select({ propertyId: ownersOnProperties.propertyId })
      .from(ownersOnProperties)
      .where(eq(ownersOnProperties.ownerId, userId));

    const managerProps = await db
      .select({ propertyId: managersOnProperties.propertyId })
      .from(managersOnProperties)
      .where(eq(managersOnProperties.managerId, userId));

    const caretakerProps = await db
      .select({ propertyId: caretakersOnProperties.propertyId })
      .from(caretakersOnProperties)
      .where(eq(caretakersOnProperties.caretakerId, userId));

    // Combine and deduplicate property IDs
    const allPropertyIds = [...ownerProps, ...managerProps, ...caretakerProps]
      .map((item) => item.propertyId)
      .filter((id, index, self) => self.indexOf(id) === index);

    if (allPropertyIds.length === 0) return [];

    // Step 2: Fetch only id and name
    const result = await db
      .select({ id: properties.id, name: properties.propertyName })
      .from(properties)
      .where(inArray(properties.id, allPropertyIds));

    return result;
  } catch (error) {
    console.error("Error fetching property names by userId:", error);
    throw new Error("Unable to fetch properties");
  }
}

export async function createCouponWithProperties(
  couponData: any,
  properties: any,
) {
  if (properties.length == 0) {
    console.error("No Properties Selected.");
    throw new Error("No Properties Selected.");
  }
  if (couponData.validFrom === couponData.validTo) {
    console.error("Set Date Properly.");
    throw new Error("Set Date Properly.");
  }
  if (couponData.applicableDays === "") {
    console.error("Days are not selected.");
    throw new Error("Days are not selected");
  }
  if (
    couponData.value == 0 ||
    (couponData.maxDiscountValue == null &&
      couponData.discountType == "percentage")
  ) {
    console.error("Discount Amount is Zero.");
    throw new Error("Discount Amount is Zero.");
  }
  try {
    const couponId = uuidv4();
    // Insert into coupons table
    await db.insert(coupons).values({
      id: couponId,
      name: couponData.name,
      code: couponData.code,
      validFrom: couponData.validFrom,
      validTo: couponData.validTo,
      discountType: couponData.discountType,
      value: couponData.value,
      maxDiscountValue:
        couponData.discountType === "percentage"
          ? (couponData.maxDiscountValue ?? null)
          : null,
      applicableDays: couponData.applicableDays,
    });

    // Insert into propertiesOnCoupons table
    const propertyLinks = properties.map((propertyId: string) => ({
      propertyId,
      couponId,
    }));

    await db.insert(propertiesOnCoupons).values(propertyLinks);

    return { success: true, couponId };
  } catch (error) {
    console.error("Error creating coupon with properties:", error);
    throw new Error("Database Error");
  }
}

export async function deleteCouponWithProperties(couponId: string) {
  try {
    // Step 1: Delete from propertiesOnCoupons where couponId = ?
    await db
      .delete(propertiesOnCoupons)
      .where(eq(propertiesOnCoupons.couponId, couponId));

    // Step 2: Delete from coupons table where id = ?
    await db.delete(coupons).where(eq(coupons.id, couponId));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return { success: false, error: "Error deleting coupon" };
  }
}

export async function updateCouponWithProperties(
  couponData: CouponFormData,
  properties: string[],
) {
  if (properties.length == 0) {
    console.error("No Properties Selected.");
    throw new Error("No Properties Selected.");
  }
  if (couponData.validFrom === couponData.validTo) {
    console.error("Set Date Properly.");
    throw new Error("Set Date Properly.");
  }
  if (couponData.applicableDays === "") {
    console.error("Days are not selected.");
    throw new Error("Days are not selected");
  }
  if (
    couponData.value == 0 ||
    (couponData.maxDiscountValue == null &&
      couponData.discountType == "percentage")
  ) {
    console.error("Discount Amount is Zero.");
    throw new Error("Discount Amount is Zero.");
  }
  try {
    // 1. Update coupon in coupons table
    await db
      .update(coupons)
      .set({
        name: couponData.name,
        code: couponData.code,
        validFrom: couponData.validFrom,
        validTo: couponData.validTo,
        discountType: couponData.discountType,
        value: couponData.value,
        maxDiscountValue:
          couponData.discountType === "percentage"
            ? (couponData.maxDiscountValue ?? null)
            : null,
        applicableDays: couponData.applicableDays,
      })
      .where(eq(coupons.id, couponData.id));

    // 2. Remove old property associations
    await db
      .delete(propertiesOnCoupons)
      .where(eq(propertiesOnCoupons.couponId, couponData.id));

    // 3. Insert new property associations
    const newLinks = properties.map((propertyId) => ({
      couponId: couponData.id,
      propertyId,
    }));

    if (newLinks.length > 0) {
      await db.insert(propertiesOnCoupons).values(newLinks);
    }

    return {
      success: true,
      couponId: "123123123123",
    };
  } catch (error) {
    console.error("Error updating coupon with properties:", error);
    throw new Error("Failed to update coupon");
  }
}
