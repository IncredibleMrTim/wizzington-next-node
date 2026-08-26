"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useCallback, memo } from "react"
import { AuthUserMenu } from "../auth/authUserMenu/AuthUserMenu"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { CgShoppingCart } from "react-icons/cg"
import { useSession } from "next-auth/react"
import { USER_ROLE } from "@/lib/types"
import { MenuItem } from "./userComponents"

export type NavComponent = {
  id: string
  type: "button" | "link"
  title: string
  href: string
  content?: string | React.ReactNode
  menuItems?: MenuItem[]
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

// used to render the navigation bar
// it will render a list of components based on the type
// if the type is "user", it will render the user components
// if the type is "admin", it will render the admin components
interface NavUserButtonsProps {
  type?: USER_ROLE
}

const NavUserButtons = ({ type = USER_ROLE.USER }: NavUserButtonsProps) => {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)

  const { data: userData } = useSession()

  // Get initials from firstName/lastName or fallback to name
  const getInitials = useCallback(() => {
    if (userData?.user?.firstName && userData?.user?.lastName) {
      return `${userData.user.firstName[0]}${userData.user.lastName[0]}`.toUpperCase()
    }
    if (userData?.user?.name) {
      const parts = userData.user.name.split(" ")
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return parts[0][0]?.toUpperCase() || "?"
    }
    return "?"
  }, [userData])

  const handleAdminMenuItemClick = useCallback(() => {
    setAdminMenuOpen(false)
  }, [])

  return (
    <div className="box-border z-1 relative">
      <div className="flex absolute right-2 items-center gap-2 ">
        <Link
          href="/basket"
          className="flex items-center rounded-full p-2 -mt-1 border border-[rgba(201,132,154,0.35)] text-brand-gold hover:border-brand-gold transition-colors"
        >
          <CgShoppingCart size={18} />
        </Link>

        {userData?.user ? (
          <Popover onOpenChange={setAdminMenuOpen} open={adminMenuOpen}>
            <PopoverTrigger className="cursor-pointer">
              <div className="flex justify-center items-center relative -mt-1 w-9 h-9 rounded-full overflow-hidden border-2 border-brand-gold bg-brand-plum-light text-brand-cream">
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
            <PopoverContent className="mr-4 mt-1 bg-brand-plum-mid text-brand-cream rounded-sm border-[rgba(201,132,154,0.25)]!">
              <PopoverClose asChild>
                <AuthUserMenu
                  onMenuItemClick={handleAdminMenuItemClick}
                  role={type}
                />
              </PopoverClose>
            </PopoverContent>
          </Popover>
        ) : (
          <Link
            href="/auth/signin"
            className="text-brand-cream text-sm hover:text-brand-gold transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default memo(NavUserButtons)
