import { relations, sql } from "drizzle-orm";
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
  time,
  real,
} from "drizzle-orm/pg-core";
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

export const timestamps = {
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`SELECT CURRENT_TIMESTAMP`),
};

export const rolesEnum = pgEnum("role", roleOptions);

export const webhookStatusEnum = pgEnum("webhookstatus", webhookStatusOptions);

export const propertyTypes = pgTable("propertyTypes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ...timestamps,
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  activity: text("activity").notNull(),
  ...timestamps,
});

export const amenities = pgTable("amenities", {
  id: uuid("id").primaryKey().defaultRandom(),
  amenity: text("amenity").notNull(),
  ...timestamps,
});

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  mobileNumber: varchar("mobileNumber", { length: 256 }).unique(
    "unique_mobileNumber",
  ),
  whatsappNumber: varchar("whatsappNumber", { length: 256 }),
  email: varchar("email", { length: 256 }).unique("unique_email"),
  ...timestamps,
});

export const ownersOnProperties = pgTable(
  "ownersOnProperties",
  {
    ownerId: uuid("ownerId").notNull(),
    propertyId: uuid("propertyId").notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.ownerId, table.propertyId] })],
);

export const ownersOnPropertiesRelations = relations(
  ownersOnProperties,
  ({ one }) => ({
    owner: one(users, {
      fields: [ownersOnProperties.ownerId],
      references: [users.id],
    }),
    property: one(properties, {
      fields: [ownersOnProperties.propertyId],
      references: [properties.id],
    }),
  }),
);

export const managersOnProperties = pgTable(
  "managersOnProperties",
  {
    managerId: uuid("managerId").notNull(),
    propertyId: uuid("propertyId").notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.managerId, table.propertyId] })],
);

export const managersOnPropertiesRelations = relations(
  managersOnProperties,
  ({ one }) => ({
    manager: one(users, {
      fields: [managersOnProperties.managerId],
      references: [users.id],
    }),
    property: one(properties, {
      fields: [managersOnProperties.propertyId],
      references: [properties.id],
    }),
  }),
);

export const caretakersOnProperties = pgTable(
  "caretakersOnProperties",
  {
    caretakerId: uuid("caretakerId").notNull(),
    propertyId: uuid("propertyId").notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.caretakerId, table.propertyId] })],
);

export const caretakersOnPropertiesRelations = relations(
  caretakersOnProperties,
  ({ one }) => ({
    caretaker: one(users, {
      fields: [caretakersOnProperties.caretakerId],
      references: [users.id],
    }),
    property: one(properties, {
      fields: [caretakersOnProperties.propertyId],
      references: [properties.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  ownedProperties: many(ownersOnProperties),
  managedProperties: many(managersOnProperties),
  caretakenProperties: many(caretakersOnProperties),
}));

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  commonReferenceID: uuid(),

  // Property Detail
  propertyName: text("propertyName").notNull(),
  propertyCode: text("propertyCode").notNull(),

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
  checkinTime: time("checkinTime"),
  checkoutTime: time("checkoutTime"),

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
  ...timestamps,
});

export const states = pgTable("states", {
  id: uuid("id").primaryKey().defaultRandom(),
  state: text("state").notNull(),
  ...timestamps,
});

export const cities = pgTable("cities", {
  id: uuid("id").primaryKey().defaultRandom(),
  city: text("city").notNull(),
  stateId: uuid("stateId")
    .notNull()
    .references(() => states.id),
  ...timestamps,
});

export const areas = pgTable("areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  area: text("area").notNull(),
  cityId: uuid("cityId")
    .notNull()
    .references(() => cities.id),
  ...timestamps,
});

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
  ...timestamps,
});

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName"),
  email: text("email").notNull(),
  phoneNumber: text("phoneNumber"),
  ...timestamps,
});

export const genderEnum = pgEnum("gender", genderOptions);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName"),
  email: text("email"),
  dob: date("dob", { mode: "string" }),
  mobileNumber: text("mobileNumber").notNull(),
  gender: genderEnum("gender"),
  referenceId: text("referenceId"),
  ...timestamps,
});

export const refundStatusEnum = pgEnum("refundStatusEnum", refundStatusOptions);
export const cancellationTypeEnum = pgEnum(
  "cancellationTypeEnum",
  cancellationTypeOptions,
);

