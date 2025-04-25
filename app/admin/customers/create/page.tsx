import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import CustomerEditor from "../[id]/CustomerEditor";

export default async function Page() {
  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Customers
          </h5>

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/customers">Customers</BreadcrumbItem>
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 rounded-xl bg-gray-900 p-5">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create New Customer
          </h6>
          <CustomerEditor />
        </div>
      </Card>
    </div>
  );
}
