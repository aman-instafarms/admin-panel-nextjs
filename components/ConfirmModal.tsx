"use client";

import { HiOutlineExclamationCircle } from "react-icons/hi";
import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";

interface ConfirmModalProps {
  showModal: boolean;
  confirmationText: React.ReactNode;
  acceptCallback: () => void;
  closeCallback: () => void;
}

export default function ConfirmModal({
  showModal,
  confirmationText,
  acceptCallback,
  closeCallback,
}: ConfirmModalProps) {
  return (
    <Modal show={showModal} size="md" onClose={closeCallback} popup>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {confirmationText}
          </h3>
          <div className="flex justify-center gap-4">
            <Button onClick={acceptCallback}>Continue</Button>
            <Button color="red" onClick={closeCallback}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
