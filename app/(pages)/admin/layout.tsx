"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/stores/auth/useAuthStore";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.currentUser?.isAdmin);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  return (
    <div className="flex flex-col min-h-screen mt-12">
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};
export default AdminLayout;
