import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import BookingEditor from "../[id]/BookingEditor";

export default async function Page() {
  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bookings
          </h5>

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/bookings">Bookings</BreadcrumbItem>
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-full flex-col gap-5 rounded-xl bg-gray-900 p-5">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create New Booking
          </h6>
          <BookingEditor />
        </div>
      </Card>
    </div>
  );
}
