"use client";

import { createUser, editUser } from "@/actions/userActions";
import MyButton from "@/components/MyButton";
import { UserData } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import { Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface UserEditorProps {
  data?: UserData;
}

export default function UserEditor(props: UserEditorProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
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
          router.push("/admin/users");
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
      el = document.getElementById("mobileNumber") as HTMLInputElement;
      el.value = props.data.mobileNumber || "";
      el = document.getElementById("whatsappNumber") as HTMLInputElement;
      el.value = props.data.whatsappNumber || "";

      const selectEl = document.getElementById("role") as HTMLSelectElement;
      selectEl.value = props.data.role || "";
    }
  }, [props.data]);

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
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
            <Label htmlFor="email1">User Role</Label>
          </div>
          <Select id="role" name="role" required>
            <option value="">Select Role</option>
            <option value="Owner">Owner</option>
            <option value="Manager">Manager</option>
            <option value="Caretaker">Caretaker</option>
          </Select>
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
        <MyButton type="submit" loading={loading}>
          Submit
        </MyButton>
      </div>
    </form>
  );
}
