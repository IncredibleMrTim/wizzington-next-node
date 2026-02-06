"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { AuthUserMenu } from "../auth/authUserMenu/AuthUserMenu";
import userComponents from "./userComponents";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { FiPlus } from "react-icons/fi";
import { CgShoppingCart } from "react-icons/cg";
import { useSession } from "next-auth/react";
import { USER_ROLE } from "@/lib/types";

export type NavComponent = {
  id: string;
  type: "button" | "link";
  title: string;
  href: string;
  content?: string | React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

// used to render the navigation bar
// it will render a list of components based on the type
// if the type is "user", it will render the user components
// if the type is "admin", it will render the admin components
interface NavigationProps {
  type?: USER_ROLE;
}

const Navigation = ({ type = USER_ROLE.USER }: NavigationProps) => {
  const [selected, setSelected] = useState<NavComponent | null>(null);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const components = userComponents;
  const router = useRouter();
  const { data: userData } = useSession();

  // Get initials from firstName/lastName or fallback to name
  const getInitials = useCallback(() => {
    if (userData?.user?.firstName && userData?.user?.lastName) {
      return `${userData.user.firstName[0]}${userData.user.lastName[0]}`.toUpperCase();
    }
    if (userData?.user?.name) {
      const parts = userData.user.name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return parts[0][0]?.toUpperCase() || "?";
    }
    return "?";
  }, [userData]);

  const handleAdminMenuItemClick = useCallback(() => {
    setAdminMenuOpen(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSelected(null);
  }, []);

  const handleMouseEnter = useCallback((component: NavComponent) => {
    setSelected(component);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, href: string) => {
      e.preventDefault();
      router.push(href);
    },
    [router],
  );

  return (
    <div>
      <div
        className={`w-full bg-white box-border z-1 absolute shadow-md
         ${selected && "h-auto"} `}
        onMouseLeave={handleMouseLeave}
      >
        <ul className="flex gap-4 bg-white">
          {components &&
            components.map((component) => (
              <li
                className={`${
                  type === USER_ROLE.USER ? "first:ml-4 h-10" : ""
                }  ${
                  selected?.id === component.id
                    ? "border-b-2 border-gray-400"
                    : ""
                }`}
                key={component.id}
              >
                {component.type === "link" ? (
                  <div
                    className={`flex cursor-pointer py-2 h-11 min-w-[100px] justify-center items-center`}
                    onMouseEnter={() => handleMouseEnter(component)}
                    onClick={(e) =>
                      component.href && handleClick(e, component.href)
                    }
                  >
                    {component.title}
                  </div>
                ) : (
                  <Link href={component.href} prefetch>
                    <Button className="px-2 py-2">
                      <FiPlus /> {component.title}
                    </Button>
                  </Link>
                )}
              </li>
            ))}
        </ul>
        <div className="flex absolute top-0 right-0 h-11 mr-4 items-center gap-2">
          <Link
            href="/basket"
            className="flex items-center rounded-full  p-2 -mt-1 bg-pink-100"
          >
            <CgShoppingCart size={18} />
          </Link>

          {userData?.user ? (
            <Popover onOpenChange={setAdminMenuOpen} open={adminMenuOpen}>
              <PopoverTrigger className="cursor-pointer">
                <div className="flex justify-center items-center relative -mt-1 w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 bg-pink-200">
                  {userData?.user?.image ? (
                    <Image
                      src={userData.user.image}
                      alt={userData.user.name || "User avatar"}
                      fill
                    />
                  ) : (
                    <div className="flex justify-center items-center mt-1 w-full h-full">
                      {getInitials()}
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="mr-4 mt-1 bg-white rounded-sm border-gray-200!">
                <PopoverClose asChild>
                  <AuthUserMenu
                    onMenuItemClick={handleAdminMenuItemClick}
                    role={type}
                  />
                </PopoverClose>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/auth/signin">Login</Link>
          )}
        </div>
        <div
          className={`overflow-hidden bg-white z-1! ${
            selected?.content ? "fade-in-scale border-t border-gray-100" : ""
          }`}
        >
          {selected?.content}
        </div>
      </div>
    </div>
  );
};

export default memo(Navigation);
