"use client";

import { createUser, editUser } from "@/actions/userActions";
import MyButton from "@/components/MyButton";
import { User } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import { Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface UserEditorProps {
  data?: User;
}

export default function UserEditor(props: UserEditorProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    const formEl = document.getElementById(
      "userForm",
    ) as HTMLFormElement | null;
    if (!formEl) {
      return toast.error("Error");
    }
    const formData = new FormData(formEl);
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editUserWithId = editUser.bind(null, props.data.id);
        promise = parseServerActionResult(editUserWithId(formData));
      } else {
        promise = parseServerActionResult(createUser(formData));
      }

      toast.promise(promise, {
        loading: "Saving User data...",
        success: (data) => {
          if (!props.data) {
            router.push("/admin/users");
          }
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    if (props.data) {
      let el = document.getElementById("firstName") as HTMLInputElement | null;
      if (el) {
        el.value = props.data.firstName || "";
      }
      el = document.getElementById("lastName") as HTMLInputElement | null;
      if (el) {
        el.value = props.data.lastName || "";
      }
      el = document.getElementById("email") as HTMLInputElement | null;
      if (el) {
        el.value = props.data.email || "";
      }
      el = document.getElementById("mobileNumber") as HTMLInputElement | null;
      if (el) {
        el.value = props.data.mobileNumber || "";
      }
      el = document.getElementById("whatsappNumber") as HTMLInputElement | null;
      if (el) {
        el.value = props.data.whatsappNumber || "";
      }
    }
  }, [props.data]);

  return (
    <form className="flex w-full flex-col gap-5" id="userForm">
      <div className="grid w-full grid-cols-2 gap-5">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">User First Name</Label>
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
            <Label htmlFor="email1">User Last Name</Label>
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
            <Label htmlFor="email1">User Email</Label>
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
            <Label htmlFor="email1">User Mobile Number</Label>
          </div>
          <TextInput
            id="mobileNumber"
            name="mobileNumber"
            type="text"
            placeholder="Enter Mobile Number"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">User Whatsapp Number</Label>
          </div>
          <TextInput
            id="whatsappNumber"
            name="whatsappNumber"
            type="text"
            placeholder="Enter Whatsapp Number"
          />
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <MyButton onClick={handleSubmit} loading={loading}>
          Submit
        </MyButton>
      </div>
    </form>
  );
}
