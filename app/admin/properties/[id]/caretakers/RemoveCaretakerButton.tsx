"use client";

import { removeCaretaker } from "@/actions/caretakerActions";
import ConfirmModal from "@/components/ConfirmModal";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface RemoveCaretakerButtonProps {
  userId: string;
  propertyId: string;
}

export default function RemoveCaretakerButton({
  userId,
  propertyId,
}: RemoveCaretakerButtonProps) {
  const [loading, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSubmit = () => {
    startTransition(() => {
      const promise = parseServerActionResult(
        removeCaretaker({ propertyId, caretakerId: userId }),
      );

      toast.promise(promise, {
        loading: "Removing Caretaker...",
        success: (data) => {
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  return (
    <>
      <MyButton
        size="small"
        color="red"
        loading={loading}
        onClick={() => setShowModal(true)}
        className="p-2"
      >
        Remove
      </MyButton>
      <ConfirmModal
        showModal={showModal}
        confirmationText="Are you sure you want REMOVE this user as the caretaker?"
        acceptCallback={handleSubmit}
        closeCallback={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
