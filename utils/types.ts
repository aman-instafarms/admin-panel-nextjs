import { rolesEnum } from "@/drizzle/schema";

export interface ServerActionResult {
  success?: string;
  error?: string;
  status?: number;
}

export interface ServerPageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface DefaultPricing {
  weekdayPrice: number | null;
  weekendPrice: number | null;
  mondayPrice: number | null;
  tuesdayPrice: number | null;
  wednesdayPrice: number | null;
  thursdayPrice: number | null;
  fridayPrice: number | null;
  saturdayPrice: number | null;
  sundayPrice: number | null;
  daywisePrice: boolean | null;
}

export interface AdminData {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
}

export interface ActivityData {
  id: string;
  activity: string;
}

export interface AmenityData {
  id: string;
  amenity: string;
}

export interface _AreaData {
  id: string;
  area: string;
  cityId: string;
}

export interface AreaData {
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
}

export interface _CityData {
  id: string;
  city: string;
  stateId: string;
}

export interface CityData {
  id: string;
  city: string;
  state: {
    id: string;
    state: string;
  } | null;
}

export interface _PropertyData {
  id: string;

  // Property Detail
  propertyName: string | null;
  propertyCode: string | null;
  baseGuestCount: number | null;
  maxGuestCount: number | null;

  // Day wise price and charges
  // weekday -> mon, tue, wed, thu
  // weekend -> fri, sun
  // weekendSaturday -> sat
  weekdayPrice: number | null;
  weekdayAdultExtraGuestCharge: number | null;
  weekdayChildExtraGuestCharge: number | null;
  weekdayInfantExtraGuestCharge: number | null;
  weekdayBaseGuestCount: number | null;
  weekdayDiscount: number | null;

  weekendPrice: number | null; // fri, sun
  weekendAdultExtraGuestCharge: number | null;
  weekendChildExtraGuestCharge: number | null;
  weekendInfantExtraGuestCharge: number | null;
  weekendBaseGuestCount: number | null;
  weekendDiscount: number | null;

  weekendSaturdayPrice: number | null; // sat
  weekendSaturdayAdultExtraGuestCharge: number | null;
  weekendSaturdayChildExtraGuestCharge: number | null;
  weekendSaturdayInfantExtraGuestCharge: number | null;
  weekendSaturdayBaseGuestCount: number | null;
  weekendSaturdayDiscount: number | null;

  mondayPrice: number | null;
  mondayAdultExtraGuestCharge: number | null;
  mondayChildExtraGuestCharge: number | null;
  mondayInfantExtraGuestCharge: number | null;
  mondayBaseGuestCount: number | null;
  mondayDiscount: number | null;

  tuesdayPrice: number | null;
  tuesdayAdultExtraGuestCharge: number | null;
  tuesdayChildExtraGuestCharge: number | null;
  tuesdayInfantExtraGuestCharge: number | null;
  tuesdayBaseGuestCount: number | null;
  tuesdayDiscount: number | null;

  wednesdayPrice: number | null;
  wednesdayAdultExtraGuestCharge: number | null;
  wednesdayChildExtraGuestCharge: number | null;
  wednesdayInfantExtraGuestCharge: number | null;
  wednesdayBaseGuestCount: number | null;
  wednesdayDiscount: number | null;

  thursdayPrice: number | null;
  thursdayAdultExtraGuestCharge: number | null;
  thursdayChildExtraGuestCharge: number | null;
  thursdayInfantExtraGuestCharge: number | null;
  thursdayBaseGuestCount: number | null;
  thursdayDiscount: number | null;

  fridayPrice: number | null;
  fridayAdultExtraGuestCharge: number | null;
  fridayChildExtraGuestCharge: number | null;
  fridayInfantExtraGuestCharge: number | null;
  fridayBaseGuestCount: number | null;
  fridayDiscount: number | null;

  saturdayPrice: number | null;
  saturdayAdultExtraGuestCharge: number | null;
  saturdayChildExtraGuestCharge: number | null;
  saturdayInfantExtraGuestCharge: number | null;
  saturdayBaseGuestCount: number | null;
  saturdayDiscount: number | null;

  sundayPrice: number | null;
  sundayAdultExtraGuestCharge: number | null;
  sundayChildExtraGuestCharge: number | null;
  sundayInfantExtraGuestCharge: number | null;
  sundayBaseGuestCount: number | null;
  sundayDiscount: number | null;

  // day wise flag
  daywisePrice: boolean | null;

  // property status
  isDisabled: boolean | null;

  // room details
  bedroomCount: number | null;
  bathroomCount: number | null;
  doubleBedCount: number | null;
  singleBedCount: number | null;
  mattressCount: number | null;

  // booking defaults
  bookingType: string | null;
  defaultGstPercentage: number | null;

  // location
  latitude: string | null;
  longtitude: string | null;
  mapLink: string | null;

  // address
  address: string | null;
  areaId: string | null;
  cityId: string | null;
  stateId: string | null;
  pincode: string | null;

  propertyTypeId: string | null;

  // json data
  amenities: AmenityData[] | null;
  activities: ActivityData[] | null;
}

export interface PropertyData
  extends Omit<_PropertyData, "areaId" | "stateId" | "cityId"> {
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
}

export interface PropertyTypeData {
  id: string;
  name: string;
}

export interface StateData {
  id: string;
  state: string;
}

export type UserRole = (typeof rolesEnum.enumValues)[number];

export interface UserData {
  id: string;
  firstName: string;
  lastName: string | null;
  mobileNumber: string | null;
  whatsappNumber: string | null;
  email: string;
  role: UserRole;
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

export interface Amenity {
  id: string;
  amenity: string;
}

export interface Activity {
  id: string;
  activity: string;
}
