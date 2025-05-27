"use client";

import { createAdmin, editAdmin } from "@/actions/adminActions";
import MyButton from "@/components/MyButton";
import { Admin } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import { Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface AdminEditorProps {
  data?: Admin;
}

export default function AdminEditor(props: AdminEditorProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    const formEl = document.getElementById(
      "adminForm",
    ) as HTMLFormElement | null;
    if (!formEl) {
      return toast.error("Error");
    }
    const formData = new FormData(formEl);
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editAdminWithId = editAdmin.bind(null, props.data.id);
        promise = parseServerActionResult(editAdminWithId(formData));
      } else {
        promise = parseServerActionResult(createAdmin(formData));
      }

      toast.promise(promise, {
        loading: "Saving Admin data...",
        success: (data) => {
          if (!props.data) {
            router.push("/admin/admins");
          }
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
      el.value = props.data.email;
      el = document.getElementById("phoneNumber") as HTMLInputElement;
      el.value = props.data.phoneNumber || "";
    }
  }, [props.data]);

  return (
    <form
      id="adminForm"
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">Admin First Name</Label>
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
          <Label htmlFor="email1">Admin Last Name</Label>
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
          <Label htmlFor="email1">Admin Email</Label>
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
          <Label htmlFor="email1">Admin Phone Number</Label>
        </div>
        <TextInput
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          placeholder="Enter Phone Number"
        />
      </div>
      <MyButton loading={loading} onClick={handleSubmit}>
        Submit
      </MyButton>
    </form>
  );
}
