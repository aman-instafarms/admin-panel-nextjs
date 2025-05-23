"use client";

import { createArea, editArea } from "@/actions/areaActions";
import { getCities } from "@/actions/cityActions";
import MyButton from "@/components/MyButton";
import { _City, Area, State } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import { Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface AreaEditorProps {
  data?: Area;
  cityData: _City[];
  stateData: State[];
}

export default function AreaEditor(props: AreaEditorProps) {
  const [cityData, setCityData] = useState<_City[]>(props.cityData);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const fillForm = (areaName?: string, cityId?: string, stateId?: string) => {
    if (areaName) {
      const areaEl = document.getElementById("area") as HTMLInputElement;
      areaEl.value = areaName;
    }
    if (cityId) {
      const cityEl = document.getElementById("cityId") as HTMLSelectElement;
      cityEl.value = cityId;
    }
    if (stateId) {
      const stateEl = document.getElementById("stateId") as HTMLSelectElement;
      stateEl.value = stateId;
    }
  };

  const handleSubmit = () => {
    startTransition(() => {
      const formData = new FormData(
        document.getElementById("areaForm") as HTMLFormElement,
      );

      let promise: Promise<string>;
      const areaName = formData.get("area")?.toString();
      const cityId = formData.get("cityId")?.toString();
      const stateId = formData.get("stateId")?.toString();

      if (props.data) {
        const editAreaWithId = editArea.bind(null, props.data.id);
        promise = parseServerActionResult(editAreaWithId(formData));
      } else {
        promise = parseServerActionResult(createArea(formData));
      }

      toast.promise(promise, {
        loading: "Saving Area...",
        success: (data) => {
          if (!props.data) {
            router.push("/admin/areas");
          }
          return data;
        },
        error: (err) => {
          fillForm(areaName, cityId, stateId);
          return (err as Error).message;
        },
      });
    });
  };

  const updateCityData = async () => {
    const stateId = (document.getElementById("stateId") as HTMLSelectElement)
      .value;
    setCityData([]);
    if (stateId) {
      await getCities(stateId).then((res) => {
        if (res.data) {
          setCityData(
            res.data.map((r) => ({ ...r, stateId: r.state?.id || "" })),
          );
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    }
  };

  useEffect(() => {
    fillForm(props.data?.area, props.data?.city?.id, props.data?.state?.id);
  }, [props.data]);

  return (
    <form id="areaForm" className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label>Area Name</Label>
        </div>
        <TextInput
          id="area"
          name="area"
          type="text"
          placeholder="Enter Area"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">State</Label>
        </div>
        <Select id="stateId" name="stateId" onChange={updateCityData}>
          <option value="">Select State</option>
          {props.stateData.map((state) => (
            <option key={state.id} value={state.id}>
              {state.state}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label>City</Label>
        </div>
        <Select id="cityId" name="cityId" disabled={cityData.length === 0}>
          <option value="">Select City</option>
          {cityData.map((city) => (
            <option key={city.id} value={city.id}>
              {city.city}
            </option>
          ))}
        </Select>
      </div>

      <MyButton onClick={handleSubmit} loading={loading}>
        Submit
      </MyButton>
    </form>
  );
}
