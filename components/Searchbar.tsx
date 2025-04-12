"use client";

import { Dropdown, DropdownItem } from "flowbite-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchbarProps {
  searchKeys: string[];
  defaultSearchKey: string;
}

export default function Searchbar(props: SearchbarProps) {
  const [searchKey, setSearchKey] = useState<string>(props.defaultSearchKey);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sk = searchParams.get("searchKey");
    const sv = searchParams.get("searchValue");
    if (sv?.length && sk?.length) {
      setSearchKey(sk);
      const el = document.getElementById(
        "searchValue",
      ) as HTMLInputElement | null;
      if (el) {
        el.value = sv;
      }
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("searchKey");
      newSearchParams.delete("searchValue");

      const newPathname = window.location.pathname; // Or you can use router.pathname
      const newQuery = newSearchParams.toString();
      const newUrl = `${newPathname}${newQuery ? `?${newQuery}` : ""}`;

      router.push(newUrl, { scroll: false }); // { scroll: false } is optional
    }
  }, [searchParams, router]);

  return (
    <form className="mx-auto max-w-lg">
      <input
        type="search"
        id="searchKey"
        name="searchKey"
        value={searchKey}
        className="z-20 hidden w-full min-w-sm rounded-e-lg border border-s-2 border-gray-300 border-s-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-s-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
        placeholder="Hidden input for search key"
        readOnly
      />
      <div className="flex">
        <div className="flex w-full flex-row items-center rounded-l-md bg-blue-700">
          <Dropdown className="rounded-r-none" label={searchKey}>
            {props.searchKeys.map((sk) => (
              <DropdownItem key={sk} onClick={() => setSearchKey(sk)}>
                {sk}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
        {/* <label
          htmlFor="search-dropdown"
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
        <button
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
          type="button"
        >
          {searchKey}
          <svg
            className="ms-2.5 h-2.5 w-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <div
          id="dropdown"
          className="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-sm dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdown-button"
          >
            {props.searchKeys.map((sk) => (
              <li key={sk}>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {sk}
                </button>
              </li>
            ))}
          </ul>
        </div> */}
        <div className="relative w-full">
          <input
            type="search"
            id="searchValue"
            name="searchValue"
            className="z-20 block w-full min-w-sm rounded-e-lg border border-s-2 border-gray-300 border-s-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-s-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            placeholder="Search..."
          />
          <button
            type="submit"
            className="absolute end-0 top-0 h-full rounded-e-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="h-4 w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
