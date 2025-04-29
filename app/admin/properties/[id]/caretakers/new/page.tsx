import { db } from "@/drizzle/db";
import { userFields } from "@/drizzle/fields";
import { caretakersOnProperties, properties, users } from "@/drizzle/schema";
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
import Searchbar from "@/components/Searchbar";
import { like } from "drizzle-orm/pg-core/expressions";
import { and, eq, sql } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import AddCaretakerButton from "./AddCaretakerButton";

const searchbarKeys = ["Name", "Email"];

export default async function Page({ searchParams, params }: ServerPageProps) {
  const { id } = await params;

  let idString = "";
  if (id === undefined) {
    idString = "";
  } else if (typeof id === "string") {
    idString = id;
  } else {
    idString = id[0];
  }

  const property = await db
    .select({ id: properties.id, propertyCode: properties.propertyCode })
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

  const { limit, offset } = parseLimitOffset(await searchParams);
  const filterParams = parseFilterParams(await searchParams);

  const query = db
    .select({ ...userFields, propertyId: caretakersOnProperties.propertyId })
    .from(users)
    .leftJoin(
      caretakersOnProperties,
      eq(users.id, caretakersOnProperties.caretakerId),
    );

  const filters = [];

  if (filterParams) {
    if (filterParams.searchKey === "Name") {
      filters.push(
        like(
          sql`LOWER(COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
          `${filterParams.searchValue.toLowerCase()}%`,
        ),
      );
    } else if (filterParams.searchKey === "Email") {
      filters.push(like(users.email, `${filterParams.searchValue}%`));
    }
  }

  const data = await (filters.length ? query.where(and(...filters)) : query)
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
              Add Caretaker - {property.propertyCode || property.id}
            </h5>

            <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="/admin/properties">
                Properties
              </BreadcrumbItem>
              <BreadcrumbItem href={`/admin/properties/${idString}`}>
                {property.propertyCode || property.id}
              </BreadcrumbItem>
              <BreadcrumbItem href={`/admin/properties/${idString}/caretakers`}>
                Caretakers
              </BreadcrumbItem>
              <BreadcrumbItem href="#">Add Caretaker</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center justify-end gap-5">
            <Searchbar
              searchKeys={searchbarKeys}
              defaultSearchKey={filterParams?.searchValue || "Name"}
            />
          </div>
        </div>

        <div className="mx-auto table-auto overflow-x-auto rounded-xl bg-gray-900 p-5">
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
                    {user.propertyId ? (
                      <Button className="p-2" size="small" disabled>
                        Already Caretaker
                      </Button>
                    ) : (
                      <AddCaretakerButton
                        propertyId={property.id}
                        userId={user.id}
                      />
                    )}
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
