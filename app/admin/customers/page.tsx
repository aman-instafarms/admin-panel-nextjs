import { db } from "@/drizzle/db";
import { customerFields } from "@/drizzle/fields";
import { customers } from "@/drizzle/schema";
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
import { sql } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import { DateTime } from "luxon";
import DeleteCustomerButton from "./DeleteCustomerButton";

const searchbarKeys = ["Name", "Email", "Mobile"];

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);
  const filterParams = parseFilterParams(await searchParams);

  const query = db.select(customerFields).from(customers);

  let queryWithFilter;
  if (filterParams) {
    if (filterParams.searchKey === "Name") {
      queryWithFilter = query.where(
        like(
          sql`LOWER(COALESCE(${customers.firstName}, '') || ' ' || COALESCE(${customers.lastName}, ''))`,
          `${filterParams.searchValue.toLowerCase()}%`,
        ),
      );
    } else if (filterParams.searchKey === "Email") {
      queryWithFilter = query.where(
        like(customers.email, `${filterParams.searchValue}%`),
      );
    } else if (filterParams.searchKey === "Mobile") {
      queryWithFilter = query.where(
        like(customers.mobileNumber, `${filterParams.searchValue}%`),
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
      <Card className="w-full">
        <div className="space-between flex w-full flex-row items-center">
          <div className="flex w-full flex-col gap-2">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Customers
            </h5>

            <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Customers</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center justify-end gap-5">
            <Searchbar
              searchKeys={searchbarKeys}
              defaultSearchKey={filterParams?.searchKey || "Name"}
            />
            <Link href="/admin/customers/create" className="cursor-pointer">
              <Button>New</Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto table-auto overflow-x-auto rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>S. No.</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Mobile Number</TableHeadCell>
                <TableHeadCell>Gender</TableHeadCell>
                <TableHeadCell>Age</TableHeadCell>
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
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {user.gender}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {Math.floor(
                      DateTime.now().diff(DateTime.fromSQL(user.dob), "years")
                        .years,
                    )}{" "}
                    years
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3">
                      <a href={`/admin/customers/${user.id}`} className="w-fit">
                        <div className="rounded-md bg-blue-600 p-1">
                          <HiPencil size={20} className="text-white" />
                        </div>
                      </a>
                      <DeleteCustomerButton id={user.id} />
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
