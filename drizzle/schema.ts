import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  primaryKey,
  date,
  json,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  ActivityData,
  AmenityData,
  bookingTypeOptions,
  cancellationTypeOptions,
  genderOptions,
  paymentModeOptions,
  paymentTypeOptions,
  refundStatusOptions,
  roleOptions,
  transactionTypeOptions,
  webhookStatusOptions,
} from "@/utils/types";

export const rolesEnum = pgEnum("role", roleOptions);

export const webhookStatusEnum = pgEnum("webhookstatus", webhookStatusOptions);

export const propertyTypes = pgTable("propertyTypes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const propertyTypesRelations = relations(propertyTypes, ({ many }) => ({
  properties: many(properties),
}));

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  activity: text("activity").notNull(),
});

export const amenities = pgTable("amenities", {
  id: uuid("id").primaryKey().defaultRandom(),
  amenity: text("amenity").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName"),
  mobileNumber: varchar("mobileNumber", { length: 256 })
    .notNull()
    .unique("unique_mobileNumber"),
  whatsappNumber: varchar("whatsappNumber", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique("unique_email"),
});

export const usersRelations = relations(users, ({ many }) => ({
  ownedproperties: many(ownersOnProperties),
  managedProperties: many(managersOnProperties),
  caretakenProperties: many(caretakersOnProperties),
}));

export const ownersOnProperties = pgTable(
  "ownersOnProperties",
  {
    ownerId: uuid("ownerId").notNull(),
    propertyId: uuid("propertyId").notNull(),
  },
  (table) => [primaryKey({ columns: [table.ownerId, table.propertyId] })],
);

export const managersOnProperties = pgTable(
  "managersOnProperties",
  {
    managerId: uuid("managerId").notNull(),
    propertyId: uuid("propertyId").notNull(),
  },
  (table) => [primaryKey({ columns: [table.managerId, table.propertyId] })],
);

export const caretakersOnProperties = pgTable(
  "caretakersOnProperties",
  {
    caretakerId: uuid("caretakerId").notNull(),
    propertyId: uuid("propertyId").notNull(),
  },
  (table) => [primaryKey({ columns: [table.caretakerId, table.propertyId] })],
);

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Property Detail
  propertyName: text("propertyName"),
  propertyCode: text("propertyCode"),

  // Day wise price and charges
  weekdayPrice: integer("weekdayPrice"),
  weekdayAdultExtraGuestCharge: integer("weekdayAdultExtraGuestCharge"),
  weekdayChildExtraGuestCharge: integer("weekdayChildExtraGuestCharge"),
  weekdayInfantExtraGuestCharge: integer("weekdayInfantExtraGuestCharge"),
  weekdayBaseGuestCount: integer("weekdayBaseGuestCount"),
  weekdayDiscount: integer("weekdayDiscount"),

  weekendPrice: integer("weekendPrice"),
  weekendAdultExtraGuestCharge: integer("weekendAdultExtraGuestCharge"),
  weekendChildExtraGuestCharge: integer("weekendChildExtraGuestCharge"),
  weekendInfantExtraGuestCharge: integer("weekendInfantExtraGuestCharge"),
  weekendBaseGuestCount: integer("weekendBaseGuestCount"),
  weekendDiscount: integer("weekendDiscount"),

  weekendSaturdayPrice: integer("weekendSaturdayPrice"),
  weekendSaturdayAdultExtraGuestCharge: integer(
    "weekendSaturdaySaturdayAdultExtraGuestCharge",
  ),
  weekendSaturdayChildExtraGuestCharge: integer(
    "weekendSaturdayChildExtraGuestCharge",
  ),
  weekendSaturdayInfantExtraGuestCharge: integer(
    "weekendSaturdayInfantExtraGuestCharge",
  ),
  weekendSaturdayBaseGuestCount: integer("weekendSaturdayBaseGuestCount"),
  weekendSaturdayDiscount: integer("weekendSaturdayDiscount"),

  mondayPrice: integer("mondayPrice"),
  mondayAdultExtraGuestCharge: integer("mondayAdultExtraGuestCharge"),
  mondayChildExtraGuestCharge: integer("mondayChildExtraGuestCharge"),
  mondayInfantExtraGuestCharge: integer("mondayInfantExtraGuestCharge"),
  mondayBaseGuestCount: integer("mondayBaseGuestCount"),
  mondayDiscount: integer("mondayDiscount"),

  tuesdayPrice: integer("tuesdayPrice"),
  tuesdayAdultExtraGuestCharge: integer("tuesdayAdultExtraGuestCharge"),
  tuesdayChildExtraGuestCharge: integer("tuesdayChildExtraGuestCharge"),
  tuesdayInfantExtraGuestCharge: integer("tuesdayInfantExtraGuestCharge"),
  tuesdayBaseGuestCount: integer("tuesdayBaseGuestCount"),
  tuesdayDiscount: integer("tuesdayDiscount"),

  wednesdayPrice: integer("wednesdayPrice"),
  wednesdayAdultExtraGuestCharge: integer("wednesdayAdultExtraGuestCharge"),
  wednesdayChildExtraGuestCharge: integer("wednesdayChildExtraGuestCharge"),
  wednesdayInfantExtraGuestCharge: integer("wednesdayInfantExtraGuestCharge"),
  wednesdayBaseGuestCount: integer("wednesdayBaseGuestCount"),
  wednesdayDiscount: integer("wednesdayDiscount"),

  thursdayPrice: integer("thursdayPrice"),
  thursdayAdultExtraGuestCharge: integer("thursdayAdultExtraGuestCharge"),
  thursdayChildExtraGuestCharge: integer("thursdayChildExtraGuestCharge"),
  thursdayInfantExtraGuestCharge: integer("thursdayInfantExtraGuestCharge"),
  thursdayBaseGuestCount: integer("thursdayBaseGuestCount"),
  thursdayDiscount: integer("thursdayDiscount"),

  fridayPrice: integer("fridayPrice"),
  fridayAdultExtraGuestCharge: integer("fridayAdultExtraGuestCharge"),
  fridayChildExtraGuestCharge: integer("fridayChildExtraGuestCharge"),
  fridayInfantExtraGuestCharge: integer("fridayInfantExtraGuestCharge"),
  fridayBaseGuestCount: integer("fridayBaseGuestCount"),
  fridayDiscount: integer("fridayDiscount"),

  saturdayPrice: integer("saturdayPrice"),
  saturdayAdultExtraGuestCharge: integer("saturdayAdultExtraGuestCharge"),
  saturdayChildExtraGuestCharge: integer("saturdayChildExtraGuestCharge"),
  saturdayInfantExtraGuestCharge: integer("saturdayInfantExtraGuestCharge"),
  saturdayBaseGuestCount: integer("saturdayBaseGuestCount"),
  saturdayDiscount: integer("saturdayDiscount"),

  sundayPrice: integer("sundayPrice"),
  sundayAdultExtraGuestCharge: integer("sundayAdultExtraGuestCharge"),
  sundayChildExtraGuestCharge: integer("sundayChildExtraGuestCharge"),
  sundayInfantExtraGuestCharge: integer("sundayInfantExtraGuestCharge"),
  sundayBaseGuestCount: integer("sundayBaseGuestCount"),
  sundayDiscount: integer("sundayDiscount"),

  daywisePrice: boolean("daywisePrice"),
  isDisabled: boolean("isDisabled"),

  bedroomCount: integer("bedroomCount"),
  bathroomCount: integer("bathroomCount"),
  doubleBedCount: integer("doubleBedCount"),
  singleBedCount: integer("singleBedCount"),
  mattressCount: integer("mattressCount"),
  baseGuestCount: integer("baseGuestCount"),
  maxGuestCount: integer("maxGuestCount"),

  bookingType: text("bookingType"),
  defaultGstPercentage: integer("defaultGstPercentage"),
  checkinTime: timestamp({ withTimezone: true, mode: "string" }),
  checkoutTime: timestamp({ withTimezone: true, mode: "string" }),

  latitude: text("latitude"),
  longtitude: text("longtitude"),
  mapLink: text("mapLink"),

  address: text("address"),
  areaId: uuid("areaId").references(() => areas.id),
  cityId: uuid("cityId").references(() => cities.id),
  stateId: uuid("stateId").references(() => states.id),
  pincode: text("pincode"),
  propertyTypeId: uuid("propertyTypeId").references(() => propertyTypes.id),

  // json data
  amenities: json("amenities").$type<AmenityData[]>(),
  activities: json("activities").$type<ActivityData[]>(),
});

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  propertyType: one(propertyTypes, {
    fields: [properties.propertyTypeId],
    references: [propertyTypes.id],
  }),
  area: one(areas, {
    fields: [properties.areaId],
    references: [areas.id],
  }),
  city: one(cities, {
    fields: [properties.cityId],
    references: [cities.id],
  }),
  state: one(states, {
    fields: [properties.stateId],
    references: [states.id],
  }),
  owners: many(ownersOnProperties),
  managers: many(managersOnProperties),
  caretakers: many(caretakersOnProperties),
  customPricing: many(specialDates),
}));

