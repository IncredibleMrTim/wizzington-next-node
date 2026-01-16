"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/stores/auth/useAuthStore";
import { AdminGuard } from "@/app/components/adminGuard";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.currentUser?.isAdmin);
  console.log("isAdmin", isAdmin);
  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen mt-12">
        <main className="grow p-4">{children}</main>
      </div>
    </AdminGuard>
  );
};
export default AdminLayout;
