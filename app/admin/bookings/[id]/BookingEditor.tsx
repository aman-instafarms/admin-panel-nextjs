"use client";

import CustomerSelector from "@/components/CustomerSelector";
import LabelWrapper from "@/components/LabelWrapper";
import PropertySelector from "@/components/PropertySelector";
import UserSelector from "@/components/UserSelector";
import { BookingData, UserRole } from "@/utils/types";
import {
  Datepicker,
  Select,
  TabItem,
  Tabs,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useState, useEffect } from "react";

interface BookingEditorProps {
  data?: BookingData;
}

export default function BookingEditor(props: BookingEditorProps) {
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [bookingCreator, setBookingCreator] = useState<{
    id: string;
    role: UserRole;
  } | null>(null);
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);

  useEffect(() => {
    if (props.data) {
    }
  }, [props.data]);

  return (
    <form className="flex w-full flex-col gap-5">
      <Tabs className="text-white">
        <TabItem title="Detail" className="align-center flex flex-col">
          <div className="mx-auto grid max-w-[1000px] grid-cols-3 gap-5">
            <LabelWrapper label="Property">
              <PropertySelector
                propertyId={propertyId}
                update={setPropertyId}
              />
            </LabelWrapper>
            <LabelWrapper label="Customer">
              <CustomerSelector
                customerId={customerId}
                update={setCustomerId}
              />
            </LabelWrapper>
            <LabelWrapper label="Booking Created by">
              <UserSelector data={bookingCreator} update={setBookingCreator} />
            </LabelWrapper>
            <div className="col-span-3 grid grid-cols-2 gap-5">
              <LabelWrapper label="Booking Type">
                <Select id="bookingType" name="bookingType">
                  <option value="">Select Booking Type</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </Select>
              </LabelWrapper>
              <LabelWrapper label="Booking Source">
                <Select id="bookingSource" name="bookingSource">
                  <option value="">Select booking source</option>
                  <option value="_offline">Offline</option>
                  <option value="_airbnb">Airbnb</option>
                  <option value="_booking">Booking.com</option>
                  <option value="_agoda">Agoda</option>
                  <option value="_makemytrip">Make my trip</option>
                  <option value="_goibibo">Goibibo</option>
                </Select>
              </LabelWrapper>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-5">
              <LabelWrapper label="Adult Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="adultCount"
                  name="adultCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Children Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="childrenCount"
                  name="childrenCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Infant Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="infantCount"
                  name="infantCount"
                ></TextInput>
              </LabelWrapper>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-5">
              <LabelWrapper label="Checkin Date">
                <Datepicker
                  className="relative z-1"
                  value={checkinDate}
                  onChange={setCheckinDate}
                />
              </LabelWrapper>
              <LabelWrapper label="Checkout Date">
                <Datepicker value={checkoutDate} onChange={setCheckoutDate} />
              </LabelWrapper>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-5">
              <LabelWrapper label="Booking Remarks">
                <Textarea id="bookingRemarks" name="bookingRemarks" />
              </LabelWrapper>
              <LabelWrapper label="Special Requests">
                <Textarea id="specialRequests" name="specialRequests" />
              </LabelWrapper>
            </div>
          </div>
        </TabItem>
        <TabItem title="Commercials" className="align-center flex flex-col">
          <div className="mx-auto grid max-w-[1000px] grid-cols-3 gap-5">
            <LabelWrapper label="Rental Charge">
              <TextInput
                id="rentalCharge"
                name="rentalCharge"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Extra Guest Charge">
              <TextInput
                id="extraGuestCharge"
                name="extraGuestCharge"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Owner's Discount">
              <TextInput
                id="ownerDiscount"
                name="ownerDiscount"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Multiple Nights Discount">
              <TextInput
                id="multipleNightsDiscount"
                name="multipleNightsDiscount"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Coupon Discount">
              <TextInput
                id="couponDiscount"
                name="couponDiscount"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Total Discount">
              <TextInput
                id="totalDiscount"
                name="totalDiscount"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="GST Amount">
              <TextInput
                id="gstAmount"
                name="gstAmount"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="GST Percentage">
              <TextInput
                id="gstPercentage"
                name="gstPercentage"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="OTA Commission">
              <TextInput
                id="otaCommission"
                name="otaCommission"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Payment Gateway Charge">
              <TextInput
                id="paymentGatewayCharge"
                name="paymentGatewayCharge"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Net Owner Revenue">
              <TextInput
                id="netOwnerRevenue"
                name="netOwnerRevenue"
                inputMode="numeric"
              ></TextInput>
            </LabelWrapper>
          </div>
        </TabItem>
        <TabItem
          title="Payments"
          className="align-center flex flex-col"
        ></TabItem>
      </Tabs>
    </form>
  );
}
