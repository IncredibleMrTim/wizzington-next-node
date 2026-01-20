"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { USER_ROLE } from "@/lib/types";
import { FiLogOut, FiHome, FiSettings } from "react-icons/fi";
import Link from "next/link";

export const AuthUserMenu = ({
  onMenuItemClick,
  role,
}: {
  onMenuItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  role: USER_ROLE;
}) => {
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p>
        Welcome {session?.user?.firstName} {session?.user?.lastName}
      </p>
      <ul className="flex flex-col gap-2 mt-4">
        <li className="flex gap-4">
          <FiHome size={22} className="text-gray-400" />

          <Link
            prefetch
            href="/"
            className="text-black!"
            onClick={onMenuItemClick}
          >
            Home Page
          </Link>
        </li>

        {role === USER_ROLE.ADMIN && (
          <li className="flex gap-4">
            <FiSettings size={22} className="text-gray-400" />

            <Link
              prefetch
              href="/admin"
              className="text-black"
              onClick={onMenuItemClick}
            >
              Admin
            </Link>
          </li>
        )}

        <li className="flex gap-4">
          <FiLogOut size={22} className="text-gray-400" />
          <button
            onClick={async (e) => {
              e.preventDefault();
              await handleSignOut();
              onMenuItemClick(e as any);
            }}
            className="text-black flex gap-4"
          >
            {isSigningOut ? "Signing out..." : "Logout"}
          </button>
        </li>
      </ul>
    </div>
  );
};
