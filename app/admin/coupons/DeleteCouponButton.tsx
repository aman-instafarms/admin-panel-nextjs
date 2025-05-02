"use client";

import { deleteCouponWithProperties } from "@/actions/couponActions";
import ConfirmModal from "@/components/ConfirmModal";
import { Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { HiTrash } from "react-icons/hi";

export default function DeleteCouponButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCouponWithProperties(id);

        if (result?.success) {
          toast.success("Coupon deleted successfully.");
          router.refresh();
        } else {
          toast.error("Failed to delete coupon.");
        }
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setShowModal(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-fit cursor-pointer"
      >
        <div className="rounded-md bg-red-600 p-1">
          {isPending ? (
            <Spinner size="sm" className="me-3" light />
          ) : (
            <HiTrash size={20} className="text-white" />
          )}
        </div>
      </button>

      <ConfirmModal
        showModal={showModal}
        confirmationText="Are you sure you want to remove this coupon?"
        acceptCallback={handleDelete}
        closeCallback={() => setShowModal(false)}
      />
    </>
  );
}
