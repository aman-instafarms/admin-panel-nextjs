import {
  activities,
  admins,
  amenities,
  areas,
  bankDetails,
  bookings,
  cancellations,
  cities,
  customers,
  ezeeWebhookData,
  payments,
  properties,
  propertyTypes,
  specialDates,
  states,
  users,
  coupons,
} from "./schema";

export const propertyTypeFields = {
  id: propertyTypes.id,
  name: propertyTypes.name,
};

export const _propertyFields = {
  id: properties.id,
  propertyName: properties.propertyName,
  propertyCode: properties.propertyCode,

  weekdayPrice: properties.weekdayPrice,
  weekdayAdultExtraGuestCharge: properties.weekdayAdultExtraGuestCharge,
  weekdayChildExtraGuestCharge: properties.weekdayChildExtraGuestCharge,
  weekdayInfantExtraGuestCharge: properties.weekdayInfantExtraGuestCharge,
  weekdayBaseGuestCount: properties.weekdayBaseGuestCount,
  weekdayDiscount: properties.weekdayDiscount,

  weekendPrice: properties.weekendPrice,
  weekendAdultExtraGuestCharge: properties.weekendAdultExtraGuestCharge,
  weekendChildExtraGuestCharge: properties.weekendChildExtraGuestCharge,
  weekendInfantExtraGuestCharge: properties.weekendInfantExtraGuestCharge,
  weekendBaseGuestCount: properties.weekendBaseGuestCount,
  weekendDiscount: properties.weekendDiscount,

  weekendSaturdayPrice: properties.weekendSaturdayPrice,
  weekendSaturdayAdultExtraGuestCharge:
    properties.weekendSaturdayAdultExtraGuestCharge,
  weekendSaturdayChildExtraGuestCharge:
    properties.weekendSaturdayChildExtraGuestCharge,
  weekendSaturdayInfantExtraGuestCharge:
    properties.weekendSaturdayInfantExtraGuestCharge,
  weekendSaturdayBaseGuestCount: properties.weekendSaturdayBaseGuestCount,
  weekendSaturdayDiscount: properties.weekendSaturdayDiscount,

  mondayPrice: properties.mondayPrice,
  mondayAdultExtraGuestCharge: properties.mondayAdultExtraGuestCharge,
  mondayChildExtraGuestCharge: properties.mondayChildExtraGuestCharge,
  mondayInfantExtraGuestCharge: properties.mondayInfantExtraGuestCharge,
  mondayBaseGuestCount: properties.mondayBaseGuestCount,
  mondayDiscount: properties.mondayDiscount,

  tuesdayPrice: properties.tuesdayPrice,
  tuesdayAdultExtraGuestCharge: properties.tuesdayAdultExtraGuestCharge,
  tuesdayChildExtraGuestCharge: properties.tuesdayChildExtraGuestCharge,
  tuesdayInfantExtraGuestCharge: properties.tuesdayInfantExtraGuestCharge,
  tuesdayBaseGuestCount: properties.tuesdayBaseGuestCount,
  tuesdayDiscount: properties.tuesdayDiscount,

  wednesdayPrice: properties.wednesdayPrice,
  wednesdayAdultExtraGuestCharge: properties.wednesdayAdultExtraGuestCharge,
  wednesdayChildExtraGuestCharge: properties.wednesdayChildExtraGuestCharge,
  wednesdayInfantExtraGuestCharge: properties.wednesdayInfantExtraGuestCharge,
  wednesdayBaseGuestCount: properties.wednesdayBaseGuestCount,
  wednesdayDiscount: properties.wednesdayDiscount,

  thursdayPrice: properties.thursdayPrice,
  thursdayAdultExtraGuestCharge: properties.thursdayAdultExtraGuestCharge,
  thursdayChildExtraGuestCharge: properties.thursdayChildExtraGuestCharge,
  thursdayInfantExtraGuestCharge: properties.thursdayInfantExtraGuestCharge,
  thursdayBaseGuestCount: properties.thursdayBaseGuestCount,
  thursdayDiscount: properties.thursdayDiscount,

  fridayPrice: properties.fridayPrice,
  fridayAdultExtraGuestCharge: properties.fridayAdultExtraGuestCharge,
  fridayChildExtraGuestCharge: properties.fridayChildExtraGuestCharge,
  fridayInfantExtraGuestCharge: properties.fridayInfantExtraGuestCharge,
  fridayBaseGuestCount: properties.fridayBaseGuestCount,
  fridayDiscount: properties.fridayDiscount,

  saturdayPrice: properties.saturdayPrice,
  saturdayAdultExtraGuestCharge: properties.saturdayAdultExtraGuestCharge,
  saturdayChildExtraGuestCharge: properties.saturdayChildExtraGuestCharge,
  saturdayInfantExtraGuestCharge: properties.saturdayInfantExtraGuestCharge,
  saturdayBaseGuestCount: properties.saturdayBaseGuestCount,
  saturdayDiscount: properties.saturdayDiscount,

  sundayPrice: properties.sundayPrice,
  sundayAdultExtraGuestCharge: properties.sundayAdultExtraGuestCharge,
  sundayChildExtraGuestCharge: properties.sundayChildExtraGuestCharge,
  sundayInfantExtraGuestCharge: properties.sundayInfantExtraGuestCharge,
  sundayBaseGuestCount: properties.sundayBaseGuestCount,
  sundayDiscount: properties.sundayDiscount,

  daywisePrice: properties.daywisePrice,
  isDisabled: properties.isDisabled,
  bedroomCount: properties.bedroomCount,
  bathroomCount: properties.bathroomCount,
  doubleBedCount: properties.doubleBedCount,
  singleBedCount: properties.singleBedCount,
  mattressCount: properties.mattressCount,
  baseGuestCount: properties.baseGuestCount,
  maxGuestCount: properties.maxGuestCount,
  bookingType: properties.bookingType,
  defaultGstPercentage: properties.defaultGstPercentage,
  checkinTime: properties.checkinTime,
  checkoutTime: properties.checkoutTime,

  latitude: properties.latitude,
  longtitude: properties.longtitude,
  mapLink: properties.mapLink,

  address: properties.address,
  pincode: properties.pincode,
  propertyTypeId: properties.propertyTypeId,

  // json data
  amenities: properties.amenities,
  activities: properties.activities,
  areaId: properties.areaId,
  cityId: properties.cityId,
  stateId: properties.stateId,
};

