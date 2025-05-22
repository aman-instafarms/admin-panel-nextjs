import { db } from "@/drizzle/db";
import { userFields } from "@/drizzle/fields";
import { users } from "@/drizzle/schema";
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
import DeleteUserButton from "./DeleteAdminButton";
import Searchbar from "@/components/Searchbar";
import { like } from "drizzle-orm/pg-core/expressions";
import { sql } from "drizzle-orm";
import Pagination from "@/components/Pagination";

const searchbarKeys = ["Name", "Email"];

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);
  const filterParams = parseFilterParams(await searchParams);

  const query = db.select(userFields).from(users);

  let queryWithFilter;
  if (filterParams) {
    if (filterParams.searchKey === "Name") {
      queryWithFilter = query.where(
        like(
          sql`LOWER(COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`,
          `${filterParams.searchValue.toLowerCase()}%`,
        ),
      );
    } else if (filterParams.searchKey === "Email") {
      queryWithFilter = query.where(
        like(users.email, `${filterParams.searchValue}%`),
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
              Users
            </h5>

            <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Users</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center justify-end gap-5">
            <Searchbar
              searchKeys={searchbarKeys}
              defaultSearchKey={filterParams?.searchKey || "Name"}
            />
            <Link href="/admin/users/create" className="cursor-pointer">
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
                      <a href={`/admin/users/${user.id}`} className="w-fit">
                        <div className="rounded-md bg-blue-600 p-1">
                          <HiPencil size={20} className="text-white" />
                        </div>
                      </a>
                      <DeleteUserButton id={user.id} />
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
