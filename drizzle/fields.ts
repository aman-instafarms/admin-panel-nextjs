import {
  activities,
  admins,
  amenities,
  areas,
  cities,
  properties,
  propertyTypes,
  specialDates,
  states,
  users,
} from "./schema";

export const propertyTypeFields = {
  id: propertyTypes.id,
  name: propertyTypes.name,
};

export const _propertyFields = {
  id: properties.id,
  propertyName: properties.propertyName,
};

export const propertyFields = {
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
  latitude: properties.latitude,
  longtitude: properties.longtitude,
  mapLink: properties.mapLink,

  address: properties.address,
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
  pincode: properties.pincode,
  propertyTypeId: properties.propertyTypeId,

  // json data
  amenities: properties.amenities,
  activities: properties.activities,
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
  role: users.role,
};
