import "server-only";
import {
  _BookingData,
  _CancellationData,
  _PaymentData,
  _PropertyData,
  ActivityData,
  AdminData,
  AmenityData,
  BankDetail,
  CustomerData,
  DefaultPricing,
  Owner,
  UserData,
} from "./types";
import { DateTime } from "luxon";
import { v4 } from "uuid";
import { SpecialDateData } from "./types";
import {
  bookingTypeEnum,
  cancellationTypeEnum,
  genderEnum,
  paymentModeEnum,
  paymentTypeEnum,
  refundStatusEnum,
  rolesEnum,
  transactionTypeEnum,
} from "@/drizzle/schema";

export function uniqueStringFilter(data: string[]): string[] {
  const set = new Set<string>();
  const res: string[] = [];
  data.forEach((str) => {
    if (!set.has(str)) {
      set.add(str);
      res.push(str);
    }
  });
  return res;
}

export function parseFilterParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): { searchKey: string; searchValue: string } | null {
  const { searchKey, searchValue } = searchParams;
  if (
    typeof searchKey === "string" &&
    typeof searchValue === "string" &&
    searchKey.length > 0 &&
    searchValue.length > 0
  ) {
    return { searchKey, searchValue };
  }
  return null;
}

export function parseLimitOffset(searchParams: {
  [key: string]: string | string[] | undefined;
}): { limit: number; offset: number } {
  const { page, itemsPerPage } = searchParams;

  let limit = 10;
  let offset = 0;

  if (itemsPerPage) {
    const itemsPerPageNum = Number(itemsPerPage);
    if (!Number.isNaN(itemsPerPageNum)) {
      limit = Math.min(100, itemsPerPageNum);
    }
  }

  if (page) {
    const pageNum = Number(page);
    if (!Number.isNaN(pageNum)) {
      offset = Math.max(0, limit * (pageNum - 1));
    }
  }

  return { limit, offset };
}

export function parseString(str: string | undefined): string | null {
  if (str === undefined || str.length === 0) {
    return null;
  }
  return str;
}

export function parseBoolean(str: string | undefined): boolean {
  if (str?.toLowerCase() === "true") return true;
  return false;
}

export function parseNumber(str: string | undefined): number | null {
  if (str === undefined) {
    return null;
  }
  const num = Number(str);
  if (Number.isNaN(num)) {
    throw new Error("Invalid Value");
  }
  return num;
}

export function validateDateStr(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const dt = DateTime.fromSQL(dateStr);
  if (dt.isValid) {
    return dateStr;
  }
  return null;
}

export function validatePricing(data: DefaultPricing) {
  if (data.weekdayPrice === null || data.weekdayPrice <= 0) {
    return "Invalid Weekday Pricing.";
  }
  if (data.weekendPrice === null || data.weekendPrice <= 0) {
    return "Invalid Weekend Pricing.";
  }
  if (data.mondayPrice === null || data.mondayPrice <= 0) {
    return "Invalid Monday Pricing.";
  }
  if (data.tuesdayPrice === null || data.tuesdayPrice <= 0) {
    return "Invalid Tuesday Pricing.";
  }
  if (data.wednesdayPrice === null || data.wednesdayPrice <= 0) {
    return "Invalid Wednesday Pricing.";
  }
  if (data.thursdayPrice === null || data.thursdayPrice <= 0) {
    return "Invalid Thursday Pricing.";
  }
  if (data.fridayPrice === null || data.fridayPrice <= 0) {
    return "Invalid Friday Pricing.";
  }
  if (data.saturdayPrice === null || data.saturdayPrice <= 0) {
    return "Invalid Saturday Pricing.";
  }
  if (data.sundayPrice === null || data.sundayPrice <= 0) {
    return "Invalid Sunday Pricing.";
  }
  if (data.daywisePrice === null) {
    return "Missing day wise pricing flag.";
  }
}

