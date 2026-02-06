"use client";
import { useNavStore } from "@/stores";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../separator/Separator";
import userComponents from "../navigation/userComponents";
import { FiChevronsRight } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import { USER_ROLE } from "@/lib/types";
import { useState } from "react";

export const DrawerTemplate = () => {
  const { data: session } = useSession();
  const components = userComponents;
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
    <div className="bg-white h-full w-full rounded-md bg-gradient-to-tr from-gray-300 from-20% to-transparent to-100%">
      <div className="w-full flex justify-end  mb-4 ">
        <div className="static w-full flex flex-col  gap-4 top-0 left-0 p-2 bg-gradient-to-r from-transparent/0 via-gray-300/100  to-transparent/0 ">
          <FiChevronsRight
            size={24}
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              setIsDrawerOpen(false);
            }}
          />
          <div>
            <div className="pl-1 text-lg text-center">
              {`Welcome to Wizzington Moo's UK`}
            </div>
            <p className="font-thin! text-center italic">
              Costumes that transform every performance
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 w-full">
        <ul className="w-full">
          {components &&
            components.map((component, i) => (
              <div key={i} className="w-full">
                <li key={component.id} className="py-4 w-full h-full">
                  <Link
                    href={component.href}
                    className="flex text-lg text-gray-700 w-full place-items-center"
                    onClick={() => {
                      setIsDrawerOpen(false);
                    }}
                  >
                    {component.title}
                  </Link>
                </li>
                <Separator />
              </div>
            ))}
        </ul>
      </div>
      <div className="flex flex-col w-full fixed bottom-0 left-0 items-center gap-4">
        <Image
          src="/logo.webp"
          alt="Logo"
          width={150}
          height={150}
          className="w-4/8 h-auto "
        />

        {session?.user ? (
          <div className="w-full p-4 bg-gradient-to-r from-transparent/0 via-gray-300/100  to-transparent/0 ">
            <div className="flex flex-row w-full justify-between">
              {session.user.role === USER_ROLE.ADMIN && (
                <Link
                  href="/admin"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex justify-center text-gray-800 text-sm w-full text-center mt-2"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                onClick={() => signOut()}
                href=""
                className="flex justify-center text-gray-800 text-sm w-full text-center mt-2 lg:hidden"
              >
                Logout
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full p-4 bg-gradient-to-r from-transparent via-gray-400/25  to-transparent ">
            <Link href="" onClick={handleGoogleSignIn} className="font-normal!">
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
