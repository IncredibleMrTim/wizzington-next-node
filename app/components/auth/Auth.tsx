"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/app/stores/auth/useAuthStore";
import { useSession } from "next-auth/react";

const CheckAuth = () => {
  const router = useRouter();

  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const { data: userData } = useSession();
  useEffect(() => {
    async function checkAuth() {
      if (!userData) {
        router.push("/");
      }

      setCurrentUser(userData);
    }

    checkAuth();
  }, [setCurrentUser, userData, router]);

  return null;
};

export default CheckAuth;
