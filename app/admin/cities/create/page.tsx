import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import CityEditor from "../[id]/CityEditor";
import { db } from "@/drizzle/db";
import { stateFields } from "@/drizzle/fields";
import { states } from "@/drizzle/schema";

export default async function Page() {
  const stateData = await db
    .select(stateFields)
    .from(states)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

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
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 overflow-x-auto rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create New City
          </h6>
          <CityEditor states={stateData} />
        </div>
      </Card>
    </div>
  );
}
