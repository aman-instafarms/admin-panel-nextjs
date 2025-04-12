"use client";

import { removeOwner } from "@/actions/ownerActions";
import ConfirmModal from "@/components/ConfirmModal";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface RemoveOwnerButtonProps {
  userId: string;
  propertyId: string;
}

export default function RemoveOwnerButton({
  userId,
  propertyId,
}: RemoveOwnerButtonProps) {
  const [loading, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSubmit = () => {
    startTransition(() => {
      const promise = parseServerActionResult(
        removeOwner({ propertyId, ownerId: userId }),
      );

      toast.promise(promise, {
        loading: "Removing Owner...",
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
        confirmationText="Are you sure you want REMOVE this user as the owner?"
        acceptCallback={handleSubmit}
        closeCallback={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
