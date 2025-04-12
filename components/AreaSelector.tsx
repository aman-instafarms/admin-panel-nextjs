"use client";

import { Select } from "flowbite-react";
import LabelWrapper from "./LabelWrapper";
import { useEffect, useState } from "react";
import { getCities } from "@/actions/cityActions";
import { getAreas } from "@/actions/areaActions";
import toast from "react-hot-toast";
import { _AreaData, _CityData, StateData } from "@/utils/types";

interface AreaSelectorProps {
  data?: {
    area: {
      id: string;
      area: string;
    } | null;
    city: {
      id: string;
      city: string;
    } | null;
    state: {
      id: string;
      state: string;
    } | null;
  };
  areaData: _AreaData[];
  cityData: _CityData[];
  stateData: StateData[];
}

export default function AreaSelector(props: AreaSelectorProps) {
  const [areaData, setAreaData] = useState<_AreaData[]>(props.areaData);
  const [cityData, setCityData] = useState<_CityData[]>(props.cityData);

  const handleCityChange = async () => {
    const cityId = (document.getElementById("cityId") as HTMLSelectElement)
      .value;
    setAreaData([]);
    if (cityId) {
      await getAreas(cityId).then((res) => {
        if (res.data) {
          setAreaData(
            res.data.map((r) => ({ ...r, cityId: r.city?.id || "" })),
          );
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    }
  };

  const handleStateChange = async () => {
    const stateId = (document.getElementById("stateId") as HTMLSelectElement)
      .value;
    setCityData([]);
    setAreaData([]);
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
    if (props.data) {
      (document.getElementById("areaId") as HTMLSelectElement).value =
        props.data.area?.id || "";
      (document.getElementById("cityId") as HTMLSelectElement).value =
        props.data.city?.id || "";
      (document.getElementById("stateId") as HTMLSelectElement).value =
        props.data.state?.id || "";
    }
  }, [props.data]);

  return (
    <>
      <LabelWrapper label="Area">
        <Select id="areaId" name="areaId" disabled={cityData.length === 0}>
          <option value="">Select Area</option>
          {areaData.map(({ id, area }) => (
            <option key={id} value={id}>
              {area}
            </option>
          ))}
        </Select>
      </LabelWrapper>
      <LabelWrapper label="City">
        <Select
          id="cityId"
          name="cityId"
          disabled={cityData.length === 0}
          onChange={handleCityChange}
        >
          <option value="">Select City</option>
          {cityData.map(({ id, city }) => (
            <option key={id} value={id}>
              {city}
            </option>
          ))}
        </Select>
      </LabelWrapper>
      <LabelWrapper label="State">
        <Select id="stateId" name="stateId" onChange={handleStateChange}>
          <option value="">Select State</option>
          {props.stateData.map(({ id, state }) => (
            <option key={id} value={id}>
              {state}
            </option>
          ))}
        </Select>
      </LabelWrapper>
    </>
  );
}
