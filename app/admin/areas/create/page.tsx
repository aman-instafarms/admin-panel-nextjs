import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import { db } from "@/drizzle/db";
import { stateFields } from "@/drizzle/fields";
import { states } from "@/drizzle/schema";
import AreaEditor from "../[id]/AreaEditor";

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
            Areas
          </h5>

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/areas">Areas</BreadcrumbItem>
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 overflow-x-auto rounded-xl bg-gray-900 p-5">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create New Area
          </h6>
          <AreaEditor stateData={stateData} cityData={[]} />
        </div>
      </Card>
    </div>
  );
}
