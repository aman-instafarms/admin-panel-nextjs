"use client";

import { addOwner } from "@/actions/ownerActions";
import ConfirmModal from "@/components/ConfirmModal";
import MyButton from "@/components/MyButton";
import { parseServerActionResult } from "@/utils/utils";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface AddOwnerButtonProps {
  userId: string;
  propertyId: string;
}

export default function AddOwnerButton({
  userId,
  propertyId,
}: AddOwnerButtonProps) {
  const [loading, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSubmit = () => {
    startTransition(() => {
      const promise = parseServerActionResult(
        addOwner({ propertyId, ownerId: userId }),
      );

      toast.promise(promise, {
        loading: "Adding Owner...",
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
        Add Owner
      </MyButton>
      <ConfirmModal
        showModal={showModal}
        confirmationText="Are you sure you want ADD this user as the owner?"
        acceptCallback={handleSubmit}
        closeCallback={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
