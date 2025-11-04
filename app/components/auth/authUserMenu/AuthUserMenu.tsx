"use client";

// import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";

import { signOut } from "next-auth/react";

import { FiLogOut, FiHome, FiSettings } from "react-icons/fi";
import Link from "next/link";

export const AuthUserMenu = ({
  onMenuItemClick,
}: {
  onMenuItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const router = useRouter();

  // States
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Selectors

  /* * Handle user sign out
   * This function handles the sign out process, clears the cache for tokens,
   * and updates the Redux store to set the current user to null.
   * The user will be redirected to the home page after signing out.
   */
  const handleSignOut = async () => {
    try {
      signOut();

      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p>
        Welcome {currentUser?.firstName} {currentUser?.lastName}
      </p>
      <ul className="flex flex-col gap-2 mt-4">
        <li className="flex gap-4">
          <FiHome size={22} className="text-gray-400" />

          <Link
            prefetch
            href="/"
            className="!text-black"
            onClick={onMenuItemClick}
          >
            Home Page
          </Link>
        </li>

        <li className="flex gap-4">
          <FiSettings size={22} className="text-gray-400" />

          <Link
            prefetch
            href="/admin"
            className="!text-black"
            onClick={onMenuItemClick}
          >
            Admin
          </Link>
        </li>

        <li className="flex gap-4">
          <FiLogOut size={22} className="text-gray-400" />
          <Link
            prefetch
            onClick={(e) => {
              handleSignOut();
              onMenuItemClick(e);
            }}
            href="/"
            className="!text-black"
          >
            {isSigningOut ? "Signing out..." : "Logout"}
          </Link>
        </li>
      </ul>
    </div>
  );
};
