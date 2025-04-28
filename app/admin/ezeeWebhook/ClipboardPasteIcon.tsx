"use client";

import toast from "react-hot-toast";
import { HiClipboardList } from "react-icons/hi";

interface ClipboardPasteIconProps {
  text: string;
}

export default function ClipboardPasteIcon(props: ClipboardPasteIconProps) {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      toast.success("Copied");
    } catch (err) {
      toast.error("Failed to copy: ");
      console.log(err);
    }
  };

  return (
    <div className="rounded-md bg-blue-600 p-1" onClick={handleClick}>
      <HiClipboardList size={20} className="text-white" />
    </div>
  );
}
