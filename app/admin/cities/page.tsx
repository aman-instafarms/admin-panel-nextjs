import { db } from "@/drizzle/db";
import { cityFields } from "@/drizzle/fields";
import { eq } from "drizzle-orm";
import { cities, states } from "@/drizzle/schema";
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
import DeleteCityButton from "./DeleteCityButton";

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);

  const data = await db
    .select(cityFields)
    .from(cities)
    .leftJoin(states, eq(cities.stateId, states.id))
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
              Cities
            </h5>

            <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="/admin/cities">Cities</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <Link href="/admin/cities/create" className="cursor-pointer">
            <Button>New</Button>
          </Link>
        </div>

        <div className="mx-auto w-[900px] overflow-x-auto rounded-xl bg-gray-900 p-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>S. No.</TableHeadCell>
                <TableHeadCell>City</TableHeadCell>
                <TableHeadCell>State</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data.map(({ id, state, city }, index) => (
                <TableRow
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={id}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {city}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {state && state.state}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3">
                      <a href={`/admin/cities/${id}`} className="w-fit">
                        <div className="rounded-md bg-blue-600 p-1">
                          <HiPencil size={20} className="text-white" />
                        </div>
                      </a>
                      <DeleteCityButton id={id} />
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
