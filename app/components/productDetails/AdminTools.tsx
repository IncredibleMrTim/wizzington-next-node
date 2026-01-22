"use client";

import { useSession } from "next-auth/react";
import { USER_ROLE } from "@/lib/types";

export function AdminTools() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === USER_ROLE.ADMIN;

  if (!isAdmin) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3">
      <p className="text-sm text-blue-800">Admin tools available</p>
    </div>
  );
}
