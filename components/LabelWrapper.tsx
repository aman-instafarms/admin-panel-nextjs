"use client";

import React from "react";
import { Label } from "flowbite-react";

interface LabelWrapperProps {
  label: string;
  children: React.ReactNode;
}

export default function LabelWrapper({ label, children }: LabelWrapperProps) {
  return (
    <div>
      <div className="mb-2 block">
        <Label>{label}</Label>
      </div>
      {children}
    </div>
  );
}
