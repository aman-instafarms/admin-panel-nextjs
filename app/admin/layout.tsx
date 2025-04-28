import AdminSidebar from "@/components/Sidebar";
import { isAdmin } from "@/utils/admin-only";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="flex h-full w-full flex-row text-white">
      <AdminSidebar />
      <div className="mt-3 mr-3 w-full">{children}</div>
    </div>
  );
}
