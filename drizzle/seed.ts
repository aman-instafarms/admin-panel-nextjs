import { db } from "./db";
import {
  bookings,
  customers,
  instafarmsWebhook,
  managersOnProperties,
  ownersOnProperties,
  properties,
  users,
} from "./schema";
import {
  BookingSeedData,
  CustomerSeedData,
  InstafarmsWebhookSeedData,
  ManagerOnPropertySeedData,
  OwnerOnPropertySeedData,
  PropertySeedData,
  UserSeedData,
} from "./seedData";
import { instaWebhookEventTypes } from "@/utils/types";

async function main() {
  console.log("Adding User Data...");
  for (const user of UserSeedData) {
    await db
      .insert(users)
      .values(user)
      .onConflictDoNothing()
      .catch((err) => {
        console.log("Failed to create user:", err);
        throw err;
      });
  }
  console.log("Addding Customer Data...");
  for (const customer of CustomerSeedData) {
    await db
      .insert(customers)
      .values(customer)
      .onConflictDoNothing()
      .catch((err) => {
        console.log("Failed to create customer:", err);
        console.log("Failing this customer", customer);
        throw err;
      });
  }
  console.log("Adding Properties Data...");
  for (const property of PropertySeedData) {
    await db
      .insert(properties)
      .values(property)
      .onConflictDoNothing()
      .catch((err) => {
        console.log("Failed to create property:", err);
        throw err;
      });
  }

  console.log("Adding OwnerOnPropertySeedData...");
  for (const element of OwnerOnPropertySeedData) {
    await db
      .insert(ownersOnProperties)
      .values(element)
      .onConflictDoNothing()
      .catch((err) => {
        console.log("Failed to create owner on property:", err);
        throw err;
      });
  }
  console.log("Adding ManagerOnPropertySeedData...");
  for (const element of ManagerOnPropertySeedData) {
    await db
      .insert(managersOnProperties)
      .values(element)
      .onConflictDoNothing()
      .catch((err) => {
        console.log("Failed to create manager on property:", err);
        throw err;
      });
  }
  console.log("Adding Bookings Data...");
  for (const booking of BookingSeedData) {
    await db
      .insert(bookings)
      .values(booking)
      .onConflictDoNothing()
      .catch((err) => {
        console.log("Failed to booking:", err);
        throw err;
      });
  }

  console.log("Adding instafarmsWebhook Data...");
  for (const element of InstafarmsWebhookSeedData) {
    await db
      .insert(instafarmsWebhook)
      .values({
        ...element,
        eventType: element.eventType as (typeof instaWebhookEventTypes)[number],
      })
      .onConflictDoNothing()
      .catch((err) => {
        console.log("Failed to create instafarms webhook:", err);
        throw err;
      });
  }
}

// Only run when this file is executed as a script
if (require.main === module) {
  main()
    .then(() => {
      console.log("Seeding Completed.");
    })
    .catch((err) => {
      console.log("Seeding Failed:", err);
    });
}