export const cancellations = pgTable("cancellations", {
  bookingId: uuid("bookingId")
    .primaryKey()
    .references(() => bookings.id),
  refundAmount: integer("refundAmount").notNull(),
  refundStatus: refundStatusEnum("refundStatus").notNull(),
  cancellationType: cancellationTypeEnum("cancellationType").notNull(),
  referencePersonId: uuid("referencePersonId")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const bookingTypeEnum = pgEnum("bookingType", bookingTypeOptions);

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("propertyId")
    .notNull()
    .references(() => properties.id),
  customerId: uuid("customerId")
    .notNull()
    .references(() => customers.id),
  bookingType: text("bookingType"),
  bookingSource: text("bookingSource"),
  adultCount: integer("adultCount").notNull(),
  childrenCount: integer("childrenCount").notNull(),
  infantCount: integer("infantCount").notNull(),
  checkinDate: date("checkinDate", { mode: "string" }).notNull(),
  checkoutDate: date("checkoutDate", { mode: "string" }).notNull(),
  bookingCreatorId: uuid("bookingCreatorId")
    .notNull()
    .references(() => users.id),
  bookingRemarks: text("bookingRemarks"),
  specialRequests: text("specialRequests"),

  // commercial data
  rentalCharge: real("rentalCharge").notNull(),
  extraGuestCharge: real("extraGuestCharge").notNull(),
  ownerDiscount: real("ownerDiscount").notNull(),
  multipleNightsDiscount: real("multipleNightsDiscount").notNull(),
  couponDiscount: real("couponDiscount").notNull(),
  totalDiscount: real("totalDiscount").notNull(),
  gstAmount: real("gstAmount").notNull(),
  gstPercentage: real("gstPercentage").notNull(),
  otaCommission: real("otaCommission").notNull(),
  paymentGatewayCharge: real("paymentGatewayCharge").notNull(),
  netOwnerRevenue: real("netOwnerRevenue").notNull(),
  ...timestamps,
});

export const transactionTypeEnum = pgEnum(
  "transactionTypeEnum",
  transactionTypeOptions,
);
export const paymentTypeEnum = pgEnum("paymentTypeEnum", paymentTypeOptions);
export const paymentModeEnum = pgEnum("paymentModeEnum", paymentModeOptions);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("bookingId")
    .notNull()
    .references(() => bookings.id),
  transactionType: transactionTypeEnum("transactionType").notNull(),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("paymentDate", { mode: "string" }).notNull(),
  referencePersonId: uuid("referencePersonId").references(() => users.id),
  paymentType: paymentTypeEnum("paymentType").notNull(),
  paymentMode: paymentModeEnum("paymentMode").notNull(),
  paymentCreator: uuid("paymentCreator").references(() => users.id),
  paymentDeletor: uuid("paymentDeletor").references(() => users.id),
  isDeleted: boolean("isDeleted").notNull().default(false),

  // Bank Details
  bankAccountNumber: text("bankAccountNumber"),
  bankName: text("bankName"),
  bankAccountHolderName: text("bankAccountHolderName"),
  bankIfsc: text("bankIfsc"),
  bankNickname: text("bankNickname"),
  ...timestamps,
});

export const ezeeWebhookData = pgTable("ezWebhookData", {
  id: uuid("id").primaryKey().defaultRandom(),
  reqBody: json("reqBody"),
  status: text("status").default("PENDING").notNull(),
  ...timestamps,
});

export const bankDetails = pgTable("bankDetails", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
  bankName: varchar("bankName", { length: 255 }),
  bankAccountHolderName: varchar("bankAccountHolderName", { length: 255 }),
  bankAccountNumber: varchar("bankAccountNumber", { length: 255 }),
  bankNickname: varchar("bankNickname", { length: 255 }),
  bankIfsc: varchar("bankIfsc", { length: 255 }),
  ...timestamps,
});

export const blockedDates = pgTable("blockedDates", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  propertyId: uuid("propertyId")
    .notNull()
    .references(() => properties.id),
  blockedDate: date("blockedDate", { mode: "string" }).notNull(),
  ...timestamps,
});

export const instafarmsWebhook = pgTable("instafarmsWebhook", {
  id: uuid("id").primaryKey().defaultRandom(),
  reqBody: json("reqBody"),
  status: text("status").default("PENDING").notNull(),
  ...timestamps,
});

// Create enum for coupon discount types
export const couponDiscountTypeEnum = pgEnum("couponDiscountType", [
  "Flat",
  "Percentage",
]);
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique("unique_coupon_code"),
  validFrom: timestamp({ mode: "string", withTimezone: true }).notNull(),
  validTo: timestamp({ mode: "string", withTimezone: true }).notNull(),
  discountType: couponDiscountTypeEnum("discountType").notNull(),
  value: integer("value").notNull(), // For flat, this is the amount; for percentage, this is the percentage
  maxDiscountValue: integer("maxDiscountValue"), // Only applicable for percentage discounts
  forSunday: boolean("forSunday").default(false).notNull(),
  forMonday: boolean("forMonday").default(false).notNull(),
  forTuesday: boolean("forTuesday").default(false).notNull(),
  forWednesday: boolean("forWednesday").default(false).notNull(),
  forThursday: boolean("forThursday").default(false).notNull(),
  forFriday: boolean("forFriday").default(false).notNull(),
  forSaturday: boolean("forSaturday").default(false).notNull(),
});

export const couponsRelations = relations(coupons, ({ many }) => ({
  properties: many(propertiesOnCoupons),
}));

export const propertiesOnCoupons = pgTable(
  "propertiesOnCoupons",
  {
    propertyId: uuid("propertyId")
      .notNull()
      .references(() => properties.id),
    couponId: uuid("couponId")
      .notNull()
      .references(() => coupons.id),
  },
  (table) => [primaryKey({ columns: [table.propertyId, table.couponId] })],
);

// Define the relations for the junction table
export const propertiesOnCouponsRelations = relations(
  propertiesOnCoupons,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertiesOnCoupons.propertyId],
      references: [properties.id],
    }),
    coupon: one(coupons, {
      fields: [propertiesOnCoupons.couponId],
      references: [coupons.id],
    }),
  }),
);
