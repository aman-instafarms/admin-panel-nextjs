import AdminSidebar from "@/components/Sidebar";
import { isAdmin } from "@/utils/admin-only";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let err: string = "";
  const admin = await isAdmin().catch((error) => {
    if (error instanceof Error) {
      err = error.message;
    }
  });

  if (!admin) {
    console.log(err);
    return (
      <div className="m-10 flex h-full w-full flex-row items-center bg-slate-200 text-center text-black dark:bg-gray-900 dark:text-white">
        <h4 className="mx-auto">
          {err || "This account does not have admin access."}
        </h4>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-row bg-slate-200 dark:bg-gray-900">
      <AdminSidebar />
      <div className="mt-3 mr-3 min-w-0 flex-1">{children}</div>
    </div>
  );
}
