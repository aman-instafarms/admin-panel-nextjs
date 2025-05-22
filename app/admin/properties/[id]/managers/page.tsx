import { db } from "@/drizzle/db";
import { userFields } from "@/drizzle/fields";
import { managersOnProperties, properties, users } from "@/drizzle/schema";
import { ServerPageProps } from "@/utils/types";
import { eq } from "drizzle-orm";
import {
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableCell,
  Button,
} from "flowbite-react";
import Link from "next/link";
import React from "react";
import RemoveManagerButton from "./RemoveManagerButton";
import Pagination from "@/components/Pagination";
import { parseLimitOffset } from "@/utils/server-utils";

export default async function Page({ params, searchParams }: ServerPageProps) {
  const { id } = await params;
  const { limit, offset } = parseLimitOffset(await searchParams);

  let idString = "";
  if (id === undefined) {
    idString = "";
  } else if (typeof id === "string") {
    idString = id;
  } else {
    idString = id[0];
  }

  const property = await db
    .select({
      id: properties.id,
      propertyCode: properties.propertyCode,
      propertyName: properties.propertyName,
    })
    .from(properties)
    .where(eq(properties.id, idString))
    .limit(1)
    .then((res) => {
      if (res.length === 0) {
        throw new Error("Not Found");
      }
      return res[0];
    })
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  const data = await db
    .select({ ...userFields, id: managersOnProperties.managerId })
    .from(managersOnProperties)
    .leftJoin(users, eq(managersOnProperties.managerId, users.id))
    .where(eq(managersOnProperties.propertyId, idString))
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
              Managers - {property.propertyName}
            </h5>
            <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="/admin/properties">
                Properties
              </BreadcrumbItem>
              <BreadcrumbItem href={`/admin/properties/${idString}`}>
                {property.propertyCode || property.id}
              </BreadcrumbItem>
              <BreadcrumbItem href="#">Managers</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex">
            <Link
              href={`/admin/properties/${idString}/managers/new`}
              className="cursor-pointer"
            >
              <Button className="min-w-36">
                <span>Add Manager</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto w-[900px] overflow-x-auto rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>S. No.</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Phone Number</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data.map((user, index) => (
                <TableRow
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={user.id}
                >
                  <TableCell>{offset + index + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </TableCell>

                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {user.email}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {user.mobileNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3">
                      <RemoveManagerButton
                        propertyId={property.id}
                        userId={user.id}
                      />
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
