import { db } from "@/drizzle/db";
import { propertyTypeFields } from "@/drizzle/fields";
import { propertyTypes } from "@/drizzle/schema";
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
  Button,
} from "flowbite-react";
import Link from "next/link";
import { HiPencil } from "react-icons/hi";
import DeletePropertyTypeButton from "./DeletePropertyTypeButton";

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);

  const data = await db
    .select(propertyTypeFields)
    .from(propertyTypes)
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
              Property Types
            </h5>

            <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Property Types</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <Link href="/admin/propertyTypes/create" className="cursor-pointer">
            <Button>New</Button>
          </Link>
        </div>

        <div className="mx-auto w-[900px] overflow-x-auto rounded-xl bg-gray-900 p-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>S. No.</TableHeadCell>
                <TableHeadCell>Property Type</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data.map(({ id, name }, index) => (
                <TableRow
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={id}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3">
                      <a href={`/admin/propertyTypes/${id}`} className="w-fit">
                        <div className="rounded-md bg-blue-600 p-1">
                          <HiPencil size={20} className="text-white" />
                        </div>
                      </a>
                      <DeletePropertyTypeButton id={id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
