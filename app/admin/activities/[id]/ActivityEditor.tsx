"use client";

import { createActivity, editActivity } from "@/actions/activityActions";
import MyButton from "@/components/MyButton";
import { Activity } from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import { Label, TextInput } from "flowbite-react";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface ActivityEditorProps {
  data?: Activity;
}

export default function ActivityEditor(props: ActivityEditorProps) {
  const [loading, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editActivityWithId = editActivity.bind(null, props.data.id);
        promise = parseServerActionResult(editActivityWithId(formData));
      } else {
        promise = parseServerActionResult(createActivity(formData));
      }

      toast.promise(promise, {
        loading: "Saving Activity...",
        success: (data) => {
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    if (props.data) {
      const el = document.getElementById("activity") as HTMLInputElement;
      el.value = props.data.activity;
    }
  }, [props.data]);

  return (
    <form
      action={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">Activity Name</Label>
        </div>
        <TextInput
          id="activity"
          name="activity"
          type="text"
          placeholder="Enter activity"
          required
        />
      </div>
      <MyButton type="submit" loading={loading}>
        Submit
      </MyButton>
    </form>
  );
}
