"use server";

import { db } from "@/drizzle/db";
import { bookings, cancellations, payments } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/utils/types";
import {
  parseBookingFormData,
  parseCancellationFormData,
  parsePaymentFormData,
} from "@/utils/server-utils";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/utils/admin-only";

export const createBooking = async (
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
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

    const paymentData = parsePaymentFormData(formData);
    const bookingId = v4();

    return await db
      .transaction(async (tx) => {
        await tx.insert(bookings).values({
          id: bookingId,
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
        });
        if (paymentData.length > 0) {
          await tx
            .insert(payments)
            .values(
              paymentData.map((p) => ({
                bookingId,
                transactionType: p.transactionType,
                amount: p.amount,
                paymentDate: p.paymentDate,
                referencePersonId: p.referencePersonId,
                paymentType: p.paymentType,
                paymentMode: p.paymentMode,
                bankName: p.bankName,
                bankAccountNumber: p.bankAccountNumber,
                bankAccountHolderName: p.bankAccountHolderName,
                bankIfsc: p.bankIfsc,
                bankNickname: p.bankNickname,
              })),
            )
            .catch((err) => {
              console.log(err);
              throw new Error("Database error");
            });
        }
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "Booking created." };
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

export const updateBooking = async (
  bookingId: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    if (!bookingId) {
      return { error: "Invalid booking id" };
    }
    const paymentData = parsePaymentFormData(formData);
    return await db.transaction(async (tx) => {
      await tx
        .update(payments)
        .set({ isDeleted: true })
        .where(eq(payments.bookingId, bookingId))
        .catch((err) => {
          console.log("DB Error ", err);
          return { error: "Database error" };
        });
      if (paymentData.length > 0) {
        await tx
          .insert(payments)
          .values(
            paymentData.map((p) => ({
              bookingId,
              transactionType: p.transactionType,
              amount: p.amount,
              paymentDate: p.paymentDate,
              referencePersonId: p.referencePersonId,
              paymentType: p.paymentType,
              paymentMode: p.paymentMode,
              bankName: p.bankName,
              bankAccountNumber: p.bankAccountNumber,
              bankAccountHolderName: p.bankAccountHolderName,
              bankIfsc: p.bankIfsc,
              bankNickname: p.bankNickname,
            })),
          )
          .catch((err) => {
            console.log("DB Error ", err);
            return { error: "Database error" };
          });
      }
      return { success: "Booking updated" };
    });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Server Error." };
    }
  }
};

export const cancelBooking = async (
  bookingId: string,
  formData: FormData,
): Promise<ServerActionResult> => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const { refundAmount, refundStatus, cancellationType, referencePersonId } =
      parseCancellationFormData(formData);

    const res = await db
      .update(cancellations)
      .set({
        refundAmount,
        refundStatus,
        cancellationType,
        referencePersonId,
      })
      .where(eq(cancellations.bookingId, bookingId))
      .returning({ bookingId: cancellations.bookingId })
      .then((res) => {
        if (res.length === 0) {
          return null;
        }
        revalidatePath("/admin");
        return { success: "Cancellation data updated" };
      })
      .catch((err) => {
        console.log("DB Error: ", err);
        throw new Error("Database error.");
      });
    if (res) {
      return res;
    }

    return await db
      .insert(cancellations)
      .values({
        refundAmount,
        refundStatus,
        cancellationType,
        referencePersonId,
        bookingId,
      })
      .then(() => {
        revalidatePath("/admin");
        return { success: "Booking Cancelled" };
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
