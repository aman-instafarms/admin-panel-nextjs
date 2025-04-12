"use client";

import { createPropertyType } from "@/actions/propertyTypeActions";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Label,
  TextInput,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      const promise = parseServerActionResult(createPropertyType(formData));

      toast.promise(promise, {
        loading: "Creating new property type...",
        success: (data) => {
          router.push("/admin/propertyTypes");
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full bg-white">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Property Types
          </h5>

          <Breadcrumb className="bg-gray-50 pb-3 dark:bg-gray-800">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
            <BreadcrumbItem href="/admin/propertyTypes">
              Property Types
            </BreadcrumbItem>
            <BreadcrumbItem href="#">Create</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="mx-auto flex w-[900px] flex-col gap-5 overflow-x-auto rounded-xl bg-gray-900 p-5">
          <h6 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Create New Property Type
          </h6>
          <form
            action={handleSubmit}
            className="mx-auto flex w-full max-w-sm flex-col gap-4"
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1">Property Type Name</Label>
              </div>
              <TextInput
                id="propertyType"
                name="propertyType"
                type="text"
                placeholder="Enter Property Type"
                required
              />
            </div>
            <MyButton type="submit" loading={loading}>
              Submit
            </MyButton>
          </form>
        </div>
      </Card>
    </div>
  );
}