export function validatePropertyData(data: _PropertyData): string | null {
  // Checks
  if (!data.propertyName || data.propertyName.length === 0) {
    return "Invalid Property Name.";
  }
  if (!data.checkinTime || data.checkinTime.length === 0) {
    return "Invalid Checkin time.";
  }

  if (!data.checkoutTime || data.checkoutTime.length === 0) {
    return "Invalid Checkout time.";
  }
  // Checking for repeated amenities
  if (data.amenities) {
    const uniqueAmenityTitles = uniqueStringFilter(
      data.amenities.map((x) => x.amenity),
    );
    if (uniqueAmenityTitles.length !== data.amenities.length) {
      return "Repeated amenities are not allowed.";
    }
  }
  if (data.activities) {
    const uniqueActivityTitles = uniqueStringFilter(
      data.activities.map((x) => x.activity),
    );
    if (uniqueActivityTitles.length !== data.activities.length) {
      return "Repeated activities are not allowed.";
    }
  }
  return null;
}

export function parseSpecialDates(formData: FormData): {
  data?: SpecialDateData[];
  error?: string;
} {
  const seen = new Set<string>();

  function isUniqueString(str: string): string | null {
    if (seen.has(str)) {
      return null; // Found a repeated string
    } else {
      seen.add(str);
      return str; // New string
    }
  }

  const res: SpecialDateData[] = [];
  for (const key of formData.keys()) {
    if (key.startsWith("special-date-")) {
      const uuid = key.substring(13);
      const dateStr = formData.get(`special-date-${uuid}`)?.toString();
      if (!dateStr) {
        return { error: "Invalid date." };
      }

      const uniqueString = isUniqueString(dateStr);
      if (!uniqueString) {
        return { error: "Repeated dates are not allowed." };
      }

      const data: SpecialDateData = {
        id: v4(),
        date: dateStr,
        price: parseNumber(formData.get(`special-price-${uuid}`)?.toString()),
        adultExtraGuestCharge: parseNumber(
          formData.get(`special-adultExtraGuestCharge-${uuid}`)?.toString(),
        ),
        childExtraGuestCharge: parseNumber(
          formData.get(`special-childExtraGuestCharge-${uuid}`)?.toString(),
        ),
        infantExtraGuestCharge: parseNumber(
          formData.get(`special-infantExtraGuestCharge-${uuid}`)?.toString(),
        ),
        baseGuestCount: parseNumber(
          formData.get(`special-baseGuestCount-${uuid}`)?.toString(),
        ),
        discount: parseNumber(
          formData.get(`special-discount-${uuid}`)?.toString(),
        ),
      };
      res.push(data);
    }
  }
  console.log(JSON.stringify(res));
  return { data: res };
}

export function parseAdminFormData(formData: FormData): AdminData {
  const firstName = parseString(formData.get("firstName")?.toString());
  const email = parseString(formData.get("email")?.toString());
  if (firstName === null) {
    throw new Error("Please enter admin first name.");
  }
  if (email === null) {
    throw new Error("Please enter admin email.");
  }
  return {
    id: v4(),
    firstName,
    lastName: parseString(formData.get("lastName")?.toString()),
    email,
    phoneNumber: parseString(formData.get("phoneNumber")?.toString()),
  };
}

