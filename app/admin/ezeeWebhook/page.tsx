import { db } from "@/drizzle/db";
import { ezeeWebhookFields } from "@/drizzle/fields";
import { ezeeWebhookData } from "@/drizzle/schema";
import { parseLimitOffset } from "@/utils/server-utils";
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
} from "flowbite-react";
import Pagination from "@/components/Pagination";
import ClipboardPasteIcon from "@/components/ClipboardPasteIcon";
import { DateTime } from "luxon";
import { desc } from "drizzle-orm";

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);

  const data = await db
    .select(ezeeWebhookFields)
    .from(ezeeWebhookData)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(ezeeWebhookData.createdAt))
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
              Ezee Webhook Data
            </h5>

            <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Ezee Webhook</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>

        <div className="mx-auto overflow-x-auto rounded-xl bg-gray-900 p-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>S. No.</TableHeadCell>
                <TableHeadCell>Data</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Received</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data.map(({ id, reqBody, status, createdAt }, index) => {
                const jsonStr = JSON.stringify(reqBody);

                return (
                  <TableRow
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={id}
                  >
                    <TableCell>{offset + index + 1}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      <div className="flex flex-row items-center gap-4">
                        <span>
                          {jsonStr.substring(0, 100)}
                          {jsonStr.length > 100 && "..."}
                        </span>
                        <ClipboardPasteIcon text={jsonStr} />
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-medium whitespace-nowrap text-gray-900 dark:text-white ${status === "PENDING" && "text-red-500!"} ${status === "COMPLETED" && "text-green-500!"}`}
                    >
                      {status}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {DateTime.fromSQL(createdAt).toLocaleString(
                        DateTime.DATETIME_SHORT,
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Pagination />
      </Card>
    </div>
  );
}
