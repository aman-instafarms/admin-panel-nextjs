"use client";

import { createState, editState } from "@/actions/stateActions";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

interface StateEditorProps {
  data?: {
    id: string;
    state: string;
  };
}

export default function StateEditor(props: StateEditorProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      let promise: Promise<string>;

      if (props.data) {
        const editStateWithId = editState.bind(null, props.data.id);
        promise = parseServerActionResult(editStateWithId(formData));
      } else {
        promise = parseServerActionResult(createState(formData));
      }

      toast.promise(promise, {
        loading: "Saving State...",
        success: (data) => {
          router.push("/admin/states");
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    if (props.data) {
      const el = document.getElementById("state") as HTMLInputElement;
      el.value = props.data.state;
    }
  }, [props.data]);

  return (
    <form
      action={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">State Name</Label>
        </div>
        <TextInput
          id="state"
          name="state"
          type="text"
          placeholder="Enter State"
          required
        />
      </div>
      <MyButton type="submit" loading={loading}>
        Submit
      </MyButton>
    </form>
  );
}
