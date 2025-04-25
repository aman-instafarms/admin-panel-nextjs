"use server";

import { db } from "@/drizzle/db";
import { bookings, cancellations } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import {
  parseBookingFormData,
  parseCancellationFormData,
} from "@/utils/server-utils";
import { v4 } from "uuid";

export const createBooking = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const {
    propertyId,
    customerId,
    bookingType,
    bookingSource,
    adultCount,
    childrenCount,
    infantCount,
    checkinDate,
    checkoutDate,
    bookingCreatorId,
    bookingCreatorRole,
    bookingRemarks,
    specialRequests,
    rentalCharge,
    extraGuestCharge,
    ownerDiscount,
    multipleNightsDiscount,
    couponDiscount,
    totalDiscount,
    gstAmount,
    gstPercentage,
    otaCommission,
    paymentGatewayCharge,
    netOwnerRevenue,
  } = parseBookingFormData(formData);

  return await db
    .insert(bookings)
    .values({
      id: v4(),
      propertyId,
      customerId,
      bookingType,
      bookingSource,
      adultCount,
      childrenCount,
      infantCount,
      checkinDate,
      checkoutDate,
      bookingCreatorId,
      bookingCreatorRole,
      bookingRemarks,
      specialRequests,
      rentalCharge,
      extraGuestCharge,
      ownerDiscount,
      multipleNightsDiscount,
      couponDiscount,
      totalDiscount,
      gstAmount,
      gstPercentage,
      otaCommission,
      paymentGatewayCharge,
      netOwnerRevenue,
    })
    .then(() => {
      revalidatePath("/admin");
      return { success: "Booking created." };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};

export const cancelBooking = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  const {
    bookingId,
    refundAmount,
    refundStatus,
    cancellationType,
    referencePersonId,
    referencePersonRole,
  } = parseCancellationFormData(formData);

  return await db
    .insert(cancellations)
    .values({
      bookingId,
      refundAmount,
      refundStatus,
      cancellationType,
      referencePersonId,
      referencePersonRole,
    })
    .then(() => {
      revalidatePath("/admin");
      return { success: "Booking Cancelled" };
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database error.");
    });
};
