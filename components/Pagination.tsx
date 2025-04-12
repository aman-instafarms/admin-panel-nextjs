"use client";

import { Button, Select } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect } from "react";

export default function Pagination() {
  const searchParams = useSearchParams();
  const router = useRouter();

  let itemsPerPage = Number(searchParams.get("itemsPerPage"));
  let page = Number(searchParams.get("page"));

  itemsPerPage = Number.isNaN(itemsPerPage) ? 10 : itemsPerPage;
  page = Number.isNaN(page) ? 1 : page;

  itemsPerPage = Math.max(1, itemsPerPage);
  page = Math.max(1, page);

  const updateItemsPerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    const newVal = Number(event.target.value);
    if (!Number.isNaN(newVal)) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("itemsPerPage", newVal.toString());

      const newPathname = window.location.pathname; // Or you can use router.pathname
      const newQuery = newSearchParams.toString();
      const newUrl = `${newPathname}${newQuery ? `?${newQuery}` : ""}`;

      router.push(newUrl, { scroll: false }); // { scroll: false } is optional
    }
  };

  const updatePageNo = (pageNo: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", pageNo.toString());

    const newPathname = window.location.pathname; // Or you can use router.pathname
    const newQuery = newSearchParams.toString();
    const newUrl = `${newPathname}${newQuery ? `?${newQuery}` : ""}`;

    router.push(newUrl, { scroll: false }); // { scroll: false } is optional
  };

  useEffect(() => {
    const el = document.getElementById(
      "itemsPerpage",
    ) as HTMLSelectElement | null;
    if (el) {
      el.value = itemsPerPage.toString();
    }
  }, [searchParams]);

  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <Select
        className="min-w-22"
        id="itemsPerPage"
        onChange={updateItemsPerPage}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Select>
      {page > 5 && (
        <Button
          onClick={() => updatePageNo(1)}
          size="small"
          className="mr-3 aspect-square min-w-6 p-3"
        >
          <span className="text-sm">1</span>
        </Button>
      )}
      {Array.from({ length: Math.min(5, page) }).map((_, index) => {
        const pageNo = page - (Math.min(5, page) - 1) + index;
        return (
          <Button
            onClick={() => updatePageNo(pageNo)}
            key={index}
            size="small"
            className="aspect-square min-w-6 p-3"
          >
            <span className="text-sm">{pageNo}</span>
          </Button>
        );
      })}
      <Button
        size="small"
        className="min-w-6 p-3"
        onClick={() => updatePageNo(page + 1)}
      >
        <span className="text-sm">Next</span>
      </Button>
    </div>
  );
}