export function parsePropertyFormData(formData: FormData): _PropertyData {
  const amenitiesIds: string[] = [];
  const activitiesIds: string[] = [];

  for (const key of formData.keys()) {
    if (key.startsWith("amenity-title-")) {
      amenitiesIds.push(key.substring(14));
    } else if (key.startsWith("activity-title-")) {
      activitiesIds.push(key.substring(15));
    }
  }

  const amenities: AmenityData[] = uniqueStringFilter(amenitiesIds).map(
    (id) => {
      const title = parseString(
        formData.get(`amenity-title-${id}`)?.toString(),
      );
      const weight = parseNumber(
        formData.get(`amenity-weight-${id}`)?.toString(),
      );
      const isPaid = parseBoolean(
        formData.get(`amenity-isPaid-${id}`)?.toString(),
      );
      const isUSP = parseBoolean(
        formData.get(`amenity-isUSP-${id}`)?.toString(),
      );
      if (!title || title.length === 0) {
        throw new Error("Invalid Amenity name.");
      }
      return { id: v4(), amenity: title, weight, isPaid, isUSP };
    },
  );

  const activities: ActivityData[] = uniqueStringFilter(activitiesIds).map(
    (id) => {
      const title = parseString(
        formData.get(`activity-title-${id}`)?.toString(),
      );
      const weight = parseNumber(
        formData.get(`activity-weight-${id}`)?.toString(),
      );
      const isPaid = parseBoolean(
        formData.get(`activity-isPaid-${id}`)?.toString(),
      );
      const isUSP = parseBoolean(
        formData.get(`activity-isUSP-${id}`)?.toString(),
      );
      if (!title || title.length === 0) {
        throw new Error("Invalid Activity name.");
      }
      return { id: v4(), activity: title, weight, isPaid, isUSP };
    },
  );

  return {
    id: v4(),
    propertyName: parseString(formData.get("propertyName")?.toString()),
    propertyCode: parseString(formData.get("propertyCode")?.toString()),
    baseGuestCount: parseNumber(formData.get("baseGuestCount")?.toString()),
    maxGuestCount: parseNumber(formData.get("maxGuestCount")?.toString()),

    weekdayPrice: parseNumber(formData.get("weekdayPrice")?.toString()),
    weekdayAdultExtraGuestCharge: parseNumber(
      formData.get("weekdayAdultExtraGuestCharge")?.toString(),
    ),
    weekdayChildExtraGuestCharge: parseNumber(
      formData.get("weekdayChildExtraGuestCharge")?.toString(),
    ),
    weekdayInfantExtraGuestCharge: parseNumber(
      formData.get("weekdayInfantExtraGuestCharge")?.toString(),
    ),
    weekdayBaseGuestCount: parseNumber(
      formData.get("weekdayBaseGuestCount")?.toString(),
    ),
    weekdayDiscount: parseNumber(formData.get("weekdayDiscount")?.toString()),

    weekendPrice: parseNumber(formData.get("weekendPrice")?.toString()),
    weekendAdultExtraGuestCharge: parseNumber(
      formData.get("weekendAdultExtraGuestCharge")?.toString(),
    ),
    weekendChildExtraGuestCharge: parseNumber(
      formData.get("weekendChildExtraGuestCharge")?.toString(),
    ),
    weekendInfantExtraGuestCharge: parseNumber(
      formData.get("weekendInfantExtraGuestCharge")?.toString(),
    ),
    weekendBaseGuestCount: parseNumber(
      formData.get("weekendBaseGuestCount")?.toString(),
    ),
    weekendDiscount: parseNumber(formData.get("weekendDiscount")?.toString()),

    weekendSaturdayPrice: parseNumber(
      formData.get("weekendSaturdayPrice")?.toString(),
    ),
    weekendSaturdayAdultExtraGuestCharge: parseNumber(
      formData.get("weekendSaturdayAdultExtraGuestCharge")?.toString(),
    ),
    weekendSaturdayChildExtraGuestCharge: parseNumber(
      formData.get("weekendSaturdayChildExtraGuestCharge")?.toString(),
    ),
    weekendSaturdayInfantExtraGuestCharge: parseNumber(
      formData.get("weekendSaturdayInfantExtraGuestCharge")?.toString(),
    ),
    weekendSaturdayBaseGuestCount: parseNumber(
      formData.get("weekendSaturdayBaseGuestCount")?.toString(),
    ),
    weekendSaturdayDiscount: parseNumber(
      formData.get("weekendSaturdayDiscount")?.toString(),
    ),

    mondayPrice: parseNumber(formData.get("mondayPrice")?.toString()),
    mondayAdultExtraGuestCharge: parseNumber(
      formData.get("mondayAdultExtraGuestCharge")?.toString(),
    ),
    mondayChildExtraGuestCharge: parseNumber(
      formData.get("mondayChildExtraGuestCharge")?.toString(),
    ),
    mondayInfantExtraGuestCharge: parseNumber(
      formData.get("mondayInfantExtraGuestCharge")?.toString(),
    ),
    mondayBaseGuestCount: parseNumber(
      formData.get("mondayBaseGuestCount")?.toString(),
    ),
    mondayDiscount: parseNumber(formData.get("mondayDiscount")?.toString()),

    tuesdayPrice: parseNumber(formData.get("tuesdayPrice")?.toString()),
    tuesdayAdultExtraGuestCharge: parseNumber(
      formData.get("tuesdayAdultExtraGuestCharge")?.toString(),
    ),
    tuesdayChildExtraGuestCharge: parseNumber(
      formData.get("tuesdayChildExtraGuestCharge")?.toString(),
    ),
    tuesdayInfantExtraGuestCharge: parseNumber(
      formData.get("tuesdayInfantExtraGuestCharge")?.toString(),
    ),
    tuesdayBaseGuestCount: parseNumber(
      formData.get("tuesdayBaseGuestCount")?.toString(),
    ),
    tuesdayDiscount: parseNumber(formData.get("tuesdayDiscount")?.toString()),

    wednesdayPrice: parseNumber(formData.get("wednesdayPrice")?.toString()),
    wednesdayAdultExtraGuestCharge: parseNumber(
      formData.get("wednesdayAdultExtraGuestCharge")?.toString(),
    ),
    wednesdayChildExtraGuestCharge: parseNumber(
      formData.get("wednesdayChildExtraGuestCharge")?.toString(),
    ),
    wednesdayInfantExtraGuestCharge: parseNumber(
      formData.get("wednesdayInfantExtraGuestCharge")?.toString(),
    ),
    wednesdayBaseGuestCount: parseNumber(
      formData.get("wednesdayBaseGuestCount")?.toString(),
    ),
    wednesdayDiscount: parseNumber(
      formData.get("wednesdayDiscount")?.toString(),
    ),

    thursdayPrice: parseNumber(formData.get("thursdayPrice")?.toString()),
    thursdayAdultExtraGuestCharge: parseNumber(
      formData.get("thursdayAdultExtraGuestCharge")?.toString(),
    ),
    thursdayChildExtraGuestCharge: parseNumber(
      formData.get("thursdayChildExtraGuestCharge")?.toString(),
    ),
    thursdayInfantExtraGuestCharge: parseNumber(
      formData.get("thursdayInfantExtraGuestCharge")?.toString(),
    ),
    thursdayBaseGuestCount: parseNumber(
      formData.get("thursdayBaseGuestCount")?.toString(),
    ),
    thursdayDiscount: parseNumber(formData.get("thursdayDiscount")?.toString()),

    fridayPrice: parseNumber(formData.get("fridayPrice")?.toString()),
    fridayAdultExtraGuestCharge: parseNumber(
      formData.get("fridayAdultExtraGuestCharge")?.toString(),
    ),
    fridayChildExtraGuestCharge: parseNumber(
      formData.get("fridayChildExtraGuestCharge")?.toString(),
    ),
    fridayInfantExtraGuestCharge: parseNumber(
      formData.get("fridayInfantExtraGuestCharge")?.toString(),
    ),
    fridayBaseGuestCount: parseNumber(
      formData.get("fridayBaseGuestCount")?.toString(),
    ),
    fridayDiscount: parseNumber(formData.get("fridayDiscount")?.toString()),

    saturdayPrice: parseNumber(formData.get("saturdayPrice")?.toString()),
    saturdayAdultExtraGuestCharge: parseNumber(
      formData.get("saturdayAdultExtraGuestCharge")?.toString(),
    ),
    saturdayChildExtraGuestCharge: parseNumber(
      formData.get("saturdayChildExtraGuestCharge")?.toString(),
    ),
    saturdayInfantExtraGuestCharge: parseNumber(
      formData.get("saturdayInfantExtraGuestCharge")?.toString(),
    ),
    saturdayBaseGuestCount: parseNumber(
      formData.get("saturdayBaseGuestCount")?.toString(),
    ),
    saturdayDiscount: parseNumber(formData.get("saturdayDiscount")?.toString()),

    sundayPrice: parseNumber(formData.get("mondayPrice")?.toString()),
    sundayAdultExtraGuestCharge: parseNumber(
      formData.get("sundayAdultExtraGuestCharge")?.toString(),
    ),
    sundayChildExtraGuestCharge: parseNumber(
      formData.get("sundayChildExtraGuestCharge")?.toString(),
    ),
    sundayInfantExtraGuestCharge: parseNumber(
      formData.get("sundayInfantExtraGuestCharge")?.toString(),
    ),
    sundayBaseGuestCount: parseNumber(
      formData.get("sundayBaseGuestCount")?.toString(),
    ),
    sundayDiscount: parseNumber(formData.get("sundayDiscount")?.toString()),

    daywisePrice: parseBoolean(formData.get("daywisePrice")?.toString()),

    isDisabled: parseBoolean(formData.get("isDisabled")?.toString()),

    bedroomCount: parseNumber(formData.get("bedroomCount")?.toString()),
    bathroomCount: parseNumber(formData.get("bathroomCount")?.toString()),
    doubleBedCount: parseNumber(formData.get("doubleBedCount")?.toString()),
    singleBedCount: parseNumber(formData.get("singleBedCount")?.toString()),
    mattressCount: parseNumber(formData.get("mattressCount")?.toString()),

    bookingType: parseString(formData.get("bookingType")?.toString()),
    defaultGstPercentage: parseNumber(
      formData.get("defaultGstPercentage")?.toString(),
    ),
    checkinTime: parseString(formData.get("checkinTime")?.toString()),
    checkoutTime: parseString(formData.get("checkoutTime")?.toString()),

    latitude: parseString(formData.get("latitude")?.toString()),
    longtitude: parseString(formData.get("longtitude")?.toString()),
    mapLink: parseString(formData.get("mapLink")?.toString()),

    address: parseString(formData.get("address")?.toString()),
    areaId: parseString(formData.get("areaId")?.toString()),
    cityId: parseString(formData.get("cityId")?.toString()),
    stateId: parseString(formData.get("stateId")?.toString()),
    pincode: parseString(formData.get("pincode")?.toString()),

    propertyTypeId: parseString(formData.get("propertyTypeId")?.toString()),
    activities,
    amenities,
  };
}

