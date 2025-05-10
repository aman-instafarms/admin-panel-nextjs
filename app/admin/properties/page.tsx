import { db } from "@/drizzle/db";
import { propertyFields } from "@/drizzle/fields";
import { areas, cities, properties, states } from "@/drizzle/schema";
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
import DeletePropertyButton from "./DeletePropertyButton";
import { eq } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import ClipboardPasteIcon from "@/components/ClipboardPasteIcon";

export default async function Page({ searchParams }: ServerPageProps) {
  const { limit, offset } = parseLimitOffset(await searchParams);

  const data = await db
    .select(propertyFields)
    .from(properties)
    .leftJoin(areas, eq(properties.areaId, areas.id))
    .leftJoin(cities, eq(properties.cityId, cities.id))
    .leftJoin(states, eq(properties.stateId, states.id))
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
              Properties
            </h5>

            <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Properties</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <Link href="/admin/properties/create" className="cursor-pointer">
            <Button>New</Button>
          </Link>
        </div>

        <div className="mx-auto w-full overflow-x-auto rounded-xl bg-gray-900 p-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Reference ID</TableHeadCell>
                <TableHeadCell>Property Name</TableHeadCell>
                <TableHeadCell>Property Code</TableHeadCell>
                <TableHeadCell>Location</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
                <TableHeadCell>People</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data.map(({ id, propertyName, propertyCode, city, state }) => (
                <TableRow
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={id}
                >
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div>
                      <div className={"flex items-center gap-3"}>
                        <div>
                          {id.substring(0, 15)}
                          {id.length > 15 && "..."}
                        </div>
                        <ClipboardPasteIcon text={id} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {propertyName}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {propertyCode}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {city && `${city?.city}, `}
                    {state?.state}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3">
                      <Link href={`/admin/properties/${id}`} className="w-fit">
                        <div className="rounded-md bg-blue-600 p-1">
                          <HiPencil size={20} className="text-white" />
                        </div>
                      </Link>
                      <DeletePropertyButton id={id} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-3">
                      <Link
                        href={`/admin/properties/${id}/owners`}
                        className="w-fit"
                      >
                        <div className="rounded-md bg-blue-600 p-2 text-white">
                          Owners
                        </div>
                      </Link>
                      <Link
                        href={`/admin/properties/${id}/managers`}
                        className="w-fit"
                      >
                        <div className="rounded-md bg-blue-600 p-2 text-white">
                          Managers
                        </div>
                      </Link>
                      <Link
                        href={`/admin/properties/${id}/caretakers`}
                        className="w-fit"
                      >
                        <div className="rounded-md bg-blue-600 p-2 text-white">
                          Caretakers
                        </div>
                      </Link>
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