export const propertyFields = {
  ..._propertyFields,
  area: {
    id: areas.id,
    area: areas.area,
  },
  city: {
    id: cities.id,
    city: cities.city,
  },
  state: {
    id: states.id,
    state: states.state,
  },
};

export const stateFields = {
  id: states.id,
  state: states.state,
};

export const _cityFields = {
  id: cities.id,
  city: cities.city,
  stateId: cities.stateId,
};

export const cityFields = {
  id: cities.id,
  city: cities.city,
  state: {
    id: states.id,
    state: states.state,
  },
};

export const areaFields = {
  id: areas.id,
  area: areas.area,
  city: {
    id: cities.id,
    city: cities.city,
  },
  state: {
    id: states.id,
    state: states.state,
  },
};

export const _areaFields = {
  id: areas.id,
  area: areas.area,
  cityId: areas.cityId,
};

export const specialDateFields = {
  id: specialDates.id,
  propertyId: specialDates.propertyId,
  date: specialDates.date,
  price: specialDates.price,
  adultExtraGuestCharge: specialDates.adultExtraGuestCharge,
  childExtraGuestCharge: specialDates.childExtraGuestCharge,
  infantExtraGuestCharge: specialDates.infantExtraGuestCharge,
  baseGuestCount: specialDates.baseGuestCount,
  discount: specialDates.discount,
};

export const amenityFields = {
  id: amenities.id,
  amenity: amenities.amenity,
};

export const activityFields = {
  id: activities.id,
  activity: activities.activity,
};

export const adminFields = {
  id: admins.id,
  firstName: admins.firstName,
  lastName: admins.lastName,
  email: admins.email,
  phoneNumber: admins.phoneNumber,
};

export const userFields = {
  id: users.id,
  firstName: users.firstName,
  lastName: users.lastName,
  email: users.email,
  mobileNumber: users.mobileNumber,
  whatsappNumber: users.whatsappNumber,
};

export const customerFields = {
  id: customers.id,
  firstName: customers.firstName,
  lastName: customers.lastName,
  email: customers.email,
  dob: customers.dob,
  mobileNumber: customers.mobileNumber,
  gender: customers.gender,
};