export const states = pgTable("states", {
  id: uuid("id").primaryKey().defaultRandom(),
  state: text("state").notNull(),
});

export const statesRelations = relations(states, ({ many }) => ({
  cities: many(cities),
  properties: many(properties),
}));

export const cities = pgTable("cities", {
  id: uuid("id").primaryKey().defaultRandom(),
  city: text("city").notNull(),
  stateId: uuid("stateId")
    .notNull()
    .references(() => states.id),
});

export const citiesRelations = relations(cities, ({ one, many }) => ({
  state: one(states, {
    fields: [cities.stateId],
    references: [states.id],
  }),
  properties: many(properties),
  areas: many(areas),
}));

export const areas = pgTable("areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  area: text("area").notNull(),
  cityId: uuid("cityId")
    .notNull()
    .references(() => cities.id),
});

export const areasRelations = relations(areas, ({ one, many }) => ({
  city: one(cities, {
    fields: [areas.cityId],
    references: [cities.id],
  }),
  properties: many(properties),
}));

export const specialDates = pgTable("specialDates", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("propertyId")
    .notNull()
    .references(() => properties.id),
  date: date({ mode: "string" }).notNull(),
  price: integer("price"),
  adultExtraGuestCharge: integer("adultExtraGuestCharge"),
  childExtraGuestCharge: integer("childExtraGuestCharge"),
  infantExtraGuestCharge: integer("infantExtraGuestCharge"),
  baseGuestCount: integer("baseGuestCount"),
  discount: integer("discount"),
});