export function parseUserFormData(formData: FormData): UserData {
  const firstName = parseString(formData.get("firstName")?.toString());
  const email = parseString(formData.get("email")?.toString());
  const role = rolesEnum.enumValues.find(
    (x) => x === parseString(formData.get("role")?.toString()),
  );

  if (!firstName) {
    throw new Error("Name missing.");
  }
  if (!email) {
    throw new Error("Email missing.");
  }
  if (!role) {
    throw new Error("Invalid role.");
  }

  return {
    id: v4(),
    firstName,
    lastName: parseString(formData.get("lastName")?.toString()),
    mobileNumber: parseString(formData.get("mobileNumber")?.toString()),
    whatsappNumber: parseString(formData.get("whatsappNumber")?.toString()),
    email: email.toLowerCase(),
    role,
  };
}

export function parseCancellationFormData(
  formData: FormData,
): Omit<_CancellationData, "bookingId"> {
  const refundAmount = parseNumber(formData.get("refundAmount")?.toString());
  const refundStatus = refundStatusEnum.enumValues.find(
    (x) => x === formData.get("refundStatus")?.toString(),
  );
  const cancellationType = cancellationTypeEnum.enumValues.find(
    (x) => x === formData.get("cancellationType")?.toString(),
  );
  const referencePersonId = parseString(
    formData.get("cancellationReferencePersonId")?.toString(),
  );
  const referencePersonRole = rolesEnum.enumValues.find(
    (x) => x === formData.get("cancellationReferencePersonRole")?.toString(),
  );

  if (!refundAmount) {
    throw new Error("Invalid Refund Amount");
  }
  if (!refundStatus) {
    throw new Error("Invalid Refund Status");
  }
  if (!cancellationType) {
    throw new Error("Invalid Cancellation type.");
  }
  if (!referencePersonId) {
    throw new Error("No reference person selected");
  }
  if (!referencePersonRole) {
    throw new Error("Select reference person role");
  }

  return {
    refundAmount,
    refundStatus,
    cancellationType,
    referencePersonId,
    referencePersonRole,
  };
}

