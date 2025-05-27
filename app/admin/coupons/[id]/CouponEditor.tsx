"use client";

import { useState, useEffect } from "react";
import { Checkbox, Datepicker, Label, Select, TextInput } from "flowbite-react";
import MyButton from "@/components/MyButton";
import { DAYS_OF_WEEK } from "@/utils/Constants";
import { formatDateToNormal, formatDateForDatabase } from "@/utils/utils";
import { _Coupon } from "@/utils/types";
import { useRouter } from "next/navigation";
import PropertiesTable from "./PropertiesTable";
import { toast } from "react-hot-toast"; // Make sure toast is properly imported
import {
  createCouponWithProperties,
  updateCouponWithProperties,
} from "@/actions/couponActions"; // Assuming these functions exist

interface CouponEditorProps {
  couponData: _Coupon | null;
}

export default function CouponEditor({ couponData }: CouponEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // Form Parent State
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [validFrom, setValidFrom] = useState<Date>(new Date());
  const [validTo, setValidTo] = useState<Date>(new Date());
  const [discountType, setDiscountType] = useState<string>("flat");
  const [value, setValue] = useState<number>(0);
  const [maxDiscountValue, setMaxDiscountValue] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [searchManagerOwner, setSearchManagerOwner] = useState<string>("");

  useEffect(() => {
    if (!couponData) return;
    setName(couponData.name || "");
    setCode(couponData.code || "");
    setValidFrom(
      couponData.validFrom ? new Date(couponData.validFrom) : new Date(),
    );
    setValidTo(couponData.validTo ? new Date(couponData.validTo) : new Date());
    setDiscountType(couponData.discountType || "percentage");
    setValue(couponData.value || 0);
    setMaxDiscountValue(couponData.maxDiscountValue || null);

    // Parse applicable days if they exist
    if (couponData.applicableDays) {
      setSelectedDays(couponData.applicableDays.split("\n"));
    }

    // Set selected properties if they exist
    if (couponData.properties && Array.isArray(couponData.properties)) {
      setSelectedProperties(couponData.properties.map((prop) => prop.id));
    }
  }, [couponData]);

  // Computed properties
  const allDays = selectedDays.length === DAYS_OF_WEEK.length;

  // Handlers
  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAllDaysToggle = () => {
    if (allDays) {
      setSelectedDays([]);
    } else {
      setSelectedDays([...DAYS_OF_WEEK]);
    }
  };

  const handlePropertySelection = (propertyId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProperties([...selectedProperties, propertyId]);
    } else {
      setSelectedProperties(
        selectedProperties.filter((id) => id !== propertyId),
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const couponPayload = {
      name,
      code,
      validFrom: formatDateForDatabase(validFrom),
      validTo: formatDateForDatabase(validTo),
      discountType,
      value,
      maxDiscountValue,
      applicableDays: selectedDays.join("\n"),
    };

    let result;
    if (couponData) {
      result = updateCouponWithProperties(
        {
          ...couponPayload,
          id: couponData.id,
        },
        selectedProperties,
      );
    } else {
      result = createCouponWithProperties(couponPayload, selectedProperties);
    }

    result
      .then((data) => {
        if (data.success) {
          toast.success(
            `Coupon ${couponData ? "Updated" : "Created"} successfully with id: ${data.couponId}`,
          );
          setLoading(false);
          router.push("/admin/coupons");
        }
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong");
        setLoading(false);
      });
  };

  return (
    <form
      className="flex w-full flex-col gap-8"
      id="couponForm"
      onSubmit={handleSubmit}
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="searchManagerOwner">Enter Manager/Owner Name</Label>
        </div>
        <TextInput
          id="searchManagerOwner"
          name="searchManagerOwner"
          type="text"
          placeholder="Yeshwanth"
          value={searchManagerOwner}
          onChange={(e) => setSearchManagerOwner(e.target.value)}
        />
      </div>

      <PropertiesTable
        searchTerm={searchManagerOwner}
        selectedProperties={selectedProperties}
        onPropertySelect={handlePropertySelection}
      />

      {/* Basic Coupon Information */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name">Coupon Name</Label>
          </div>
          <TextInput
            id="name"
            name="name"
            type="text"
            placeholder="Summer Sale"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="code">Coupon Code</Label>
          </div>
          <TextInput
            id="code"
            name="code"
            type="text"
            placeholder="SUMMER2025"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </div>

        <div className="relative z-40 overflow-y-visible">
          <div className="mb-2 block">
            <Label htmlFor="validFrom">Valid From</Label>
          </div>
          <Datepicker
            id="validFrom"
            name="validFrom"
            value={validFrom.toString()}
            onSelectedDateChanged={setValidFrom}
            required
          />
        </div>

        <div className="relative z-30 overflow-y-visible">
          <div className="mb-2 block">
            <Label htmlFor="validTo">Valid To</Label>
          </div>
          <Datepicker
            id="validTo"
            name="validTo"
            value={validTo.toString()}
            onSelectedDateChanged={setValidTo}
            required
          />
        </div>
      </div>

      {/* Discount Configuration */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="discountType">Discount Type</Label>
          </div>
          <Select
            id="discountType"
            name="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            required
          >
            <option value="flat">Flat Amount (₹)</option>
            <option value="percentage">Percentage (%)</option>
          </Select>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="value">
              {`Discount ${discountType === "flat" ? "Amount (₹)" : "Percentage (%)"}`}
            </Label>
          </div>
          <TextInput
            id="value"
            name="value"
            type="number"
            min={0}
            max={discountType === "percentage" ? 100 : undefined}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
        </div>

        {discountType === "percentage" && (
          <div>
            <div className="mb-2 block">
              <Label htmlFor="maxDiscountValue">
                Maximum Discount Amount (₹)
              </Label>
            </div>
            <TextInput
              id="maxDiscountValue"
              name="maxDiscountValue"
              type="number"
              min={0}
              value={maxDiscountValue || ""}
              onChange={(e) =>
                setMaxDiscountValue(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            />
          </div>
        )}
      </div>

      {/* Applicable Days */}
      <div>
        <div className="mb-2 block">
          <Label>Applicable Days</Label>
        </div>

        <div className="mb-4 flex items-center">
          <Checkbox
            id="allDays"
            checked={allDays}
            onChange={handleAllDaysToggle}
          />
          <Label htmlFor="allDays" className="ml-2">
            Apply to all days
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center">
              <Checkbox
                id={`day-${day}`}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayToggle(day)}
              />
              <Label htmlFor={`day-${day}`} className="ml-2">
                {day}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-row justify-center">
        <MyButton loading={loading} type="submit">
          {couponData ? "Update Coupon" : "Create Coupon"}
        </MyButton>
      </div>
    </form>
  );
}
