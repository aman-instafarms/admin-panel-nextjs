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
  Badge,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import { HiPencil } from "react-icons/hi";
import Searchbar from "@/components/Searchbar";
import Pagination from "@/components/Pagination";
import DeleteCouponButton from "./DeleteCouponButton";
import { getCouponsWithProperties } from "@/actions/couponActions";
import { formatDateForTable } from "@/utils/utils";

const searchbarKeys = ["Name", "Code"];

// Function to determine if coupon is active based on dates
function getCouponStatus(validFrom: any, validTo: any) {
  const now = new Date();
  const startDate = new Date(validFrom);
  const endDate = new Date(validTo);

  // Check if current date is within validity period
  if (now >= startDate && now <= endDate) {
    return { isActive: true, label: "Active" };
  } else if (now < startDate) {
    return { isActive: false, label: "Upcoming" };
  } else {
    return { isActive: false, label: "Expired" };
  }
}

// formating properties and Days list for display
function formatList(items: string, topic: string) {
  if (!items || items.length === 0) {
    if (topic == "days") return <p>No Day</p>;
    else return <p>Empty</p>;
  }
  return (
    <>
      {items.map((item: string, id: number) => (
        <p key={id}>{item}</p>
      ))}
    </>
  );
}

export default async function Page({ searchParams }: ServerPageProps) {
  // Fetch coupons with pagination and filtering
  const {
    data: coupons,
    limit,
    offset,
  } = await getCouponsWithProperties(searchParams);

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="space-between flex w-full flex-row items-center">
          <div className="flex w-full flex-col gap-2">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Coupons
            </h5>

            <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
              <BreadcrumbItem href="#">Coupons</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center justify-end gap-5">
            <Searchbar searchKeys={searchbarKeys} defaultSearchKey={"Name"} />
            <Link href="/admin/coupons/create" className="cursor-pointer">
              <Button>New</Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto table-auto overflow-x-auto rounded-xl bg-gray-900 p-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>S. No.</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Code</TableHeadCell>
                <TableHeadCell>Discount</TableHeadCell>
                <TableHeadCell>Validity Period</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Days</TableHeadCell>
                <TableHeadCell>Properties</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {coupons.map((coupon, index) => {
                // Format discount value display
                let discountValue = "";
                if (coupon.discountType === "flat") {
                  discountValue = `₹${coupon.value}`;
                } else {
                  discountValue = `${coupon.value}%`;
                  if (coupon.maxDiscountValue) {
                    discountValue += ` (max ₹${coupon.maxDiscountValue})`;
                  }
                }

                // Get coupon status based on dates
                const status = getCouponStatus(
                  coupon.validFrom,
                  coupon.validTo,
                );

                return (
                  <TableRow
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={coupon.id}
                  >
                    <TableCell>{offset + index + 1}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {coupon.name}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {discountValue}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {formatDateForTable(coupon.validFrom)} -{" "}
                      {formatDateForTable(coupon.validTo)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={status.isActive ? "success" : "failure"}
                        className="whitespace-nowrap"
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      <Tooltip
                        content={
                          <div className="max-w-xs p-2">
                            <span className="font-bold">Applicable Days:</span>
                            <div className="flex flex-col">
                              {formatList(coupon.days, "days")}
                            </div>
                          </div>
                        }
                      >
                        <span className="cursor-help">
                          {coupon.days?.length || 0} day
                          {coupon.days?.length !== 1 ? "s" : ""}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      <Tooltip
                        content={
                          <div className="max-w-xs p-2">
                            <span className="font-bold">
                              Applicable Properties:
                            </span>
                            <div className="flex flex-col">
                              {formatList(coupon.propertiesList, "property")}
                            </div>
                          </div>
                        }
                      >
                        <span className="cursor-help">
                          {coupon.propertiesList?.length}{" "}
                          {coupon.propertiesList?.length <= 1
                            ? "property"
                            : "properties"}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-3">
                        <a
                          href={`/admin/coupons/${coupon.id}`}
                          className="w-fit"
                        >
                          <div className="rounded-md bg-blue-600 p-1">
                            <HiPencil size={20} className="text-white" />
                          </div>
                        </a>
                        <DeleteCouponButton id={coupon.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Pagination />
      </Card>
    </div>
  );
}
