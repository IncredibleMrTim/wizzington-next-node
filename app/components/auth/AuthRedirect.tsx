"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Redirects users after login:
 * - Admins to /admin
 * - Non-admins to /
 * Only redirects once per session
 */
export function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log("🔄 [AuthRedirect] Status:", status, "Role:", session?.user?.role, "HasRedirected:", hasRedirected.current);

    // Only redirect once per component lifecycle
    if (status === "authenticated" && session?.user && !hasRedirected.current) {
      hasRedirected.current = true;
      
      console.log("✅ [AuthRedirect] Redirecting user with role:", session.user.role);

      if (session.user.role === "ADMIN") {
        console.log("➡️ [AuthRedirect] Pushing to /admin");
        router.push("/admin");
      } else {
        console.log("➡️ [AuthRedirect] Pushing to /");
        router.push("/");
      }
    }
  }, [session, status, router]);

  return null;
}
