import { db } from "@/drizzle/db";
import { bookingFields } from "@/drizzle/fields";
import {
  bookings,
  cancellations,
  customers,
  properties,
  users,
} from "@/drizzle/schema";
import { parseFilterParams, parseLimitOffset } from "@/utils/server-utils";
import { ServerPageProps } from "@/utils/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import Link from "next/link";
import { HiPencil } from "react-icons/hi";
import Searchbar from "@/components/Searchbar";
import { like } from "drizzle-orm/pg-core/expressions";
import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";
import Pagination from "@/components/Pagination";

const searchbarKeys = [
  "Property Code",
  "Property Name",
  "Status",
  "Booking Creator Name",
];

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);
  const filterParams = parseFilterParams(await searchParams);

  const query = db
    .select(bookingFields)
    .from(bookings)
    .leftJoin(properties, eq(bookings.propertyId, properties.id))
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .leftJoin(cancellations, eq(bookings.id, cancellations.bookingId))
    .leftJoin(
      users,
      and(
        eq(bookings.bookingCreatorId, users.id),
        eq(bookings.bookingCreatorRole, users.role),
      ),
    );

  let queryWithFilter;
  if (filterParams) {
    if (filterParams.searchKey === "Property Code") {
      queryWithFilter = query.where(
        like(properties.propertyCode, `${filterParams.searchValue}%`),
      );
    } else if (filterParams.searchKey === "Property Name") {
      queryWithFilter = query.where(
        like(properties.propertyName, `${filterParams.searchValue}%`),
      );
    } else if (filterParams.searchKey === "Status") {
      if (
        filterParams.searchValue === "Cancelled" ||
        filterParams.searchValue === "Upcoming"
      ) {
        queryWithFilter = query.where(
          filterParams.searchValue === "Cancelled"
            ? isNotNull(cancellations.bookingId)
            : isNull(cancellations.bookingId),
        );
      }
    } else if (filterParams.searchKey === "Booking Creator Name") {
      queryWithFilter = query.where(
        like(
          sql`LOWER(COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
          `${filterParams.searchValue.toLowerCase()}%`,
        ),
      );
    }
  }

  const data = await (queryWithFilter ? queryWithFilter : query)
    .limit(limit)
    .offset(offset)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="space-between flex w-full flex-row items-center">
          <div className="flex w-full flex-col gap-2">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bookings
            </h5>

            <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Bookings</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center justify-end gap-5">
            <Searchbar
              searchKeys={searchbarKeys}
              defaultSearchKey={filterParams?.searchKey || "Status"}
            />
            <Link href="/admin/bookings/create" className="cursor-pointer">
              <Button>New</Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto table-auto overflow-x-auto rounded-xl bg-gray-900 p-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>S. No.</TableHeadCell>
                <TableHeadCell>Property</TableHeadCell>
                <TableHeadCell>Customer Name</TableHeadCell>
                <TableHeadCell>Guest Count</TableHeadCell>
                <TableHeadCell>Booking Created by</TableHeadCell>
                <TableHeadCell>Checkin</TableHeadCell>
                <TableHeadCell>Checkout</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data.map((booking, index) => (
                <TableRow
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={booking.id}
                >
                  <TableCell>{offset + index + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {booking.property?.propertyCode &&
                      `${booking.property.propertyCode} -`}{" "}
                    {booking.property?.propertyName}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {booking.customer?.firstName} {booking.customer?.lastName}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {booking.adultCount}-{booking.childrenCount}-
                    {booking.infantCount}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {booking.bookingCreator?.firstName}{" "}
                    {booking.bookingCreator?.lastName} - (
                    {booking.bookingCreatorRole})
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {booking.checkinDate}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {booking.checkoutDate}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <span
                      className={
                        booking.cancellation ? "text-red-500" : "text-blue-500"
                      }
                    >
                      {booking.cancellation ? "Cancelled" : "Upcoming"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3">
                      <a
                        href={`/admin/bookings/${booking.id}`}
                        className="w-fit"
                      >
                        <div className="rounded-md bg-blue-600 p-1">
                          <HiPencil size={20} className="text-white" />
                        </div>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination />
      </Card>
    </div>
  );
}
