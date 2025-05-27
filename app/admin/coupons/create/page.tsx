import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import CouponEditor from "../[id]/CouponEditor";
import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";
import { useState } from "react";

export default async function Page() {
  // query to get the property data with city state ownerName and managerName

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

        <div className="mx-auto flex w-[900px] flex-col gap-5 rounded-xl bg-gray-900 px-12 py-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Creating new Coupon
          </h2>
          <CouponEditor couponData={null} />
        </div>
      </Card>
    </div>
  );
}
