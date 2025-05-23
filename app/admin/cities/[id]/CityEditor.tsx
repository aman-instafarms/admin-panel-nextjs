"use client";

import { createCity, editCity } from "@/actions/cityActions";
import MyButton from "@/components/MyButton";
import { State } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import { Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface CityEditorProps {
  data?: {
    id: string;
    city: string;
    stateId: string;
  };
  states: State[];
}

export default function CityEditor(props: CityEditorProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editCityWithId = editCity.bind(null, props.data.id);
        promise = parseServerActionResult(editCityWithId(formData));
      } else {
        promise = parseServerActionResult(createCity(formData));
      }

      toast.promise(promise, {
        loading: "Saving City...",
        success: (data) => {
          if (!props.data) {
            router.push("/admin/cities");
          }
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    if (props.data) {
      const cityEl = document.getElementById("city") as HTMLInputElement;
      cityEl.value = props.data.city;
      const stateEl = document.getElementById("stateId") as HTMLSelectElement;
      stateEl.value = props.data.stateId;
    }
  }, [props.data]);

  return (
    <form
      action={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">City Name</Label>
        </div>
        <TextInput
          id="city"
          name="city"
          type="text"
          placeholder="Enter City"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">State</Label>
        </div>
        <Select id="stateId" name="stateId">
          <option value="">Select State </option>
          {props.states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.state}
            </option>
          ))}
        </Select>
      </div>

      <MyButton type="submit" loading={loading}>
        Submit
      </MyButton>
    </form>
  );
}
