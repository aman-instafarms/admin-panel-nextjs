"use client";

import {
  createPropertyType,
  editPropertyType,
} from "@/actions/propertyTypeActions";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { Label, TextInput } from "flowbite-react";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface PropertyTypeEditorProps {
  data?: {
    id: string;
    name: string;
  };
}

export default function PropertyTypeEditor(props: PropertyTypeEditorProps) {
  const [loading, startTransition] = useTransition();

  const handleSubmit = () => {
    const form = document.getElementById(
      "propertyTypeForm",
    ) as HTMLFormElement | null;
    if (!form) {
      return toast.error("Error");
    }
    const formData = new FormData(form);
    startTransition(() => {
      let promise: Promise<string>;
      if (props.data) {
        const editPropertyTypeWithId = editPropertyType.bind(
          null,
          props.data.id,
        );
        promise = parseServerActionResult(editPropertyTypeWithId(formData));
      } else {
        promise = parseServerActionResult(createPropertyType(formData));
      }

      toast.promise(promise, {
        loading: "Saving property type...",
        success: (data) => {
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    if (props.data) {
      const el = document.getElementById(
        "propertyType",
      ) as HTMLInputElement | null;
      if (el) {
        el.value = props.data.name || "";
      }
    }
  }, [props]);

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
      id="propertyTypeForm"
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
      <MyButton onClick={handleSubmit} loading={loading}>
        Submit
      </MyButton>
    </form>
  );
}
