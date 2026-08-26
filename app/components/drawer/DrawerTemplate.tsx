"use client";
import { useNavStore } from "@/stores";
import Link from "next/link";
import Image from "next/image";
import { CgShoppingCart } from "react-icons/cg";
import { FiChevronsRight } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import { USER_ROLE } from "@/lib/types";
import { CategoryWithChildren } from "@/app/actions/categories.action";
import { useState } from "react";

interface DrawerTemplateProps {
  categories: CategoryWithChildren[];
  type?: USER_ROLE;
}

export const DrawerTemplate = ({ categories }: DrawerTemplateProps) => {
  const { data: session } = useSession();
  const navLinks = [
    { id: "home", title: "Home", href: "/" },
    ...categories.map((c) => ({
      id: c.id,
      title: c.name,
      href: `/category/${c.id}`,
    })),
  ];
  const setIsDrawerOpen = useNavStore((state) => state.setIsDrawerOpen);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-full w-full text-center flex flex-col"
      style={{ backgroundColor: "var(--color-brand-plum)" }}
    >
      <div className="w-full flex justify-end">
        <div
          className="static w-full flex flex-col gap-4 top-0 left-0 p-4 border-b"
          style={{ borderColor: "rgba(201,132,154,0.15)" }}
        >
          <FiChevronsRight
            size={24}
            className="cursor-pointer self-end"
            style={{ color: "var(--color-brand-gold)" }}
            onClick={() => {
              setIsDrawerOpen(false);
            }}
          />
          <div>
            <div
              className="pl-1 text-lg"
              style={{ color: "var(--color-brand-cream)" }}
            >
              {`Welcome to Wizzington Moo's UK`}
            </div>
            <div
              className="font-thin! italic text-sm"
              style={{ color: "rgba(245,237,232,0.6)" }}
            >
              Costumes that transform every performance
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 w-full grow overflow-y-auto">
        <ul className="w-full">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className="py-4 w-full h-full border-b"
              style={{ borderColor: "rgba(201,132,154,0.15)" }}
            >
              <Link
                href={link.href}
                className="flex text-sm w-full place-items-center justify-center uppercase tracking-[0.08em] hover:text-brand-gold transition-colors"
                style={{ color: "var(--color-brand-rose)" }}
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                {link.title}
              </Link>
            </li>
          ))}
          <li
            className="py-4 w-full h-full border-b"
            style={{ borderColor: "rgba(201,132,154,0.15)" }}
          >
            <Link
              href="/basket"
              className="flex items-center gap-2 text-sm w-full place-items-center justify-center uppercase tracking-[0.08em] hover:text-brand-gold transition-colors"
              style={{ color: "var(--color-brand-gold)" }}
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <CgShoppingCart size={16} />
              Basket
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col w-full items-center gap-4 pb-4">
        <Image
          src="/logo.webp"
          alt="Logo"
          width={150}
          height={150}
          className="w-4/8 h-auto"
        />

        {session?.user ? (
          <div
            className="w-full p-4 border-t"
            style={{ borderColor: "rgba(201,132,154,0.15)" }}
          >
            <div className="flex flex-row w-full justify-between">
              {session.user.role === USER_ROLE.ADMIN && (
                <Link
                  href="/admin"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex justify-center text-sm w-full text-center mt-2 hover:text-brand-gold transition-colors"
                  style={{ color: "var(--color-brand-cream)" }}
                >
                  Admin Portal
                </Link>
              )}
              <Link
                onClick={() => signOut()}
                href=""
                className="flex justify-center text-sm w-full text-center mt-2 lg:hidden hover:text-brand-gold transition-colors"
                style={{ color: "var(--color-brand-cream)" }}
              >
                Logout
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center w-full p-4 border-t"
            style={{ borderColor: "rgba(201,132,154,0.15)" }}
          >
            <Link
              href=""
              onClick={handleGoogleSignIn}
              className="font-normal! rounded-full px-6 py-2 text-sm"
              style={{
                backgroundColor: "var(--color-brand-gold)",
                color: "var(--color-brand-plum)",
              }}
            >
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
