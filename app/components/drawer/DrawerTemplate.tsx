"use client";
import { useNavStore } from "@/stores";
import Link from "next/link";
import { Avatar } from "radix-ui";
import { Separator } from "../separator/Separator";
import adminComponents from "../navigation/adminComponents";
import userComponents from "../navigation/userComponents";
import { FiChevronsRight } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { USER_ROLE } from "@/lib/types";

interface DrawerTemplateProps {
  type?: USER_ROLE;
}

export const DrawerTemplate = ({ type }: DrawerTemplateProps) => {
  const { data: session } = useSession();
  const components = type === USER_ROLE.USER ? adminComponents : userComponents;
  const setIsDrawerOpen = useNavStore((state) => state.setIsDrawerOpen);

  return (
    <div className="bg-white h-full w-full rounded-md bg-gradient-to-tr from-gray-300 from-20% to-transparent to-100%">
      <div className="w-full flex justify-end p-2 mb-4 pt-6 pr-6">
        <img src="/wizz-logo-trans-v2-flare-stroke.webp" className="w-3/8" />
        <div className="fixed top-0 left-0 p-2">
          <FiChevronsRight
            size={24}
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              setIsDrawerOpen(false);
            }}
          />
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

      {session?.user && (
        <>
          <div className="flex flex-col w-full fixed bottom-0 left-0 text-lg text-gray-100 p-4 items-center gap-2">
            <Separator />
            <div className="flex w-full items-center">
              <Avatar.Root>
                <Avatar.Image src={session.user.image || undefined} />
                <Avatar.Fallback className="bg-blue-500 text-white p-2 rounded-full">
                  {session.user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?"}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="flex flex-col ml-2">
                <span className="text-gray-800 text-sm font-semibold">
                  {session.user.name}
                </span>
                <span className="text-gray-600 text-xs">
                  {session.user.email}
                </span>
              </div>
            </div>
            {type === USER_ROLE.USER && (
              <Link
                href="/admin"
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
                className="text-gray-800 text-sm w-full text-center mt-2"
              >
                Admin Portal
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};
