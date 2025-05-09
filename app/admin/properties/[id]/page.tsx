import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import PropertyEditor from "./PropertyEditor";
import { _AreaData, _CityData, ServerPageProps } from "@/utils/types";
import { db } from "@/drizzle/db";
import {
  _areaFields,
  _cityFields,
  activityFields,
  amenityFields,
  propertyFields,
  propertyTypeFields,
  specialDateFields,
  stateFields,
} from "@/drizzle/fields";
import {
  activities,
  amenities,
  areas,
  cities,
  properties,
  propertyTypes,
  specialDates,
  states,
} from "@/drizzle/schema";
import { and, eq, gte } from "drizzle-orm";
import { DateTime } from "luxon";
import ClipboardPasteIcon from "@/components/ClipboardPasteIcon";

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
    .select(propertyFields)
    .from(properties)
    .leftJoin(areas, eq(properties.areaId, areas.id))
    .leftJoin(cities, eq(properties.cityId, cities.id))
    .leftJoin(states, eq(properties.stateId, states.id))
    .where(eq(properties.id, idString))
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  const startOfDay = DateTime.now().minus({ days: 2 }).toSQLDate();
  const specialDatesData = await db
    .select(specialDateFields)
    .from(specialDates)
    .where(
      and(
        eq(specialDates.propertyId, idString),
        gte(specialDates.date, startOfDay),
      ),
    )
    .orderBy(specialDates.date)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  const propertyTypesData = await db
    .select(propertyTypeFields)
    .from(propertyTypes)
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });

  let areaData: _AreaData[] = [];
  if (data[0].city) {
    areaData = await db
      .select(_areaFields)
      .from(areas)
      .where(eq(areas.cityId, data[0].city.id))
      .catch((err) => {
        console.log("DB Error: ", err);
        return [];
      });
  }

  let cityData: _CityData[] = [];
  if (data[0].state) {
    cityData = await db
      .select(_cityFields)
      .from(cities)
      .where(eq(cities.stateId, data[0].state.id))
      .catch((err) => {
        console.log("DB Error: ", err);
        return [];
      });
  }

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

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/properties">Properties</BreadcrumbItem>
            <BreadcrumbItem href="#">Edit</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-full flex-col gap-5 overflow-visible rounded-xl bg-gray-900 p-5">
          <h3 className="flex gap-4 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Edit Property : {data[0].id}{" "}
            <ClipboardPasteIcon text={data[0].id} />
          </h3>
          <PropertyEditor
            data={data[0]}
            specialDatesData={specialDatesData}
            propertyTypes={propertyTypesData}
            areaData={areaData}
            cityData={cityData}
            stateData={stateData}
            amenityData={amenityData}
            activityData={activityData}
          />
        </div>
      </Card>
    </div>
  );
}
