"use client";

import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { Label, TextInput } from "flowbite-react";
import { useEffect, useTransition } from "react";
import { createAmenity, editAmenity } from "@/actions/amenityActions";
import toast from "react-hot-toast";
import { Amenity } from "@/utils/types";

interface AmenityEditorProps {
  data?: Amenity;
}

export default function AmenityEditor(props: AmenityEditorProps) {
  const [loading, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editAmenityWithId = editAmenity.bind(null, props.data.id);
        promise = parseServerActionResult(editAmenityWithId(formData));
      } else {
        promise = parseServerActionResult(createAmenity(formData));
      }

      toast.promise(promise, {
        loading: "Saving Amenity...",
        success: (data) => {
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    if (props.data) {
      const el = document.getElementById("amenity") as HTMLInputElement;
      el.value = props.data.amenity;
    }
  }, [props.data]);

  return (
    <form
      action={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">Amenity Name</Label>
        </div>
        <TextInput
          id="amenity"
          name="amenity"
          type="text"
          placeholder="Enter Amenity"
          required
        />
      </div>
      <MyButton type="submit" loading={loading}>
        Submit
      </MyButton>
    </form>
  );
}
