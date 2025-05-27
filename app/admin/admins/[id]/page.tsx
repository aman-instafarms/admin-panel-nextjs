import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import { ServerPageProps } from "@/utils/types";
import { db } from "@/drizzle/db";
import { adminFields } from "@/drizzle/fields";
import { admins } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import AdminEditor from "./AdminEditor";

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
    .select(adminFields)
    .from(admins)
    .where(eq(admins.id, idString))
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
            Admins
          </h5>

          <Breadcrumb className="bg-white pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/admins">Admins</BreadcrumbItem>
            <BreadcrumbItem href="#">Edit</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 overflow-x-auto rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Edit Admin
          </h6>
          <AdminEditor data={data[0]} />
        </div>
      </Card>
    </div>
  );
}
