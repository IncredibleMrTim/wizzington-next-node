"use client";

import { USER_ROLE } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status !== "loading" &&
      (!session || session.user?.role !== USER_ROLE.ADMIN)
    ) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user?.role !== USER_ROLE.ADMIN) {
    return null;
  }

  return <>{children}</>;
}
