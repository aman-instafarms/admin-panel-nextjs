"use client";

import { BankDetail } from "@/utils/types";
import { Card, Popover, TextInput } from "flowbite-react";
import LabelWrapper from "./LabelWrapper";
import { useEffect } from "react";

interface BankInputProps {
  data: BankDetail;
  update: (data: BankDetail) => void;
}

export default function BankInput({ data, update }: BankInputProps) {
  const bankStr =
    data.bankName &&
    data.bankAccountNumber &&
    data.bankAccountNumber.length >= 4
      ? `${data.bankName} - ${data.bankAccountNumber.substring(data.bankAccountNumber.length - 4)}`
      : "";

  useEffect(() => {
    const el = document.getElementById(
      `bankName-${data.id}`,
    ) as HTMLInputElement | null;
    if (el) {
      el.value = data.bankName || "";
    }
    const el2 = document.getElementById(
      `bankAccountNumber-${data.id}`,
    ) as HTMLInputElement | null;
    if (el2) {
      el2.value = data.bankAccountNumber || "";
    }
    const el3 = document.getElementById(
      `bankAccountHolderName-${data.id}`,
    ) as HTMLInputElement | null;
    if (el3) {
      el3.value = data.bankAccountHolderName || "";
    }
    const el4 = document.getElementById(
      `bankIfsc-${data.id}`,
    ) as HTMLInputElement | null;
    if (el4) {
      el4.value = data.bankIfsc || "";
    }
  }, []);

  return (
    <Popover
      content={
        <Card className="m-0 min-w-lg">
          <h4 className="font-bold">Edit Bank Details</h4>
          <div className="flex flex-col gap-2">
            <LabelWrapper label="Bank Name">
              <TextInput
                id={`bankName-${data.id}`}
                name={`bankName-${data.id}`}
                value={data.bankName || ""}
                onChange={(d) => update({ ...data, bankName: d.target.value })}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Account Number">
              <TextInput
                id={`bankAccountNumber-${data.id}`}
                name={`bankAccountNumber-${data.id}`}
                value={data.bankAccountNumber || ""}
                onChange={(d) =>
                  update({ ...data, bankAccountNumber: d.target.value })
                }
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Account Holder Name">
              <TextInput
                id={`bankAccountHolderName-${data.id}`}
                name={`bankAccountHolderName-${data.id}`}
                value={data.bankAccountHolderName || ""}
                onChange={(d) =>
                  update({ ...data, bankAccountHolderName: d.target.value })
                }
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Bank IFSC">
              <TextInput
                id={`bankIfsc-${data.id}`}
                name={`bankIfsc-${data.id}`}
                value={data.bankIfsc || ""}
                onChange={(d) => update({ ...data, bankIfsc: d.target.value })}
              ></TextInput>
            </LabelWrapper>
            <LabelWrapper label="Account Nickname">
              <TextInput
                id={`bankNickname-${data.id}`}
                name={`bankNickname-${data.id}`}
                value={data.bankNickname || ""}
                onChange={(d) =>
                  update({ ...data, bankNickname: d.target.value })
                }
              ></TextInput>
            </LabelWrapper>
          </div>
        </Card>
      }
    >
      <TextInput
        value={bankStr}
        placeholder="Enter bank details"
        readOnly
      ></TextInput>
    </Popover>
  );
}
