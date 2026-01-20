"use client";

import { AdminGuard } from "@/app/components/adminGuard";
import adminComponents from "@/components/navigation/adminComponents";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { FiPlus } from "react-icons/fi";

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
