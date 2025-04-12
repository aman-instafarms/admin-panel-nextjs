"use client";

import { editPropertyType } from "@/actions/propertyTypeActions";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface PropertyTypeEditorProps {
  data: {
    id: string;
    name: string;
  };
}

export default function PropertyTypeEditor(props: PropertyTypeEditorProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const editPropertyTypeWithId = editPropertyType.bind(null, props.data.id);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      const promise = parseServerActionResult(editPropertyTypeWithId(formData));

      toast.promise(promise, {
        loading: "Saving property type...",
        success: (data) => {
          router.push("/admin/propertyTypes");
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    const el = document.getElementById("propertyType") as HTMLInputElement;
    el.value = props.data.name;
  }, []);

  return (
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
  );
}