export function parsePaymentFormData(
  formData: FormData,
): Omit<_PaymentData, "bookingId">[] {
  const ids: string[] = [];
  for (const key of formData.keys()) {
    if (key.startsWith("payment-amount-")) {
      ids.push(key.substring(15));
    }
  }

  const data = ids.map((id) => {
    const amount = parseNumber(
      formData.get(`payment-amount-${id}`)?.toString(),
    );
    const paymentDate = parseString(formData.get(`payment-${id}`)?.toString());
    const referencePersonId = parseString(
      formData.get(`payment-referencePersonId-${id}`)?.toString(),
    );
    const referencePersonRole = rolesEnum.enumValues.find(
      (x) =>
        x ===
        parseString(
          formData.get(`payment-referencePersonRole-${id}`)?.toString(),
        ),
    );
    const paymentMode = paymentModeEnum.enumValues.find(
      (x) =>
        x ===
        parseString(formData.get(`payment-paymentMode-${id}`)?.toString()),
    );
    const transactionType = transactionTypeEnum.enumValues.find(
      (x) =>
        x ===
        parseString(formData.get(`payment-transactionType-${id}`)?.toString()),
    );
    const paymentType = paymentTypeEnum.enumValues.find(
      (x) =>
        x ===
        parseString(formData.get(`payment-paymentType-${id}`)?.toString()),
    );
    if (!amount) {
      throw new Error("Invalid Amount.");
    }
    if (!paymentDate || !DateTime.fromSQL(paymentDate).isValid) {
      throw new Error("Invalid payment date.");
    }
    if (!referencePersonId || !referencePersonRole) {
      throw new Error("No reference person selected.");
    }
    if (!transactionType) {
      throw new Error("Select transaction type.");
    }
    if (!paymentType) {
      throw new Error("Select payment type.");
    }
    if (!paymentMode) {
      throw new Error("Select payment mode.");
    }
    return {
      id,
      paymentDate,
      transactionType: transactionType,
      amount,
      referencePersonId,
      referencePersonRole,
      paymentType,
      paymentMode,
      bankName: parseString(formData.get(`bankName-${id}`)?.toString()),
      bankAccountHolderName: parseString(
        formData.get(`bankAccountHolderName-${id}`)?.toString(),
      ),
      bankAccountNumber: parseString(
        formData.get(`bankAccountNumber-${id}`)?.toString(),
      ),
      bankIfsc: parseString(formData.get(`bankIfsc-${id}`)?.toString()),
      bankNickname: parseString(formData.get(`bankNickname-${id}`)?.toString()),
    };
  });

  return data;
}

