"use client";

import { createCustomer, editCustomer } from "@/actions/customerActions";
import MyButton from "@/components/MyButton";
import { CustomerData } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import { Datepicker, Label, Select, TextInput } from "flowbite-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface CustomerEditorProps {
  data?: CustomerData;
}

export default function CustomerEditor(props: CustomerEditorProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [dob, setDob] = useState<Date | null>(new Date());

  const handleSubmit = () => {
    const formEl = document.getElementById(
      "customerForm",
    ) as HTMLFormElement | null;
    if (!formEl) {
      return toast.error("Error");
    }
    const formData = new FormData(formEl);
    const dobDt = dob && DateTime.fromJSDate(dob);
    if (dobDt?.isValid) {
      formData.set("dob", dobDt.toSQLDate());
    } else {
      formData.delete("dob");
    }
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editCustomerWithId = editCustomer.bind(null, props.data.id);
        promise = parseServerActionResult(editCustomerWithId(formData));
      } else {
        promise = parseServerActionResult(createCustomer(formData));
      }

      toast.promise(promise, {
        loading: "Saving Customer data...",
        success: (data) => {
          router.push("/admin/customers");
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    if (props.data) {
      let el = document.getElementById("firstName") as HTMLInputElement;
      el.value = props.data.firstName;
      el = document.getElementById("lastName") as HTMLInputElement;
      el.value = props.data.lastName || "";
      el = document.getElementById("email") as HTMLInputElement;
      el.value = props.data.email || "";
      el = document.getElementById("mobileNumber") as HTMLInputElement;
      el.value = props.data.mobileNumber || "";
      console.log(props.data.dob);
      setDob(DateTime.fromSQL(props.data.dob).toJSDate());

      const selectEl = document.getElementById("gender") as HTMLSelectElement;
      selectEl.value = props.data.gender || "";
    }
  }, [props.data]);

  return (
    <form className="flex w-full flex-col gap-5" id="customerForm">
      <div className="grid w-full grid-cols-2 gap-5">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Customer First Name</Label>
          </div>
          <TextInput
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter First Name"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Customer Last Name</Label>
          </div>
          <TextInput
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter Last Name"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Customer Email</Label>
          </div>
          <TextInput
            id="email"
            name="email"
            type="text"
            placeholder="Enter email"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Customer Gender</Label>
          </div>
          <Select id="gender" name="gender" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Customer Mobile Number</Label>
          </div>
          <TextInput
            id="mobileNumber"
            name="mobileNumber"
            type="text"
            placeholder="Enter Mobile Number"
          />
        </div>
        <div className="relative z-50 overflow-y-visible">
          <div className="mb-2 block">
            <Label htmlFor="">Customer Date of Birth</Label>
          </div>
          <Datepicker
            id="dob"
            name="dob"
            value={dob}
            onChange={setDob}
            className="relative z-50"
            required
          />
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <MyButton loading={loading} onClick={handleSubmit}>
          Submit
        </MyButton>
      </div>
    </form>
  );
}
