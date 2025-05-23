import {
  activities,
  admins,
  amenities,
  areas,
  bookings,
  cities,
  properties,
  propertyTypes,
  states,
  timestamps,
  users,
} from "@/drizzle/schema";

export const roleOptions = ["Owner", "Manager", "Caretaker"] as const;
export const webhookStatusOptions = ["PENDING", "PROCESSED"] as const;
export const genderOptions = ["Male", "Female"] as const;
export const refundStatusOptions = ["Pending", "Completed"] as const;
export const cancellationTypeOptions = ["Online", "Offline"] as const;
export const bookingTypeOptions = ["Online", "Offline"] as const;
export const transactionTypeOptions = ["Credit", "Debit"] as const;
export const paymentTypeOptions = ["Security Deposit", "Rent"] as const;
export const paymentModeOptions = ["Cash", "Online"] as const;

export interface ServerActionResult {
  success?: string;
  error?: string;
  status?: number;
}

export interface ServerSearchResult<T> {
  data?: T;
  error?: string;
  status?: number;
}

export interface ServerPageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export type TimestampKeys = keyof typeof timestamps;

export type Admin = Omit<typeof admins.$inferSelect, TimestampKeys>;

export type Activity = Omit<typeof activities.$inferSelect, TimestampKeys>;

export type Amenity = Omit<typeof amenities.$inferSelect, TimestampKeys>;

export type _Area = Omit<typeof areas.$inferSelect, TimestampKeys>;

export type Area = _Area & {
  id: string;
  area: string;
  city: {
    id: string;
    city: string;
  } | null;
  state: {
    id: string;
    state: string;
  } | null;
};

export type _City = Omit<typeof cities.$inferSelect, TimestampKeys>;

export type City = _City & {
  id: string;
  city: string;
  state: {
    id: string;
    state: string;
  } | null;
};

export type _Property = Omit<typeof properties.$inferSelect, TimestampKeys>;

export type Property = _Property & {
  area: {
    id: string;
    area: string;
  } | null;
  city: {
    id: string;
    city: string;
  } | null;
  state: {
    id: string;
    state: string;
  } | null;
};

export type PropertyType = Omit<
  typeof propertyTypes.$inferSelect,
  TimestampKeys
>;

export type State = Omit<typeof states.$inferSelect, TimestampKeys>;

export type UserRole = (typeof roleOptions)[number];

export type User = Omit<typeof users.$inferSelect, TimestampKeys>;

export type Gender = (typeof genderOptions)[number];
export type RefundStatus = (typeof refundStatusOptions)[number];
export type CancellationType = (typeof cancellationTypeOptions)[number];
export type BookingType = (typeof bookingTypeOptions)[number];

export type _BookingData = Omit<typeof bookings.$inferSelect, TimestampKeys>;

export type BookingData = _BookingData & {
  property: {
    id: string | null;
    propertyName: string | null;
    propertyCode: string | null;

    bedroomCount: number | null;
    bathroomCount: number | null;
    doubleBedCount: number | null;
    singleBedCount: number | null;
    mattressCount: number | null;
    baseGuestCount: number | null;
    maxGuestCount: number | null;
    defaultGstPercentage: number | null;
    checkinTime: string | null;
    checkoutTime: string | null;
  } | null;
  cancellation: _CancellationData | null;
  customer: CustomerData | null;
};

export type TransactionType = (typeof transactionTypeOptions)[number];
export type PaymentType = (typeof paymentTypeOptions)[number];
export type PaymentMode = (typeof paymentModeOptions)[number];

export interface _PaymentData extends Omit<BankDetail, "id"> {
  id: string;
  bookingId: string;
  transactionType: TransactionType;
  amount: number;
  paymentDate: string;
  referencePersonId: string | null;
  paymentType: PaymentType;
  paymentMode: PaymentMode;
}

export interface PaymentData extends _PaymentData {
  referencePerson: User | null;
}

export interface _CancellationData {
  bookingId: string;
  refundAmount: number;
  refundStatus: RefundStatus;
  cancellationType: CancellationType;
  referencePersonId: string;
}

export interface CancellationData extends _CancellationData {
  referencePerson: User;
}

export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  dob: string | null;
  mobileNumber: string;
  gender: Gender | null;
}