export const _bookingFields = {
  id: bookings.id,
  propertyId: bookings.propertyId,
  customerId: bookings.customerId,
  bookingType: bookings.bookingType,
  bookingSource: bookings.bookingSource,
  adultCount: bookings.adultCount,
  childrenCount: bookings.childrenCount,
  infantCount: bookings.infantCount,
  checkinDate: bookings.checkinDate,
  checkoutDate: bookings.checkoutDate,
  bookingCreatorId: bookings.bookingCreatorId,
  bookingRemarks: bookings.bookingRemarks,
  specialRequests: bookings.specialRequests,

  rentalCharge: bookings.rentalCharge,
  extraGuestCharge: bookings.extraGuestCharge,
  ownerDiscount: bookings.ownerDiscount,
  multipleNightsDiscount: bookings.multipleNightsDiscount,
  couponDiscount: bookings.couponDiscount,
  totalDiscount: bookings.totalDiscount,
  gstAmount: bookings.gstAmount,
  gstPercentage: bookings.gstPercentage,
  otaCommission: bookings.otaCommission,
  paymentGatewayCharge: bookings.paymentGatewayCharge,
  netOwnerRevenue: bookings.netOwnerRevenue,
};

export const bookingFields = {
  ..._bookingFields,
  property: {
    id: properties.id,
    propertyName: properties.propertyName,
    propertyCode: properties.propertyCode,

    bedroomCount: properties.bedroomCount,
    bathroomCount: properties.bathroomCount,
    doubleBedCount: properties.doubleBedCount,
    singleBedCount: properties.singleBedCount,
    mattressCount: properties.mattressCount,
    baseGuestCount: properties.baseGuestCount,
    maxGuestCount: properties.maxGuestCount,
    defaultGstPercentage: properties.defaultGstPercentage,
    checkinTime: properties.checkinTime,
    checkoutTime: properties.checkoutTime,
  },
  // cancellationReferencePerson: {
  //   id: users.id,
  //   firstName: users.firstName,
  //   lastName: users.lastName,
  //   email: users.email,
  //   mobileNumber: users.mobileNumber,
  //   whatsappNumber: users.whatsappNumber,
  //   role: users.role,
  // },
  cancellation: {
    bookingId: cancellations.bookingId,
    refundAmount: cancellations.refundAmount,
    refundStatus: cancellations.refundStatus,
    cancellationType: cancellations.cancellationType,
    referencePersonId: cancellations.referencePersonId,
  },
  customer: {
    id: customers.id,
    firstName: customers.firstName,
    lastName: customers.lastName,
    email: customers.email,
    dob: customers.dob,
    mobileNumber: customers.mobileNumber,
    gender: customers.gender,
  },
  bookingCreator: {
    ...userFields,
  },
};

export const _paymentFields = {
  id: payments.id,
  bookingId: payments.bookingId,
  transactionType: payments.transactionType,
  amount: payments.amount,
  paymentDate: payments.paymentDate,
  referencePersonId: payments.referencePersonId,
  paymentType: payments.paymentType,
  paymentMode: payments.paymentMode,

  bankAccountNumber: payments.bankAccountNumber,
  bankName: payments.bankName,
  bankAccountHolderName: payments.bankAccountHolderName,
  bankIfsc: payments.bankIfsc,
  bankNickname: payments.bankNickname,
};

export const paymentFields = {
  ..._paymentFields,
  referencePerson: {
    ...userFields,
  },
};

export const ezeeWebhookFields = {
  id: ezeeWebhookData.id,
  reqBody: ezeeWebhookData.reqBody,
  status: ezeeWebhookData.status,
  createdAt: ezeeWebhookData.createdAt,
};

export const _bankFields = {
  id: bankDetails.id,
  userId: bankDetails.userId,
  bankName: bankDetails.bankName,
  accountHolderName: bankDetails.accountHolderName,
  accountNumber: bankDetails.accountNumber,
  nickname: bankDetails.nickname,
  ifsc: bankDetails.ifsc,
};

// Create coupon fields for use in API
export const _couponFields = {
  id: coupons.id,
  name: coupons.name,
  code: coupons.code,
  validFrom: coupons.validFrom,
  validTo: coupons.validTo,
  discountType: coupons.discountType,
  value: coupons.value,
  maxDiscountValue: coupons.maxDiscountValue,
  forSunday: coupons.forSunday,
  forMonday: coupons.forMonday,
  forTuesday: coupons.forTuesday,
  forWednesday: coupons.forWednesday,
  forThursday: coupons.forThursday,
  forFriday: coupons.forFriday,
  forSaturday: coupons.forSaturday,
};

export const propertyFieldsForCoupons = {
  id: properties.id,
  propertyName: properties.propertyName,
  propertyCode: properties.propertyCode,
  area: areas.area,
  city: cities.city,
  state: states.state,
  managersList: [],
  ownersList: []
};
