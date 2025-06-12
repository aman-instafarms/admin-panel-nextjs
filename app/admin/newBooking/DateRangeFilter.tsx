"use client";

import { Button, Label, TextInput } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
// It seems HiCalendar and HiX were commented out or not used in the snippet,
// but if you intend to use them (e.g., for a dropdown trigger or clear button icon),
// ensure they are imported and utilized. For this fix, they are not strictly necessary.
// import { HiCalendar, HiX } from "react-icons/hi";

interface DateRangeFilterProps {
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function DateRangeFilter({
  startDate,
  endDate,
}: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localStartDate, setLocalStartDate] = useState(
    startDate ? startDate.toISOString().split("T")[0] : "",
  );
  const [localEndDate, setLocalEndDate] = useState(
    endDate ? endDate.toISOString().split("T")[0] : "",
  );
  // const [isOpen, setIsOpen] = useState(false); // isOpen was not used in the provided snippet

  useEffect(() => {
    setLocalStartDate(startDate ? startDate.toISOString().split("T")[0] : "");
    setLocalEndDate(endDate ? endDate.toISOString().split("T")[0] : "");
  }, [startDate, endDate]);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (localStartDate) {
      params.set("startDate", localStartDate);
    } else {
      params.delete("startDate");
    }

    if (localEndDate) {
      params.set("endDate", localEndDate);
    } else {
      params.delete("endDate");
    }

    // Reset to first page when applying filters
    params.delete("offset");

    router.push(`?${params.toString()}`);
    // setIsOpen(false); // setIsOpen relates to 'isOpen' state which wasn't used
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("startDate");
    params.delete("endDate");
    params.delete("offset"); // Also reset offset when clearing

    setLocalStartDate("");
    setLocalEndDate("");

    router.push(`?${params.toString()}`);
    // setIsOpen(false); // setIsOpen relates to 'isOpen' state which wasn't used
  };

  const hasActiveFilter = !!(
    searchParams.get("startDate") || searchParams.get("endDate")
  );
  // Or, if you prefer to base it on the props initially passed:
  // const hasActiveFilter = !!(startDate || endDate);

  return (
    <div className="flex flex-wrap items-end justify-center gap-4 py-4">
      <div className="w-48">
        <div className="mb-2 block">
          <Label htmlFor="start-date" value="Start Date" />
        </div>
        <TextInput
          id="start-date"
          type="date"
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
          max={localEndDate || undefined} // Prevent start date from being after end date
        />
      </div>

      <div className="w-48">
        <div className="mb-2 block">
          <Label htmlFor="end-date" value="End Date" />
        </div>
        <TextInput
          id="end-date"
          type="date"
          value={localEndDate}
          onChange={(e) => setLocalEndDate(e.target.value)}
          min={localStartDate || undefined} // Prevent end date from being before start date
        />
      </div>
      <Button
        size="sm"
        onClick={handleFilter}
        className="h-fit px-4 py-2"
        disabled={!localStartDate || !localEndDate}
      >
        Apply Filter
      </Button>
      <Button
        size="sm"
        color="gray"
        onClick={handleClear}
        className="h-fit px-4 py-2"
        disabled={!hasActiveFilter} // Disable if no filter is currently active in URL params
      >
        Clear
      </Button>
    </div>
  );
}
