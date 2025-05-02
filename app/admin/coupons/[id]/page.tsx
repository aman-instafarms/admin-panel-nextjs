import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import CouponEditor from "./CouponEditor";
import { ServerPageProps } from "@/utils/types";
import { couponFields } from "@/drizzle/fields";
import { coupons } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

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
    .select(couponFields)
    .from(coupons)
    .where(eq(coupons.id, idString))
    .catch((err) => {
      console.log("DB Error: ", err);
      throw new Error("Database Error");
    });
  const couponData = data[0];

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Coupons
          </h5>

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/coupons">Coupons</BreadcrumbItem>
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 rounded-xl bg-gray-900 px-10 py-6">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Editing Your Coupon
          </h2>
          <CouponEditor couponData={couponData} />
        </div>
      </Card>
    </div>
  );
}
