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
import { or, exists, eq, inArray, sql } from "drizzle-orm";
import { parseFilterParams, parseLimitOffset } from "@/utils/server-utils";
import { like } from "drizzle-orm/pg-core/expressions";
import { v4 as uuidv4 } from "uuid";
import { CouponFormData, ServerPageProps } from "@/utils/types";
import { _couponFields } from "@/drizzle/fields";

type SearchParamsType = ServerPageProps["searchParams"];

export async function getProperties() {
  try {
    const propertiesData = await db.execute(sql`
      WITH property_basics AS (
        SELECT 
          p.id,
          p."propertyName",
          p."propertyCode",
          a.area,
          c.city,
          s.state
        FROM "properties" p
        LEFT JOIN "areas" a ON p."areaId" = a.id
        LEFT JOIN "cities" c ON p."cityId" = c.id
        LEFT JOIN "states" s ON p."stateId" = s.id
      ),
      
      managers AS (
        SELECT 
          mp."propertyId",
          json_agg(
            CASE
              WHEN u."lastName" IS NULL THEN u."firstName"
              ELSE u."firstName" || ' ' || u."lastName"
            END
          ) as managers_list
        FROM "managersOnProperties" mp
        JOIN "users" u ON mp."managerId" = u.id
        GROUP BY mp."propertyId"
      ),
      
      owners AS (
        SELECT 
          op."propertyId",
          json_agg(
            CASE
              WHEN u."lastName" IS NULL THEN u."firstName"
              ELSE u."firstName" || ' ' || u."lastName"
            END
          ) as owners_list
        FROM "ownersOnProperties" op
        JOIN "users" u ON op."ownerId" = u.id
        GROUP BY op."propertyId"
      )
      
      SELECT 
        pb.*,
        COALESCE(m.managers_list, '[]'::json) as "managersList",
        COALESCE(o.owners_list, '[]'::json) as "ownersList"
      FROM property_basics pb
      LEFT JOIN managers m ON pb.id = m."propertyId"
      LEFT JOIN owners o ON pb.id = o."propertyId"
  `);
    return propertiesData.rows;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }
}

export async function getCouponsWithProperties(searchParams: SearchParamsType) {
  try {
    const { limit, offset } = parseLimitOffset(await searchParams);
    const filterParams = parseFilterParams(await searchParams);

    // Query to get all the coupon key and with [...List of properties]
    const baseQuery = db
      .select({
        ..._couponFields,
        propertiesList: sql<
          string[]
        >`COALESCE(array_agg(${properties.propertyName}), ARRAY[]::text[])`,
      })
      .from(coupons)
      .leftJoin(
        propertiesOnCoupons,
        eq(coupons.id, propertiesOnCoupons.couponId),
      )
      .leftJoin(properties, eq(properties.id, propertiesOnCoupons.propertyId))
      .groupBy(coupons.id)
      .limit(limit)
      .offset(offset);

    // Apply filters conditionally
    if (filterParams) {
      const { searchKey, searchValue } = filterParams;
      if (searchKey === "Name") {
        baseQuery.where(
          like(sql`LOWER(${coupons.name})`, `${searchValue.toLowerCase()}%`),
        );
      } else if (searchKey === "Code") {
        baseQuery.where(
          like(sql`LOWER(${coupons.code})`, `${searchValue.toLowerCase()}%`),
        );
      }
    }

    const couponsWithProperties = await baseQuery;

    return {
      data: couponsWithProperties,
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
