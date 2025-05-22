import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import PropertyEditor from "../[id]/PropertyEditor";
import { db } from "@/drizzle/db";
import {
  activityFields,
  amenityFields,
  propertyTypeFields,
  stateFields,
} from "@/drizzle/fields";
import { activities, amenities, propertyTypes, states } from "@/drizzle/schema";
import { _CityData, _AreaData } from "@/utils/types";

export default async function Page() {
  const propertyTypesData = await db
    .select(propertyTypeFields)
    .from(propertyTypes)
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

  const cityData: _CityData[] = [];
  const areaData: _AreaData[] = [];

  const amenityData = await db
    .select(amenityFields)
    .from(amenities)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  const activityData = await db
    .select(activityFields)
    .from(activities)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Properties
          </h5>

          <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/properties">Properties</BreadcrumbItem>
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-full flex-col gap-5 rounded-xl bg-slate-50 p-5 dark:bg-gray-900">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create New Property
          </h6>

          <PropertyEditor
            propertyTypes={propertyTypesData}
            areaData={areaData}
            cityData={cityData}
            stateData={stateData}
            activityData={activityData}
            amenityData={amenityData}
          />
        </div>
      </Card>
    </div>
  );
}
