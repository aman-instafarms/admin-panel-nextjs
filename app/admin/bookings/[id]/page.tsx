import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import { ServerPageProps } from "@/utils/types";
import { db } from "@/drizzle/db";
import { _paymentFields, bookingFields } from "@/drizzle/fields";
import {
  bookings,
  cancellations,
  customers,
  payments,
  properties,
  users,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import BookingEditor from "./BookingEditor";

export default async function Page({ params }: ServerPageProps) {
  const { id } = await params;

  let idString = "";
  if (id === undefined) {
    idString = "";
  } else if (typeof id === "string") {
    idString = id;
  } else {
    idString = id[0];
  }
  const data = await db
    .select(bookingFields)
    .from(bookings)
    .leftJoin(properties, eq(bookings.propertyId, properties.id))
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .leftJoin(cancellations, eq(bookings.id, cancellations.bookingId))
    .leftJoin(users, eq(cancellations.referencePersonId, users.id))
    .where(eq(bookings.id, idString))
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  if (data.length === 0) {
    throw new Error("Not Found");
  }

  const paymentData = await db
    .select(_paymentFields)
    .from(payments)
    .where(
      and(eq(payments.bookingId, idString), eq(payments.isDeleted, false)),
    );

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bookings
          </h5>

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/bookings">Bookings</BreadcrumbItem>
            <BreadcrumbItem href="#">Edit</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-full flex-col gap-5 rounded-xl bg-gray-900 p-5">
          <div className="flex flex-row items-center justify-between">
            <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Edit Booking
            </h6>
          </div>
          <BookingEditor data={data[0]} paymentData={paymentData} />
        </div>
      </Card>
    </div>
  );
}
