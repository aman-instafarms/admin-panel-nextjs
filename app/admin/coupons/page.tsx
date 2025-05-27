import { _Coupon, ServerPageProps } from "@/utils/types";
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

const searchbarKeys = ["Name", "Code"];

const daysMap = [
  { key: "forSunday", label: "Sunday" },
  { key: "forMonday", label: "Monday" },
  { key: "forTuesday", label: "Tuesday" },
  { key: "forWednesday", label: "Wednesday" },
  { key: "forThursday", label: "Thursday" },
  { key: "forFriday", label: "Friday" },
  { key: "forSaturday", label: "Saturday" },
];

// Getting active status based on dates
function getCouponStatus(validFrom: string, validTo: string) {
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

// Function to format days in a readable way
function formatDaysinShort(coupon: _Coupon) {
  const days = [];
  if (coupon.forSunday) days.push("Su");
  if (coupon.forMonday) days.push("Mo");
  if (coupon.forTuesday) days.push("Tu");
  if (coupon.forWednesday) days.push("We");
  if (coupon.forThursday) days.push("Th");
  if (coupon.forFriday) days.push("Fr");
  if (coupon.forSaturday) days.push("Sa");

  if (days.length === 0) return "None";
  if (days.length === 7) return "All days";

  return days.join(", ");
}

// Formatting Days to show in popup
function formatDayList(coupon: _Coupon) {
  const applicableDays = daysMap
    .filter(({ key }) => coupon[key as keyof _Coupon])
    .map(({ label }) => label);

  if (applicableDays.length === 0) return <p>None</p>;

  return (
    <>
      {applicableDays.map((day, idx) => (
        <p key={idx}>{day}</p>
      ))}
    </>
  );
}

// Formatting Properties to show in popup
function formatPropertiesList(items: (string | null)[]) {
  const filteredItems = items.filter((item): item is string => item !== null);
  if (filteredItems.length === 0) return <p>Empty</p>;

  return (
    <>
      {filteredItems.map((item, id) => (
        <p key={id}>{item}</p>
      ))}
    </>
  );
}

// Get Discount value to show.
function getDiscountedValue(coupon: _Coupon) {
  let discountValue = "";
  if (coupon.discountType === "Flat") {
    discountValue = `₹${coupon.value}`;
  } else {
    discountValue = `${coupon.value}%`;
    if (coupon.maxDiscountValue) {
      discountValue += ` (max ₹${coupon.maxDiscountValue})`;
    }
  }
  return discountValue;
}

// Formatting Date : 2025-09-25 00:00:00+05:30   ---> Feb 1, 2025
function formatDateForTable(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page({ searchParams }: ServerPageProps) {
  // Getting coupons data
  const { data: coupons, offset } =
    await getCouponsWithProperties(searchParams);

  console.log(coupons);

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
                // Get coupon status based on dates
                const { label, isActive } = getCouponStatus(
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
                      {getDiscountedValue(coupon)}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {formatDateForTable(coupon.validFrom)} -{" "}
                      {formatDateForTable(coupon.validTo)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={isActive ? "success" : "failure"}
                        className="whitespace-nowrap"
                      >
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      <Tooltip
                        content={
                          <div className="max-w-xs p-2">
                            <span className="font-bold">Applicable Days:</span>
                            <div className="flex flex-col">
                              {formatDayList(coupon)}
                            </div>
                          </div>
                        }
                      >
                        <span className="cursor-help">
                          {formatDaysinShort(coupon)}
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
                              {formatPropertiesList(coupon.propertiesList)}
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