export const specialDatesRelations = relations(specialDates, ({ one }) => ({
  property: one(properties, {
    fields: [specialDates.propertyId],
    references: [properties.id],
  }),
}));

export const admins = pgTable("admins", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: text().notNull(),
  lastName: text(),
  email: text().notNull(),
  phoneNumber: text(),
});

export const genderEnum = pgEnum("gender", genderOptions);

export const customers = pgTable("customers", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: text().notNull(),
  lastName: text(),
  email: text(),
  dob: date({ mode: "string" }).notNull(),
  mobileNumber: text().notNull(),
  gender: genderEnum("gender").notNull(),
});

export const refundStatusEnum = pgEnum("refundStatusEnum", refundStatusOptions);
export const cancellationTypeEnum = pgEnum(
  "cancellationTypeEnum",
  cancellationTypeOptions,
);

export const cancellations = pgTable("cancellations", {
  bookingId: uuid()
    .primaryKey()
    .references(() => bookings.id),
  refundAmount: integer().notNull(),
  refundStatus: refundStatusEnum().notNull(),
  cancellationType: cancellationTypeEnum().notNull(),
  referencePersonId: uuid()
    .notNull()
    .references(() => users.id),
});

export const bookingTypeEnum = pgEnum("bookingType", bookingTypeOptions);

export const bookings = pgTable("bookings", {
  id: uuid().primaryKey().defaultRandom(),
  propertyId: uuid()
    .notNull()
    .references(() => properties.id),
  customerId: uuid()
    .notNull()
    .references(() => customers.id),
  bookingType: bookingTypeEnum("bookingType").notNull(),
  bookingSource: text(),
  adultCount: integer().notNull(),
  childrenCount: integer().notNull(),
  infantCount: integer().notNull(),
  checkinDate: date({ mode: "string" }).notNull(),
  checkoutDate: date({ mode: "string" }).notNull(),
  bookingCreatorId: uuid()
    .notNull()
    .references(() => users.id),
  bookingRemarks: text(),
  specialRequests: text(),

  // commercial data
  rentalCharge: integer().notNull(),
  extraGuestCharge: integer().notNull(),
  ownerDiscount: integer().notNull(),
  multipleNightsDiscount: integer().notNull(),
  couponDiscount: integer().notNull(),
  totalDiscount: integer().notNull(),
  gstAmount: integer().notNull(),
  gstPercentage: integer().notNull(),
  otaCommission: integer().notNull(),
  paymentGatewayCharge: integer().notNull(),
  netOwnerRevenue: integer().notNull(),
});

export const transactionTypeEnum = pgEnum(
  "transactionTypeEnum",
  transactionTypeOptions,
);
export const paymentTypeEnum = pgEnum("paymentTypeEnum", paymentTypeOptions);
export const paymentModeEnum = pgEnum("paymentModeEnum", paymentModeOptions);

export const payments = pgTable("payments", {
  id: uuid().primaryKey().defaultRandom(),
  bookingId: uuid()
    .notNull()
    .references(() => bookings.id),
  transactionType: transactionTypeEnum().notNull(),
  amount: integer().notNull(),
  paymentDate: timestamp({ mode: "string" }).notNull(),
  referencePersonId: uuid()
    .notNull()
    .references(() => users.id),
  paymentType: paymentTypeEnum().notNull(),
  paymentMode: paymentModeEnum().notNull(),
  paymentCreator: uuid(),
  paymentDeletor: uuid(),
  isDeleted: boolean().notNull().default(false),

  // Bank Details
  bankAccountNumber: text(),
  bankName: text(),
  bankAccountHolderName: text(),
  bankIfsc: text(),
  bankNickname: text(),
});

export const ezeeWebhookData = pgTable("ezWebhookData", {
  id: uuid().primaryKey().defaultRandom(),
  reqBody: json(),
  status: text().default("PENDING").notNull(),
  createdAt: timestamp({ mode: "string", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bankDetails = pgTable("bankDetails", {
  id: uuid().primaryKey().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  bankName: varchar({ length: 255 }).notNull(),
  accountHolderName: varchar({ length: 255 }).notNull(),
  accountNumber: varchar({ length: 255 }).notNull(),
  nickname: varchar({ length: 255 }).notNull(),
  ifsc: varchar({ length: 255 }).notNull(),
});
