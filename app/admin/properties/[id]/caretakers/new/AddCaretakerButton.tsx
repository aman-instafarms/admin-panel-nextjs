"use client";

import { addCaretaker } from "@/actions/caretakerActions";
import ConfirmModal from "@/components/ConfirmModal";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface AddCaretakerButtonProps {
  userId: string;
  propertyId: string;
}

export default function AddCaretakerButton({
  userId,
  propertyId,
}: AddCaretakerButtonProps) {
  const [loading, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSubmit = () => {
    startTransition(() => {
      const promise = parseServerActionResult(
        addCaretaker({ propertyId, caretakerId: userId }),
      );

      toast.promise(promise, {
        loading: "Adding Caretaker...",
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
        loading={loading}
        onClick={() => setShowModal(true)}
        className="p-2"
      >
        Add Caretaker
      </MyButton>
      <ConfirmModal
        showModal={showModal}
        confirmationText="Are you sure you want ADD this user as the caretaker?"
        acceptCallback={handleSubmit}
        closeCallback={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
