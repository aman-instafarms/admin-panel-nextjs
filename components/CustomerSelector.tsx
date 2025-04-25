"use client";

import { CustomerData } from "@/utils/types";
import { Card, Checkbox, Popover, Select, TextInput } from "flowbite-react";
import { useEffect, useState, useTransition, MouseEvent } from "react";
import { getCustomerById, searchCustomer } from "@/actions/customerActions";
import toast from "react-hot-toast";
import MyButton from "./MyButton";
import { HiSearch } from "react-icons/hi";
import { v4 } from "uuid";

interface CustomerSelectorProps {
  customerId: string | null;
  update: (customerId: string | null) => void;
}

export default function CustomerSelector({
  customerId,
  update,
}: CustomerSelectorProps) {
  const [searchResults, setSearchResults] = useState<CustomerData[]>([]);
  const [loading, startTransition] = useTransition();
  const [uniqueId] = useState<string>(v4());

  const selectedCustomer = searchResults.find((x) => x.id === customerId);

  const handleSearch = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSearchResults([]);
    const formData = new FormData();
    let searchKey = "";
    let searchValue = "";
    const el1 = document.getElementById(
      `customer-searchKey-${uniqueId}`,
    ) as HTMLSelectElement | null;
    if (el1) {
      searchKey = el1.value;
    }
    const el2 = document.getElementById(
      `customer-searchValue-${uniqueId}`,
    ) as HTMLInputElement | null;
    if (el2) {
      searchValue = el2.value;
    }
    formData.set("searchKey", searchKey);
    formData.set("searchValue", searchValue);
    startTransition(() => {
      searchCustomer(formData)
        .then((res) => {
          if (res.data) {
            // if previously selected customer is not in new results, reset
            if (!res.data.find((x) => x.id === customerId)) {
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
    if (customerId) {
      startTransition(() => {
        getCustomerById(customerId).then(({ data }) => {
          if (data) {
            setSearchResults([data, ...searchResults]);
          }
        });
      });
    }
  }, []);

  console.log(searchResults, selectedCustomer, customerId);

  const customerName =
    selectedCustomer &&
    `${selectedCustomer.firstName} ${selectedCustomer.lastName ? selectedCustomer.lastName : ""}`;

  return (
    <Popover
      content={
        <Card className="m-0 min-w-xl">
          <h4 className="font-bold">
            Search Customers using Name, Email or Mobile
          </h4>
          <div className="flex flex-row items-center gap-2">
            <Select id={`customer-searchKey-${uniqueId}`} className="min-w-32">
              <option value="Name">Name</option>
              <option value="Mobile">Mobile</option>
              <option value="Email">Email</option>
            </Select>
            <TextInput
              type="text"
              id={`customer-searchValue-${uniqueId}`}
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
          <div>
            {loading ? (
              <div>Searching...</div>
            ) : searchResults.length === 0 ? (
              <div>No customers found.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {searchResults.map((result) => (
                  <label key={result.id} className="flex items-center gap-4">
                    <Checkbox
                      checked={result.id === customerId}
                      onChange={() =>
                        update(customerId === result.id ? null : result.id)
                      }
                    />
                    <div className="flex w-full cursor-pointer flex-col">
                      <div className="font-bold">
                        {result.firstName} {result.lastName}
                      </div>
                      <div className="flex flex-row gap-3 text-sm">
                        <div>{result.mobileNumber}</div>
                        <div>{result.email}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </Card>
      }
    >
      <TextInput
        value={customerId ? customerName || customerId : ""}
        placeholder="Select Customer"
        readOnly
      ></TextInput>
    </Popover>
  );
}
