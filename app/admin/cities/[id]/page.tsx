import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import { ServerPageProps } from "@/utils/types";
import { db } from "@/drizzle/db";
import { _cityFields, stateFields } from "@/drizzle/fields";
import { cities, states } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import CityEditor from "./CityEditor";

export default async function Page({ params }: ServerPageProps) {
  const { id } = await params;

  let idString = "";
  if (id === undefined) {
    idString = "";
  } else if (typeof id === "string") {
    idString = id;
  } else {
    idString = id[0];
  }
  const data = await db
    .select(_cityFields)
    .from(cities)
    .leftJoin(states, eq(cities.stateId, states.id))
    .where(eq(cities.id, idString))
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  const stateData = await db
    .select(stateFields)
    .from(states)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  if (data.length === 0) {
    throw new Error("Not Found");
  }

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Cities
          </h5>

          <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/cities">Cities</BreadcrumbItem>
            <BreadcrumbItem href="#">Edit</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 overflow-x-auto rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Edit City
          </h6>
          <CityEditor data={data[0]} states={stateData} />
        </div>
      </Card>
    </div>
  );
}