export function parseBankFormData(formData: FormData): BankDetail[] {
  const ids: string[] = [];
  for (const key of formData.keys()) {
    if (key.startsWith("bankName-")) {
      ids.push(key.substring(9));
    }
  }
  return ids.map((id) => ({
    id,
    bankName: parseString(formData.get(`bankName-${id}`)?.toString()),
    bankAccountHolderName: parseString(
      formData.get(`bankAccountHolderName-${id}`)?.toString(),
    ),
    bankAccountNumber: parseString(
      formData.get(`bankAccountNumber-${id}`)?.toString(),
    ),
    bankIfsc: parseString(formData.get(`bankIfsc-${id}`)?.toString()),
    bankNickname: parseString(formData.get(`bankNickname-${id}`)?.toString()),
  }));
}

export function parseBookingFormData(formData: FormData): _BookingData {
  const propertyId = parseString(formData.get("propertyId")?.toString());
  const bookingType = bookingTypeEnum.enumValues.find(
    (x) => x === parseString(formData.get("bookingType")?.toString()),
  );
  const customerId = parseString(formData.get("customerId")?.toString());
  const adultCount = parseNumber(formData.get("adultCount")?.toString());
  const childrenCount = parseNumber(formData.get("childrenCount")?.toString());
  const infantCount = parseNumber(formData.get("infantCount")?.toString());
  const checkinDate = validateDateStr(formData.get("checkinDate")?.toString());
  const checkoutDate = validateDateStr(
    formData.get("checkoutDate")?.toString(),
  );
  const bookingCreatorId = parseString(
    formData.get("bookingCreatorId")?.toString(),
  );
  const bookingCreatorRole = rolesEnum.enumValues.find(
    (x) => x === parseString(formData.get("bookingCreatorRole")?.toString()),
  );
  const rentalCharge = parseNumber(formData.get("rentalCharge")?.toString());
  const extraGuestCharge = parseNumber(
    formData.get("extraGuestCharge")?.toString(),
  );
  const ownerDiscount = parseNumber(formData.get("ownerDiscount")?.toString());
  const multipleNightsDiscount = parseNumber(
    formData.get("multipleNightsDiscount")?.toString(),
  );
  const couponDiscount = parseNumber(
    formData.get("couponDiscount")?.toString(),
  );
  const totalDiscount = parseNumber(formData.get("totalDiscount")?.toString());
  const gstAmount = parseNumber(formData.get("gstAmount")?.toString());
  const gstPercentage = parseNumber(formData.get("gstPercentage")?.toString());
  const otaCommission = parseNumber(formData.get("otaCommission")?.toString());
  const paymentGatewayCharge = parseNumber(
    formData.get("paymentGatewayCharge")?.toString(),
  );
  const netOwnerRevenue = parseNumber(
    formData.get("netOwnerRevenue")?.toString(),
  );

  if (!propertyId || propertyId.length === 0) {
    throw new Error("No property selected");
  }
  if (!customerId || customerId.length === 0) {
    throw new Error("No customer selected");
  }
  if (!bookingType) {
    throw new Error("Invalid Booking type");
  }
  if (adultCount === null || adultCount < 1) {
    throw new Error("Enter number of adults");
  }
  if (childrenCount === null || childrenCount < 0) {
    throw new Error("Enter number of children");
  }
  if (infantCount === null || infantCount < 0) {
    throw new Error("Enter number of infants");
  }
  if (!checkinDate) {
    throw new Error("Invalid checkin date");
  }
  if (!checkoutDate) {
    throw new Error("Invalid checkout date");
  }
  const checkinDt = DateTime.fromSQL(checkinDate);
  const checkoutDt = DateTime.fromSQL(checkoutDate);
  if (checkoutDt.diff(checkinDt, "days").days < 1) {
    throw new Error("Check out date should be later than check in date");
  }
  if (!bookingCreatorId) {
    throw new Error("No booking creator selected.");
  }
  if (!bookingCreatorRole) {
    throw new Error("Invalid booking creator role");
  }
  if (rentalCharge === null || rentalCharge < 0) {
    throw new Error("Enter Rental Charge");
  }
  if (extraGuestCharge === null || extraGuestCharge < 0) {
    throw new Error("Enter Extra guest Charge");
  }
  if (ownerDiscount === null || ownerDiscount < 0) {
    throw new Error("Enter owner discount");
  }
  if (multipleNightsDiscount === null || multipleNightsDiscount < 0) {
    throw new Error("Enter multiple nights discount");
  }
  if (couponDiscount === null || couponDiscount < 0) {
    throw new Error("Enter coupon discount");
  }
  if (totalDiscount === null || totalDiscount < 0) {
    throw new Error("Enter total discount");
  }
  if (gstAmount === null || gstAmount < 0) {
    throw new Error("Enter gst amount");
  }
  if (gstPercentage === null || gstPercentage < 0) {
    throw new Error("Enter gst percentage");
  }
  if (otaCommission === null || otaCommission < 0) {
    throw new Error("Enter ota commission");
  }
  if (paymentGatewayCharge === null || paymentGatewayCharge < 0) {
    throw new Error("Enter payment gateway charge");
  }
  if (netOwnerRevenue === null || netOwnerRevenue < 0) {
    throw new Error("Enter net owner revenue");
  }

  return {
    id: v4(),
    bookingType,
    propertyId,
    customerId,
    bookingSource: parseString(formData.get("bookingSource")?.toString()),
    adultCount,
    childrenCount,
    infantCount,
    checkinDate,
    checkoutDate,
    bookingCreatorId,
    bookingCreatorRole,
    bookingRemarks: parseString(formData.get("bookingRemarks")?.toString()),
    specialRequests: parseString(formData.get("specialRequests")?.toString()),
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
  };
}

