import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-react";
import ActivityEditor from "../[id]/ActivityEditor";

export default async function Page() {
  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Activities
          </h5>

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/activities">Activities</BreadcrumbItem>
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 overflow-x-auto rounded-xl bg-slate-100 p-5 dark:bg-gray-900">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create New Activity
          </h6>
          <ActivityEditor />
        </div>
      </Card>
    </div>
  );
}
