import Pagination from "@/components/Pagination";
import Searchbar from "@/components/Searchbar";
import { db } from "@/drizzle/db";
import { instafarmsWebhookFields } from "@/drizzle/fields";
import { instafarmsWebhook } from "@/drizzle/schema";
import { parseFilterParams, parseLimitOffset } from "@/utils/server-utils";
import { ServerPageProps } from "@/utils/types";
import { desc, sql } from "drizzle-orm";
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
} from "flowbite-react";

const searchbarKeys = ["webhookId", "status", "eventType"];

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);
  const filterParams = parseFilterParams(await searchParams);

  const query = db.select(instafarmsWebhookFields).from(instafarmsWebhook);

  // Filterring data based on search parameters
  let queryWithFilter;
  if (filterParams) {
    // Apply search filter
    if (filterParams.searchKey === "webhookId") {
      queryWithFilter = query.where(
        sql`${instafarmsWebhook.id}::text ILIKE ${`${filterParams.searchValue}%`}`,
      );
    } else if (filterParams.searchKey === "status") {
      queryWithFilter = query.where(
        sql`${instafarmsWebhook.eventStatus}::text ILIKE ${`${filterParams.searchValue}%`}`,
      );
    } else if (filterParams.searchKey === "eventType") {
      queryWithFilter = query.where(
        sql`${instafarmsWebhook.eventType}::text ILIKE ${`${filterParams.searchValue}%`}`,
      );
    }
  }

  // Executing the query.
  // Limit --> Limiting the number of results.
  // Offset --> Skipping the first 'offset' number of results.
  // OrderBy --> Ordering the results by createdAt or timeSent in descending order.
  const data = await (queryWithFilter ? queryWithFilter : query)
    .orderBy(desc(instafarmsWebhook.createdAt || instafarmsWebhook.timeSent))
    .limit(limit)
    .offset(offset)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  return (
    <div className="flex w-full flex-col">
      {/* Creating Card */}
      <Card className="w-full">
        <div className="space-between flex w-full flex-row items-center">
          <div className="flex w-full flex-col gap-2">
            {/* Heading */}
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Jarvis Webhook Log
            </h5>

            {/* BreadcrumbItems */}
            <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">jarvis</BreadcrumbItem>
            </Breadcrumb>
          </div>

          {/* Filter Search. */}
          <div className="flex flex-row items-center justify-end gap-5">
            <Searchbar
              searchKeys={searchbarKeys}
              defaultSearchKey={filterParams?.searchKey || "webhookId"}
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-max rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
            <Table className="w-full min-w-max">
              <TableHead>
                <TableRow>
                  <TableHeadCell className="min-w-[60px]">#</TableHeadCell>
                  <TableHeadCell className="min-w-[200px]">
                    Webhook ID
                  </TableHeadCell>
                  <TableHeadCell className="min-w-[120px]">
                    Event Type
                  </TableHeadCell>
                  <TableHeadCell className="min-w-[120px]">
                    Event Status
                  </TableHeadCell>
                  <TableHeadCell className="min-w-[200px]">
                    Response Message
                  </TableHeadCell>
                  <TableHeadCell className="min-w-[120px]">
                    Resent Times
                  </TableHeadCell>
                  <TableHeadCell className="min-w-[180px]">
                    Last Response Time
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="min-w-[60px] font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </TableCell>
                    <TableCell className="min-w-[200px] font-medium break-all text-gray-900 dark:text-white">
                      {item.id}
                    </TableCell>
                    <TableCell className="min-w-[120px] font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {item.eventType}
                    </TableCell>
                    <TableCell className="min-w-[120px] font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {item.eventStatus}
                    </TableCell>
                    <TableCell className="max-w-[300px] min-w-[200px] truncate font-medium text-gray-900 dark:text-white">
                      {item.lastResponseData.latestResponseData.message ||
                        item.lastResponseData.message ||
                        item.eventStatus}
                    </TableCell>
                    <TableCell className="min-w-[120px] font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {item.timeSent}
                    </TableCell>
                    <TableCell className="min-w-[180px] font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {item.lastResponseTimestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Pagination */}
        <Pagination />
      </Card>
    </div>
  );
}
