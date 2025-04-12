"use client";

import { addManager } from "@/actions/managerActions";
import ConfirmModal from "@/components/ConfirmModal";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface AddManagerButtonProps {
  userId: string;
  propertyId: string;
}

export default function AddManagerButton({
  userId,
  propertyId,
}: AddManagerButtonProps) {
  const [loading, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSubmit = () => {
    startTransition(() => {
      const promise = parseServerActionResult(
        addManager({ propertyId, managerId: userId }),
      );

      toast.promise(promise, {
        loading: "Adding Manager...",
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
        Add Manager
      </MyButton>
      <ConfirmModal
        showModal={showModal}
        confirmationText="Are you sure you want ADD this user as the manager?"
        acceptCallback={handleSubmit}
        closeCallback={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