export function parseCustomerFormData(formData: FormData): CustomerData {
  const firstName = parseString(formData.get("firstName")?.toString());
  const mobileNumber = parseString(formData.get("mobileNumber")?.toString());
  const dob = parseString(formData.get("dob")?.toString());
  const gender = genderEnum.enumValues.find(
    (x) => x === parseString(formData.get("gender")?.toString()),
  );
  let email = parseString(formData.get("email")?.toString());

  if (!firstName) {
    throw new Error("Name missing.");
  }
  if (!gender) {
    throw new Error("Gender missing.");
  }
  if (!dob) {
    throw new Error("Date of birth missing.");
  }
  if (!mobileNumber) {
    throw new Error("Mobile Number missing.");
  }
  if (email) {
    email = email.toLowerCase();
  }

  return {
    id: v4(),
    firstName,
    lastName: parseString(formData.get("lastName")?.toString()),
    mobileNumber,
    dob,
    email,
    gender,
  };
}

export function parseOwnerFormData(formData: FormData): Owner {
  const propertyId = parseString(formData.get("propertyId")?.toString());
  const ownerId = parseString(formData.get("ownerId")?.toString());

  if (!propertyId || propertyId.length === 0) {
    throw new Error("Invalid Property.");
  }
  if (!ownerId || ownerId.length == 0) {
    throw new Error("Invalid User.");
  }

  return { propertyId, ownerId };
}
