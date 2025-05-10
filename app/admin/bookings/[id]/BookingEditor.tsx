"use client";

import {
  cancelBooking,
  createBooking,
  updateBooking,
} from "@/actions/bookingActions";
import BankInput from "@/components/BankInput";
import CustomerSelector from "@/components/CustomerSelector";
import LabelWrapper from "@/components/LabelWrapper";
import MyButton from "@/components/MyButton";
import PropertySelector from "@/components/PropertySelector";
import UserSelector from "@/components/UserSelector";
import { _PaymentData, BookingData, PaymentMode } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import {
  Button,
  Datepicker,
  Select,
  TabItem,
  Tabs,
  Textarea,
  TextInput,
} from "flowbite-react";
import { DateTime } from "luxon";
import { useState, useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { HiMinus, HiPlus } from "react-icons/hi";
import { v4 } from "uuid";

interface BookingEditorProps {
  data?: BookingData;
  paymentData?: _PaymentData[];
}

const createNewPayment = (): _PaymentData => ({
  id: v4(),
  bookingId: "",
  paymentDate: DateTime.now().toSQLDate(),
  transactionType: "Credit",
  amount: 0,
  referencePersonId: "",
  paymentMode: "Cash",
  paymentType: "Rent",
  bankAccountHolderName: "",
  bankIfsc: "",
  bankAccountNumber: "",
  bankName: "",
  bankNickname: "",
});

export default function BookingEditor(props: BookingEditorProps) {
  const [loading, startTransition] = useTransition();
  const [showCancellationForm, setShowCancellationForm] =
    useState<boolean>(false);
  const [cancellationLoading, startCancellationTransition] = useTransition();
  const [propertyId, setPropertyId] = useState<string | null>(
    props.data ? props.data.propertyId : null,
  );
  const [customerId, setCustomerId] = useState<string | null>(
    props.data ? props.data.customerId : null,
  );
  const [bookingCreator, setBookingCreator] = useState<string | null>(
    props.data ? props.data.bookingCreatorId : null,
  );
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [payments, setPayments] = useState<_PaymentData[]>([]);
  const [cancellationReferencePerson, setCancelattionReferencePerson] =
    useState<string | null>(
      props.data?.cancellation
        ? props.data.cancellation.referencePersonId
        : null,
    );

  const handleSubmit = () => {
    const formEl = document.getElementById(
      "bookingForm",
    ) as HTMLFormElement | null;
    if (!formEl) {
      return toast.error("Error");
    }
    const formData = new FormData(formEl);
    formData.set("propertyId", propertyId || "");
    formData.set("customerId", customerId || "");
    formData.set("bookingCreatorId", bookingCreator || "");
    const checkinDt = checkinDate && DateTime.fromJSDate(checkinDate);
    const checkoutDt = checkoutDate && DateTime.fromJSDate(checkoutDate);
    formData.set(
      "checkinDate",
      checkinDt?.isValid ? checkinDt.toSQLDate() : "",
    );
    formData.set(
      "checkoutDate",
      checkoutDt?.isValid ? checkoutDt.toSQLDate() : "",
    );
    payments.forEach((p) => {
      formData.set(`payment-${p.id}`, p.paymentDate);
      formData.set(`payment-referencePersonId-${p.id}`, p.referencePersonId);
      formData.set(`bankName-${p.id}`, p.bankName || "");
      formData.set(
        `bankAccountHolderName-${p.id}`,
        p.bankAccountHolderName || "",
      );
      formData.set(`bankAccountNumber-${p.id}`, p.bankAccountNumber || "");
      formData.set(`bankIfsc-${p.id}`, p.bankIfsc || "");
      formData.set(`bankNickname-${p.id}`, p.bankNickname || "");
    });
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editBookingWithId = updateBooking.bind(null, props.data.id);
        promise = parseServerActionResult(editBookingWithId(formData));
      } else {
        promise = parseServerActionResult(createBooking(formData));
      }

      toast.promise(promise, {
        loading: "Saving Booking data...",
        success: (data) => {
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  const saveCancellationData = () => {
    const formEl = document.getElementById(
      "bookingForm",
    ) as HTMLFormElement | null;
    if (!formEl) {
      return toast.error("Error");
    }
    const formData = new FormData(formEl);
    formData.set(
      "cancellationReferencePersonId",
      cancellationReferencePerson || "",
    );
    startCancellationTransition(() => {
      if (props.data) {
        const cancelBookingWithId = cancelBooking.bind(null, props.data.id);
        const promise: Promise<string> = parseServerActionResult(
          cancelBookingWithId(formData),
        );

        toast.promise(promise, {
          loading: "Saving Booking data...",
          success: (data) => {
            return data;
          },
          error: (err) => (err as Error).message,
        });
      }
    });
  };

  useEffect(() => {
    if (props.data) {
      setPropertyId(props.data.propertyId);
      setCustomerId(props.data.customerId);
      setBookingCreator(props.data.bookingCreatorId);
      if (props.paymentData) {
        setPayments(props.paymentData);
      }
      const el = document.getElementById(
        "bookingSource",
      ) as HTMLSelectElement | null;
      if (el && props.data.bookingSource) {
        el.value = props.data.bookingSource;
      }

      const bookingTypeEl = document.getElementById(
        "bookingType",
      ) as HTMLSelectElement | null;
      if (bookingTypeEl) {
        bookingTypeEl.value = props.data.bookingType;
      }

      const adultCountEl = document.getElementById(
        "adultCount",
      ) as HTMLInputElement | null;
      if (adultCountEl) {
        adultCountEl.value = props.data.adultCount.toString() || "0";
      }

      const childrenCountEl = document.getElementById(
        "childrenCount",
      ) as HTMLInputElement | null;
      if (childrenCountEl) {
        childrenCountEl.value = props.data.childrenCount.toString() || "0";
      }

      const infantCountEl = document.getElementById(
        "infantCount",
      ) as HTMLInputElement | null;
      if (infantCountEl) {
        infantCountEl.value = props.data.infantCount.toString() || "0";
      }

      setCheckinDate(
        props.data.checkinDate
          ? DateTime.fromSQL(props.data.checkinDate).toJSDate()
          : null,
      );
      setCheckoutDate(
        props.data.checkoutDate
          ? DateTime.fromSQL(props.data.checkoutDate).toJSDate()
          : null,
      );

      const bookingRemarksEl = document.getElementById(
        "bookingRemarks",
      ) as HTMLTextAreaElement | null;
      if (bookingRemarksEl && props.data.bookingRemarks) {
        bookingRemarksEl.value = props.data.bookingRemarks;
      }

      const specialRequestsEl = document.getElementById(
        "specialRequests",
      ) as HTMLTextAreaElement | null;
      if (specialRequestsEl && props.data.specialRequests) {
        specialRequestsEl.value = props.data.specialRequests;
      }

      const rentalChargeEl = document.getElementById(
        "rentalCharge",
      ) as HTMLInputElement | null;
      if (rentalChargeEl) {
        rentalChargeEl.value = props.data.rentalCharge.toString() || "0";
      }

      const extraGuestChargeEl = document.getElementById(
        "extraGuestCharge",
      ) as HTMLInputElement | null;
      if (extraGuestChargeEl) {
        extraGuestChargeEl.value =
          props.data.extraGuestCharge.toString() || "0";
      }

      const ownerDiscountEl = document.getElementById(
        "ownerDiscount",
      ) as HTMLInputElement | null;
      if (ownerDiscountEl) {
        ownerDiscountEl.value = props.data.ownerDiscount.toString() || "0";
      }

      const multipleNightsDiscountEl = document.getElementById(
        "multipleNightsDiscount",
      ) as HTMLInputElement | null;
      if (multipleNightsDiscountEl) {
        multipleNightsDiscountEl.value =
          props.data.multipleNightsDiscount.toString() || "0";
      }

      const couponDiscountEl = document.getElementById(
        "couponDiscount",
      ) as HTMLInputElement | null;
      if (couponDiscountEl) {
        couponDiscountEl.value = props.data.couponDiscount.toString() || "0";
      }

      const totalDiscountEl = document.getElementById(
        "totalDiscount",
      ) as HTMLInputElement | null;
      if (totalDiscountEl) {
        totalDiscountEl.value = props.data.totalDiscount.toString() || "0";
      }

      const gstAmountEl = document.getElementById(
        "gstAmount",
      ) as HTMLInputElement | null;
      if (gstAmountEl) {
        gstAmountEl.value = props.data.gstAmount.toString() || "0";
      }

      const gstPercentageEl = document.getElementById(
        "gstPercentage",
      ) as HTMLInputElement | null;
      if (gstPercentageEl) {
        gstPercentageEl.value = props.data.gstPercentage.toString() || "0";
      }

      const otaCommissionEl = document.getElementById(
        "otaCommission",
      ) as HTMLInputElement | null;
      if (otaCommissionEl) {
        otaCommissionEl.value = props.data.otaCommission.toString() || "0";
      }

      const paymentGatewayChargeEl = document.getElementById(
        "paymentGatewayCharge",
      ) as HTMLInputElement | null;
      if (paymentGatewayChargeEl) {
        paymentGatewayChargeEl.value =
          props.data.paymentGatewayCharge.toString() || "0";
      }

      const netOwnerRevenueEl = document.getElementById(
        "netOwnerRevenue",
      ) as HTMLInputElement | null;
      if (netOwnerRevenueEl) {
        netOwnerRevenueEl.value = props.data.netOwnerRevenue.toString() || "0";
      }
    }
    if (props.data?.cancellation) {
      const el1 = document.getElementById(
        "refundAmount",
      ) as HTMLInputElement | null;
      if (el1) {
        el1.value = props.data.cancellation.refundAmount.toString() || "";
      }
      const el2 = document.getElementById(
        "refundStatus",
      ) as HTMLSelectElement | null;
      if (el2) {
        el2.value = props.data.cancellation.refundStatus;
      }
      const el3 = document.getElementById(
        "cancellationType",
      ) as HTMLSelectElement | null;
      if (el3) {
        el3.value = props.data.cancellation.cancellationType;
      }
    }
  }, []);

  return (
    <form id="bookingForm" className="flex w-full flex-col gap-5">
      <Tabs className="text-white">
        <TabItem title="Detail" className="align-center flex flex-col">
          <div className="mx-auto grid max-w-[1000px] grid-cols-3 gap-5">
            <LabelWrapper label="Property">
              <PropertySelector
                propertyId={propertyId}
                update={setPropertyId}
                readOnly={!!props.data}
              />
            </LabelWrapper>
            <LabelWrapper label="Customer">
              <CustomerSelector
                customerId={customerId}
                update={setCustomerId}
                readOnly={!!props.data}
              />
            </LabelWrapper>
            <LabelWrapper label="Booking Created by">
              <UserSelector
                data={bookingCreator}
                update={setBookingCreator}
                readOnly={!!props.data}
              />
            </LabelWrapper>
            <div className="col-span-3 grid grid-cols-2 gap-5">
              <LabelWrapper label="Booking Type">
                <Select
                  id="bookingType"
                  name="bookingType"
                  disabled={!!props.data}
                >
                  <option value="">Select Booking Type</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </Select>
              </LabelWrapper>
              <LabelWrapper label="Booking Source">
                <Select
                  id="bookingSource"
                  name="bookingSource"
                  disabled={!!props.data}
                >
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
                  disabled={!!props.data}
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
                  disabled={!!props.data}
                  id="childrenCount"
                  name="childrenCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Infant Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  disabled={!!props.data}
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
                  disabled={!!props.data}
                  onChange={setCheckinDate}
                />
              </LabelWrapper>
              <LabelWrapper label="Checkout Date">
                <Datepicker
                  className="relative z-1"
                  value={checkoutDate}
                  onChange={setCheckoutDate}
                  disabled={!!props.data}
                />
              </LabelWrapper>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-5">
              <LabelWrapper label="Booking Remarks">
                <Textarea
                  id="bookingRemarks"
                  name="bookingRemarks"
                  disabled={!!props.data}
                />
              </LabelWrapper>
              <LabelWrapper label="Special Requests">
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  disabled={!!props.data}
                />
              </LabelWrapper>
            </div>
          </div>
          <div className="mt-10 flex flex-row justify-end">
            <MyButton loading={loading} onClick={handleSubmit}>
              Submit
            </MyButton>
          </div>
        </TabItem>
        <TabItem title="Commercials" className="align-center flex flex-col">
          <div className="mx-auto grid max-w-[1000px] grid-cols-3 gap-5">
            <LabelWrapper label="Rental Charge">
              <TextInput
                id="rentalCharge"
                name="rentalCharge"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Extra Guest Charge">
              <TextInput
                id="extraGuestCharge"
                name="extraGuestCharge"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Owner's Discount">
              <TextInput
                id="ownerDiscount"
                name="ownerDiscount"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Multiple Nights Discount">
              <TextInput
                id="multipleNightsDiscount"
                name="multipleNightsDiscount"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Coupon Discount">
              <TextInput
                id="couponDiscount"
                name="couponDiscount"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Total Discount">
              <TextInput
                id="totalDiscount"
                name="totalDiscount"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="GST Amount">
              <TextInput
                id="gstAmount"
                name="gstAmount"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="GST Percentage">
              <TextInput
                id="gstPercentage"
                name="gstPercentage"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="OTA Commission">
              <TextInput
                id="otaCommission"
                name="otaCommission"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Payment Gateway Charge">
              <TextInput
                id="paymentGatewayCharge"
                name="paymentGatewayCharge"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Net Owner Revenue">
              <TextInput
                id="netOwnerRevenue"
                name="netOwnerRevenue"
                inputMode="numeric"
                disabled={!!props.data}
              ></TextInput>
            </LabelWrapper>
          </div>
          <div className="mt-10 flex flex-row justify-end">
            <MyButton loading={loading} onClick={handleSubmit}>
              Submit
            </MyButton>
          </div>
        </TabItem>
        <TabItem title="Payments" className="align-center flex flex-col">
          {payments.length === 0 ? (
            <div className="my-5">
              <Button onClick={() => setPayments([createNewPayment()])}>
                Create Payment
              </Button>
            </div>
          ) : (
            <table className="mx-auto mt-5 w-full border-separate border-spacing-5">
              <thead>
                <tr>
                  <th className="text-left">Payment Date</th>
                  <th>Transaction Type</th>
                  <th>Amount</th>
                  <th>Reference Person</th>
                  <th>Payment Type</th>
                  <th>Payment Mode</th>
                  <th>Bank Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, index) => (
                  <PaymentRow
                    payment={p}
                    update={(d) =>
                      setPayments(payments.map((x) => (x.id === d.id ? d : x)))
                    }
                    key={p.id}
                    showPlusButton={payments.length === index + 1}
                    addPayment={() =>
                      setPayments([...payments, createNewPayment()])
                    }
                    removePayment={(id: string) =>
                      setPayments(payments.filter((x) => x.id !== id))
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-10 flex flex-row justify-end">
            <MyButton loading={loading} onClick={handleSubmit}>
              Submit
            </MyButton>
          </div>
        </TabItem>
        {props.data && (
          <TabItem title="Cancellation" className="align-center flex flex-col">
            {props.data?.cancellation || showCancellationForm ? (
              <div>
                <div className="mx-auto grid max-w-[400px] grid-cols-1 gap-5">
                  <LabelWrapper label="Refund Amount">
                    <TextInput
                      type="numeric"
                      inputMode="numeric"
                      id="refundAmount"
                      name="refundAmount"
                    ></TextInput>
                  </LabelWrapper>
                  <LabelWrapper label="Refund Amount">
                    <Select id="refundStatus" name="refundStatus">
                      <option value="">Select Refund Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </Select>
                  </LabelWrapper>
                  <LabelWrapper label="Cancellation Type">
                    <Select id="cancellationType" name="cancellationType">
                      <option value="">Select Cancellation Type</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </Select>
                  </LabelWrapper>
                  <LabelWrapper label="Cancellation Reference Person">
                    <UserSelector
                      data={cancellationReferencePerson}
                      update={setCancelattionReferencePerson}
                    />
                  </LabelWrapper>
                </div>
                <div className="mt-10 flex flex-row justify-end">
                  <MyButton
                    color="red"
                    loading={cancellationLoading}
                    onClick={saveCancellationData}
                  >
                    Save Cancellation Data
                  </MyButton>
                </div>
              </div>
            ) : (
              <Button color="red" onClick={() => setShowCancellationForm(true)}>
                Cancel Booking
              </Button>
            )}
          </TabItem>
        )}
      </Tabs>
    </form>
  );
}

function PaymentRow({
  payment,
  update,
  showPlusButton,
  className,
  addPayment,
  removePayment,
}: {
  payment: _PaymentData;
  update: (payment: _PaymentData) => void;
  showPlusButton: boolean;
  addPayment: () => void;
  className?: string;
  removePayment: (id: string) => void;
}) {
  useEffect(() => {
    const el = document.getElementById(
      `payment-transactionType-${payment.id}`,
    ) as HTMLSelectElement | null;
    if (el) {
      el.value = payment.transactionType;
    }
    const el2 = document.getElementById(
      `payment-amount-${payment.id}`,
    ) as HTMLInputElement | null;
    if (el2) {
      el2.value = payment.amount.toString();
    }
    const el3 = document.getElementById(
      `payment-paymentType-${payment.id}`,
    ) as HTMLSelectElement | null;
    if (el3) {
      el3.value = payment.paymentType;
    }
    const el4 = document.getElementById(
      `payment-paymentMode-${payment.id}`,
    ) as HTMLSelectElement | null;
    if (el4) {
      el4.value = payment.paymentMode;
    }
  }, []);

  const dt = DateTime.fromSQL(payment.paymentDate).toJSDate();
  return (
    <tr className={className}>
      <td className="">
        <Datepicker
          id={`payment-${payment.id}`}
          name={`payment-${payment.id}`}
          value={dt}
          onChange={(d) => {
            const dt = d && DateTime.fromJSDate(d);
            if (dt?.isValid) {
              update({
                ...payment,
                paymentDate: dt.toSQLDate(),
              });
            }
          }}
        />
      </td>
      <td className="">
        <Select
          id={`payment-transactionType-${payment.id}`}
          name={`payment-transactionType-${payment.id}`}
        >
          <option value="">Select transaction Type</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </Select>
      </td>
      <td className="">
        <TextInput
          id={`payment-amount-${payment.id}`}
          name={`payment-amount-${payment.id}`}
          type="numeric"
          placeholder="Amount"
        />
      </td>
      <td className="">
        <UserSelector
          data={payment.referencePersonId ? payment.referencePersonId : null}
          update={(data) => {
            update(
              data
                ? {
                    ...payment,
                    referencePersonId: data,
                  }
                : {
                    ...payment,
                    referencePersonId: "",
                  },
            );
          }}
        />
      </td>
      <td className="">
        <Select
          id={`payment-paymentType-${payment.id}`}
          name={`payment-paymentType-${payment.id}`}
        >
          <option value="">Select Payment Type</option>
          <option value="Rent">Rent</option>
          <option value="Security Deposit">Security Deposit</option>
        </Select>
      </td>
      <td className="">
        <Select
          id={`payment-paymentMode-${payment.id}`}
          name={`payment-paymentMode-${payment.id}`}
          onChange={(d) =>
            update({ ...payment, paymentMode: d.target.value as PaymentMode })
          }
        >
          <option value="">Select Payment Mode</option>
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
        </Select>
      </td>
      <td className="">
        {payment.paymentMode === "Online" ? (
          <BankInput
            data={payment}
            update={(b) => update({ ...payment, ...b })}
          />
        ) : null}
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center gap-5">
          <Button
            className="bg-primary-500 aspect-square p-2"
            onClick={() => removePayment(payment.id)}
          >
            <HiMinus className="" />
          </Button>
          {showPlusButton && (
            <Button
              className="bg-primary-500 aspect-square p-2"
              onClick={addPayment}
            >
              <HiPlus />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