export interface AmenityData {
  id: string;
  weight: number | null;
  amenity: string;
  isPaid: boolean;
  isUSP: boolean;
}

export interface ActivityData {
  id: string;
  weight: number | null;
  activity: string;
  isPaid: boolean;
  isUSP: boolean;
}

export interface Owner {
  propertyId: string;
  ownerId: string;
}

export interface Manager {
  propertyId: string;
  managerId: string;
}

export interface Caretaker {
  propertyId: string;
  caretakerId: string;
}

export interface SpecialDateData {
  id: string;
  date: string;
  price: number | null;
  adultExtraGuestCharge: number | null;
  childExtraGuestCharge: number | null;
  infantExtraGuestCharge: number | null;
  baseGuestCount: number | null;
  discount: number | null;
}

export interface BlockedDate {
  id: string;
  blockedDate: string;
}

export interface BankDetail {
  id: string;
  bankAccountNumber: string | null;
  bankName: string | null;
  bankAccountHolderName: string | null;
  bankIfsc: string | null;
  bankNickname: string | null;
}

export interface DateInfo {
  price: number | null;
  status: DateState;
}

export enum DateState {
  IDLE = "IDLE",
  BOOKED = "BOOKED",
  BLOCKED = "BLOCKED",
  HIDDEN = "HIDDEN",
  LOADING = "LOADING",
}

export type NewBookingData = Omit<_BookingData, "customerId"> & {
  customer: CustomerData | null;
  customerId: string | null;
  payments: _PaymentData[];
};

export type DefaultPricingData = Pick<
  _Property,
  | "weekdayPrice"
  | "weekdayBaseGuestCount"
  | "weekdayAdultExtraGuestCharge"
  | "weekdayChildExtraGuestCharge"
  | "weekdayInfantExtraGuestCharge"
  | "weekdayDiscount"
  | "weekendPrice"
  | "weekendBaseGuestCount"
  | "weekendAdultExtraGuestCharge"
  | "weekendChildExtraGuestCharge"
  | "weekendInfantExtraGuestCharge"
  | "weekendDiscount"
  | "weekendSaturdayPrice"
  | "weekendSaturdayBaseGuestCount"
  | "weekendSaturdayAdultExtraGuestCharge"
  | "weekendSaturdayChildExtraGuestCharge"
  | "weekendSaturdayInfantExtraGuestCharge"
  | "weekendSaturdayDiscount"
  | "mondayPrice"
  | "mondayBaseGuestCount"
  | "mondayAdultExtraGuestCharge"
  | "mondayChildExtraGuestCharge"
  | "mondayInfantExtraGuestCharge"
  | "mondayDiscount"
  | "tuesdayPrice"
  | "tuesdayBaseGuestCount"
  | "tuesdayAdultExtraGuestCharge"
  | "tuesdayChildExtraGuestCharge"
  | "tuesdayInfantExtraGuestCharge"
  | "tuesdayDiscount"
  | "wednesdayPrice"
  | "wednesdayBaseGuestCount"
  | "wednesdayAdultExtraGuestCharge"
  | "wednesdayChildExtraGuestCharge"
  | "wednesdayInfantExtraGuestCharge"
  | "wednesdayDiscount"
  | "thursdayPrice"
  | "thursdayBaseGuestCount"
  | "thursdayAdultExtraGuestCharge"
  | "thursdayChildExtraGuestCharge"
  | "thursdayInfantExtraGuestCharge"
  | "thursdayDiscount"
  | "fridayPrice"
  | "fridayBaseGuestCount"
  | "fridayAdultExtraGuestCharge"
  | "fridayChildExtraGuestCharge"
  | "fridayInfantExtraGuestCharge"
  | "fridayDiscount"
  | "saturdayPrice"
  | "saturdayBaseGuestCount"
  | "saturdayAdultExtraGuestCharge"
  | "saturdayChildExtraGuestCharge"
  | "saturdayInfantExtraGuestCharge"
  | "saturdayDiscount"
  | "sundayPrice"
  | "sundayBaseGuestCount"
  | "sundayAdultExtraGuestCharge"
  | "sundayChildExtraGuestCharge"
  | "sundayInfantExtraGuestCharge"
  | "sundayDiscount"
  | "daywisePrice"
>;

export type PropertyDataWithRole = Property & { role: UserRole };
