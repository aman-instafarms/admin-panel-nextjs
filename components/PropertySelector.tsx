"use client";

import { _PropertyData } from "@/utils/types";
import { Card, Checkbox, Popover, Select, TextInput } from "flowbite-react";
import { useEffect, useState, useTransition, MouseEvent } from "react";
import toast from "react-hot-toast";
import MyButton from "./MyButton";
import { HiSearch } from "react-icons/hi";
import { v4 } from "uuid";
import { getPropertyById, searchProperty } from "@/actions/propertyActions";

interface PropertySelectorProps {
  propertyId: string | null;
  update: (propertyId: string | null) => void;
  readOnly?: boolean;
}

function getPropertyName(property: _PropertyData) {
  return `${property.propertyCode ? `${property.propertyCode} - ` : ""} ${property.propertyName ? property.propertyName : property.id}`;
}

export default function PropertySelector({
  propertyId,
  update,
  readOnly,
}: PropertySelectorProps) {
  const [searchResults, setSearchResults] = useState<_PropertyData[]>([]);
  const [loading, startTransition] = useTransition();
  const [uniqueId] = useState<string>(v4());

  const selectedProperty = searchResults.find((x) => x.id === propertyId);

  const handleSearch = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSearchResults([]);
    const formData = new FormData();
    let searchKey = "";
    let searchValue = "";
    const el1 = document.getElementById(
      `property-searchKey-${uniqueId}`,
    ) as HTMLSelectElement | null;
    if (el1) {
      searchKey = el1.value;
    }
    const el2 = document.getElementById(
      `property-searchValue-${uniqueId}`,
    ) as HTMLInputElement | null;
    if (el2) {
      searchValue = el2.value;
    }
    formData.set("searchKey", searchKey);
    formData.set("searchValue", searchValue);
    startTransition(() => {
      searchProperty(formData)
        .then((res) => {
          if (res.data) {
            // if previously selected customer is not in new results, reset
            if (!res.data.find((x) => x.id === propertyId)) {
              update(null);
            }
            setSearchResults(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Search Failed.");
        });
    });
  };

  useEffect(() => {
    if (propertyId) {
      startTransition(() => {
        getPropertyById(propertyId).then(({ data }) => {
          if (data) {
            setSearchResults([data, ...searchResults]);
          }
        });
      });
    }
  }, []);

  const propertyName = selectedProperty && getPropertyName(selectedProperty);

  return (
    <Popover
      content={
        <Card className="m-0 min-w-xl text-black dark:text-white">
          {readOnly ? (
            <h4 className="font-bold">Property Detail (Readonly)</h4>
          ) : (
            <div>
              <h4 className="mb-2 font-bold">
                Search Properties using Name or Code
              </h4>
              <div className="flex flex-row items-center gap-2">
                <Select
                  id={`property-searchKey-${uniqueId}`}
                  className="min-w-36"
                >
                  <option value="Property Name">Property Name</option>
                  <option value="Property Code">Property Code</option>
                </Select>
                <TextInput
                  type="text"
                  id={`property-searchValue-${uniqueId}`}
                  className="w-full"
                />
                <MyButton
                  onClick={handleSearch}
                  loading={loading}
                  type="submit"
                  className="px-2"
                >
                  <HiSearch size={24} />
                </MyButton>
              </div>
            </div>
          )}
          {loading ? (
            <div>Searching...</div>
          ) : searchResults.length === 0 ? (
            <div>No properties found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {searchResults.map((result) => (
                <label key={result.id} className="flex items-center gap-4">
                  <Checkbox
                    checked={result.id === propertyId}
                    onChange={() =>
                      !readOnly &&
                      update(propertyId === result.id ? null : result.id)
                    }
                  />
                  <div className="flex w-full cursor-pointer flex-col">
                    <div className="font-bold">{getPropertyName(result)}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </Card>
      }
    >
      <TextInput
        value={propertyId ? propertyName || propertyId : ""}
        placeholder="Select Property"
        readOnly
      ></TextInput>
    </Popover>
  );
}
