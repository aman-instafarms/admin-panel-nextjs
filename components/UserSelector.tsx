"use client";

import { UserData, UserRole } from "@/utils/types";
import { Card, Checkbox, Popover, Select, TextInput } from "flowbite-react";
import { useEffect, useState, useTransition, MouseEvent } from "react";
import toast from "react-hot-toast";
import MyButton from "./MyButton";
import { HiSearch } from "react-icons/hi";
import { v4 } from "uuid";
import { getUser, searchUser } from "@/actions/userActions";

interface UserSelectorProps {
  data: { id: string; role: string } | null;
  update: (data: { id: string; role: UserRole } | null) => void;
  readOnly?: boolean;
}

export default function UserSelector({
  data,
  update,
  readOnly,
}: UserSelectorProps) {
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [loading, startTransition] = useTransition();
  const [uniqueId] = useState<string>(v4());

  const selectedUser = searchResults.find(
    (x) => data && x.id === data.id && x.role === data.role,
  );

  const handleSearch = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSearchResults([]);
    const formData = new FormData();
    let searchKey = "";
    let searchValue = "";
    const el1 = document.getElementById(
      `user-searchKey-${uniqueId}`,
    ) as HTMLSelectElement | null;
    if (el1) {
      searchKey = el1.value;
    }
    const el2 = document.getElementById(
      `user-searchValue-${uniqueId}`,
    ) as HTMLInputElement | null;
    if (el2) {
      searchValue = el2.value;
    }
    formData.set("searchKey", searchKey);
    formData.set("searchValue", searchValue);
    startTransition(() => {
      searchUser(formData)
        .then((res) => {
          if (res.data) {
            // if previously selected customer is not in new results, reset
            if (
              !res.data.find(
                (x) => data && x.id === data.id && x.role === data.role,
              )
            ) {
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
    if (data) {
      startTransition(() => {
        if (data) {
          getUser(data.id, data.role).then(({ data }) => {
            if (data) {
              setSearchResults([data, ...searchResults]);
            }
          });
        }
      });
    }
  }, []);

  const userString =
    selectedUser &&
    `${selectedUser.firstName} ${selectedUser.lastName ? selectedUser.lastName : ""} - ${selectedUser.role}`;

  return (
    <Popover
      content={
        <Card className="m-0 min-w-xl">
          {readOnly ? (
            <h4 className="font-bold">User Detail (Readonly)</h4>
          ) : (
            <div className="flex flex-col gap-2">
              <h4 className="font-bold">
                Search Users using Name, Email or Mobile
              </h4>
              <div className="flex flex-row items-center gap-2">
                <Select id={`user-searchKey-${uniqueId}`} className="min-w-32">
                  <option value="Name">Name</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Email">Email</option>
                </Select>
                <TextInput
                  type="text"
                  id={`user-searchValue-${uniqueId}`}
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
          <div>
            {loading ? (
              <div>Searching...</div>
            ) : searchResults.length === 0 ? (
              <div>No users found.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {searchResults.map((result) => (
                  <label key={result.id} className="flex items-center gap-4">
                    <Checkbox
                      checked={
                        !!data &&
                        result.id === data.id &&
                        result.role === data.role
                      }
                      onChange={() =>
                        !readOnly &&
                        update(
                          data &&
                            data.id === result.id &&
                            data.role === result.role
                            ? null
                            : { id: result.id, role: result.role },
                        )
                      }
                    />
                    <div className="flex w-full cursor-pointer flex-col">
                      <div className="font-bold">
                        {result.firstName} {result.lastName} - {result.role}
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
        value={data ? userString || `${data.id} - ${data.role}` : ""}
        placeholder="Select User"
        readOnly
      ></TextInput>
    </Popover>
  );
}
