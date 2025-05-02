"use client";

import { useState, useEffect } from "react";
import { Checkbox, Datepicker, Label, Select, TextInput } from "flowbite-react";
import MyButton from "@/components/MyButton";
import {
  createCouponWithProperties,
  getPropertyNamesByUserId,
  getUsersWithProperties,
  updateCouponWithProperties,
} from "@/actions/couponActions";
import { DAYS_OF_WEEK } from "@/utils/Constants";
import { formatDateForDatabase, formatDateToNormal } from "@/utils/utils";
import { CouponEditorProps, propertiesTypes, userTypes } from "@/utils/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  // Extra Data
  const [users, setUsers] = useState<userTypes[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [properties, setProperties] = useState<propertiesTypes[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false);

  useEffect(() => {
    if (!couponData) return;
    setName(couponData.name || "");
    setCode(couponData.code || "");
    setValidFrom(formatDateToNormal(couponData.validFrom) || new Date());
    setValidTo(formatDateToNormal(couponData.validTo) || new Date());
    setDiscountType(couponData.discountType || "percentage");
    setValue(couponData.value || 0);
    setMaxDiscountValue(couponData.maxDiscountValue || 0);
    setSelectedDays(couponData.applicableDays.split("\n"));
  }, [couponData]);

  // Computed properties
  const allDays = selectedDays.length === DAYS_OF_WEEK.length ? true : false;
  const allProperties =
    properties.length > 0 && selectedProperties.length === properties.length;

  // Handlers
  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  useEffect(() => {
    const datafunction = async () => {
      const result = await getUsersWithProperties();
      setUsers(result);
    };

    datafunction();
  }, []);

  const handleAllDaysToggle = () => {
    if (allDays) {
      setSelectedDays([]);
    } else {
      setSelectedDays([...DAYS_OF_WEEK]);
    }
  };

  const handlePropertyToggle = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter((p) => p !== propertyId));
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const handleAllPropertiesToggle = () => {
    if (allProperties) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map((prop) => prop.id));
    }
  };

  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);

    if (userId) {
      setLoadingProperties(true);
      try {
        const props = await getPropertyNamesByUserId(userId);
        setProperties(props);
        setSelectedProperties([]);
        setLoadingProperties(false);
      } catch (error) {
        toast.error("Failed to load properties");
        setLoadingProperties(false);
      }
    } else {
      setProperties([]);
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
      couponPayload.id = couponData.id;
      result = updateCouponWithProperties(couponPayload, selectedProperties);
    } else {
      result = createCouponWithProperties(couponPayload, selectedProperties);
    }

    console.log(couponPayload, selectedProperties);

    result
      .then((data) => {
        if (data.success) {
          toast.success(
            `Coupon Created successfullyw with id : ${data.couponId}`,
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
      {/* User Selection */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="user">Select Property Owner or Manager</Label>
        </div>
        <Select id="user" value={selectedUserId} onChange={handleUserChange}>
          <option value="">Select User (Admin/Manager/Owner)</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {`${user.firstName} ${user.lastName}`} ({user.email})
            </option>
          ))}
        </Select>
      </div>

      {/* Applicable Properties */}
      <div>
        <div className="mb-2 block">
          <Label>Applicable Properties</Label>
        </div>

        {loadingProperties ? (
          <div className="flex justify-center py-4">
            <div className="text-center">
              <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              <p>Loading properties...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center">
              <Checkbox
                id="allProperties"
                checked={allProperties}
                onChange={handleAllPropertiesToggle}
                disabled={properties.length === 0}
              />
              <Label htmlFor="allProperties" className="ml-2">
                Apply to all properties{" "}
                {properties.length > 0 ? `(${properties.length})` : ""}
              </Label>
            </div>

            {properties.length === 0 ? (
              <p className="text-gray-500">
                {selectedUserId
                  ? "No properties found for the selected user."
                  : "Please select a user to view their properties."}
              </p>
            ) : (
              <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto rounded py-2 sm:grid-cols-2 md:grid-cols-3">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center">
                    <Checkbox
                      id={`property-${property.id}`}
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handlePropertyToggle(property.id)}
                    />
                    <Label
                      htmlFor={`property-${property.id}`}
                      className="ml-2 truncate text-sm"
                    >
                      {property.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
            value={validFrom}
            onChange={setValidFrom}
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
            value={validTo}
            onChange={setValidTo}
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
