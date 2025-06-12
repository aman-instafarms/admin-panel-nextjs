import { db } from "@/drizzle/db";
import { propertyFields } from "@/drizzle/fields"; // Assuming this selects the fields you need for the table
// Make sure to import 'bookings' and 'blockedDates' tables from your schema
import {
  areas,
  cities,
  properties,
  states,
  bookings,
  blockedDates,
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

import { desc, eq, sql, and, gte, lte, notExists, lt, gt } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import ClipboardPasteIcon from "@/components/ClipboardPasteIcon";
import Searchbar from "@/components/Searchbar";
import DateRangeFilter from "./DateRangeFilter";

const searchbarKeys = ["Property Name", "Property Code"];

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);
  const filterParams = parseFilterParams(await searchParams);

  const params = await searchParams;

  const availabilityStartDateString = params.startDate as string | undefined;
  const availabilityEndDateString = params.endDate as string | undefined;

  const availabilityStartDate = availabilityStartDateString
    ? new Date(availabilityStartDateString)
    : null;
  const availabilityEndDate = availabilityEndDateString
    ? new Date(availabilityEndDateString)
    : null;

  console.log("Querying with:", {
    limit,
    offset,
    filterParams,
    availabilityStartDate,
    availabilityEndDate,
  });

  const baseQuery = db
    .select(propertyFields)
    .from(properties)
    .leftJoin(areas, eq(properties.areaId, areas.id))
    .leftJoin(cities, eq(properties.cityId, cities.id))
    .leftJoin(states, eq(properties.stateId, states.id));

  const conditions = [];

  if (filterParams && filterParams.searchValue) {
    const searchValue = `${filterParams.searchValue}%`;
    if (filterParams.searchKey === "Property Name") {
      conditions.push(
        sql`${properties.propertyName}::text ILIKE ${searchValue}`,
      );
    } else if (filterParams.searchKey === "Property Code") {
      conditions.push(
        sql`${properties.propertyCode}::text ILIKE ${searchValue}`,
      );
    }
  }

  // Apply availability filters if both availabilityStartDate and availabilityEndDate are provided
  if (availabilityStartDate && availabilityEndDate) {
    // Basic validation: endDate must be after startDate for a valid range.
    if (availabilityEndDate > availabilityStartDate) {
      // 1. Filter out properties with OVERLAPPING BOOKINGS
      // A booking overlaps if: booking.checkinDate < availabilityEndDate AND booking.checkoutDate > availabilityStartDate
      const bookingSubquery = db
        .select({ tempId: bookings.id }) // Select a dummy column
        .from(bookings)
        .where(
          and(
            eq(bookings.propertyId, properties.id), // Correlated subquery linking to the outer properties table
            lt(bookings.checkinDate, availabilityEndDate), // Booking starts before the desired checkout day
            gt(bookings.checkoutDate, availabilityStartDate), // Booking ends after the desired checkin day
          ),
        )
        .limit(1); // We only need to know if at least one such booking exists

      conditions.push(notExists(bookingSubquery)); // Add condition to exclude properties where such a booking exists

      // 2. Filter out properties with BLOCKED DATES within the stay period
      // Stay period nights are from availabilityStartDate up to the day before availabilityEndDate.
      // So, blockedDate >= availabilityStartDate AND blockedDate < availabilityEndDate
      const blockedDateSubquery = db
        .select({ tempId: blockedDates.id }) // Select a dummy column
        .from(blockedDates)
        .where(
          and(
            eq(blockedDates.propertyId, properties.id), // Correlated subquery
            gte(blockedDates.blockedDate, availabilityStartDate), // Blocked date is on or after check-in day
            lt(blockedDates.blockedDate, availabilityEndDate), // Blocked date is before the check-out day
          ),
        )
        .limit(1);

      conditions.push(notExists(blockedDateSubquery)); // Add condition to exclude properties where such a blocked date exists
    } else {
      console.warn(
        "Availability end date must be after the start date. Skipping availability filtering.",
      );
    }
  }

  let finalQuery = baseQuery;
  if (conditions.length > 0) {
    finalQuery = baseQuery.where(and(...conditions));
  }

  const data = await finalQuery
    .orderBy(desc(properties.createdAt))
    .limit(limit)
    .offset(offset)
    .catch((err) => {
      console.error("DB Error fetching properties:", err);
      throw new Error("Database error: Could not fetch properties.");
    });

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full">
        <div className="space-between flex w-full flex-row items-center">
          <div className="flex w-full flex-col gap-2">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Available Properties
            </h5>
            <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Properties</BreadcrumbItem>{" "}
              {/* Updated */}
            </Breadcrumb>
          </div>

          <div className="flex flex-row items-center justify-end gap-5">
            <Searchbar
              searchKeys={searchbarKeys}
              defaultSearchKey={filterParams?.searchKey || "Property Name"}
            />
            <Link href="/admin/properties/create" className="cursor-pointer">
              <Button>New</Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <DateRangeFilter
            startDate={availabilityStartDate}
            endDate={availabilityEndDate}
          />
        </div>
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-max rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
            <Table className="w-full min-w-max">
              <TableHead>
                <TableRow>
                  <TableHeadCell className="min-w-[60px]">#</TableHeadCell>
                  <TableHeadCell className="min-w-[200px]">
                    Reference ID
                  </TableHeadCell>
                  <TableHeadCell className="min-w-[180px]">
                    Property Name
                  </TableHeadCell>
                  <TableHeadCell className="min-w-[150px]">
                    Property Code
                  </TableHeadCell>
                  {/* Add more columns as needed based on 'propertyFields' */}
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {data.map(
                  (
                    // Adjust destructuring based on what 'propertyFields' actually selects
                    { id, propertyName, propertyCode },
                    index,
                  ) => (
                    <TableRow
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={id}
                    >
                      <TableCell className="min-w-[60px] font-medium text-gray-900 dark:text-white">
                        {offset + index + 1}
                      </TableCell>
                      <TableCell className="min-w-[200px] font-medium text-gray-900 dark:text-white">
                        <div>
                          <div className={"flex items-center gap-3"}>
                            <div className="break-all">{id}</div>
                            <ClipboardPasteIcon text={id} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[180px] font-medium text-gray-900 dark:text-white">
                        <div className="max-w-[180px] truncate">
                          {propertyName}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[150px] font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {propertyCode}
                      </TableCell>
                      {/* Render other cells for additional data */}
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
            {data.length === 0 && (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                No properties found matching your criteria.
              </div>
            )}
          </div>
        </div>
        <Pagination />
      </Card>
    </div>
  );
}
