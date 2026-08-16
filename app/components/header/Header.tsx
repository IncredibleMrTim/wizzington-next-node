import NavUserButtons from "@/components/navigation/NavUserButtons"
import { Drawer } from "../drawer/Drawer"
import { NavServer } from "../navigation/NavServer"
import { HeaderClient } from "./HeaderClient"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getCategories } from "@/app/actions/categories.action"

const Header = async () => {
  const session = await getServerSession(authOptions)
  const categories = await getCategories()

  return (
    <header className="wm-scope sticky z-50 top-0 backdrop-blur-md">
      {/* Background image (mobile only) */}
      <div
        className="flex md:hidden absolute items-end w-full h-50 md:h-auto bg-cover bg-no-repeat bg-blend-multiply bg-[color:rgba(26,15,30,0.75)] md:bg-(--wm-plum-mid)"
        style={{
          backgroundImage: "url('/header-model.jpg')",
          backgroundPosition: "30%",
        }}
      ></div>
      {/* Content */}
      <div className="relative w-full flex justify-center md:justify-center p-4 h-48 md:h-auto md:py-4 bg-(--wm-plum-mid) opacity-85 backdrop-blur-md">
        <HeaderClient />
        <div className="absolute right-2 top-2 md:hidden">
          <Drawer categories={categories} type={session?.user.role} />
        </div>
      </div>

      {/* Navigation + login/basket */}
      <div className="relative hidden w-full md:flex md:items-center md:justify-center bg-(--wm-plum) min-h-14">
        <div className="absolute right-4 top-1/4 -translate-y-1/2">
          <NavUserButtons type={session?.user.role} />
        </div>
        <NavServer />
      </div>
    </header>
  )
}
export default Header
