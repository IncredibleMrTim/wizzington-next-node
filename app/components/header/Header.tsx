import NavUserButtons from "@/components/navigation/NavUserButtons";
// import { Drawer } from "../drawer/Drawer";
import { NavServer } from "../navigation/NavServer";
import { Separator } from "../separator/Separator";
import { HeaderClient } from "./HeaderClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <header className=" relative">
        {/* Background image */}

        {/* Gradient overlay */}
        <div
          className="flex mb:hidden absolute items-end w-full h-50 md:h-auto bg-cover bg-no-repeat bg-blend-lighten bg-white/50 md:bg-white"
          style={{
            backgroundImage: "url('/header-model.jpg')",
            backgroundPosition: "30%",
          }}
        ></div>
        {/* Content */}
        <div className="relative w-full flex justify-center md:justify-center p-4 h-48">
          <HeaderClient />
        </div>
      </header>
      <div className="relative hidden w-full  md:flex md:justify-center">
        <div className="absolute right-2">
          <NavUserButtons type={session?.user.role} />
        </div>
        <NavServer />
      </div>
      <Separator className="hidden md:flex" />

      <div className="flex w-full visible md:hidden">{/* <Drawer /> */}</div>
    </>
  );
};
export default Header;
