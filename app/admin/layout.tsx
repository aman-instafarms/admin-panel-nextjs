import AdminSidebar from "@/components/Sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-row text-white">
      <AdminSidebar />
      <div className="mt-3 mr-3 w-full">{children}</div>
    </div>
  );
}
