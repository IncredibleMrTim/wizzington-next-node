"use client";

import { AdminGuard } from "@/app/components/adminGuard";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen mt-12">
        <main className="grow p-4">{children}</main>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;
