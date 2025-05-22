import AdminSidebar from "@/components/Sidebar";
import { isAdmin } from "@/utils/admin-only";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  if (!admin) {
    return (
      <div className="m-10 flex h-full w-full flex-row items-center bg-slate-200 text-center text-black dark:bg-gray-900 dark:text-white">
        <h4 className="mx-auto">This account does not have admin access.</h4>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-row bg-slate-200 dark:bg-gray-900">
      <AdminSidebar />
      <div className="mt-3 mr-3 w-full">{children}</div>
    </div>
  );
}
