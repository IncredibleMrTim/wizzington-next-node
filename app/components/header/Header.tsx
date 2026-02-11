"use client";
import Image from "next/image";
import NavUserButtons from "@/components/navigation/NavUserButtons";
import { useRouter } from "next/navigation";
import { Drawer } from "../drawer/Drawer";
import { useSession } from "next-auth/react";
import { Nav } from "../navigation/nav";
import { Separator } from "../separator/Separator";

const Header = () => {
  const router = useRouter();

  const { data: userData } = useSession();
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
          <div
            className="relative w-40 h-40 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.webp"
              alt="Wizzington Moos Boutique Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </header>
      <div className="relative hidden w-full  md:flex md:justify-center">
        <div className="absolute right-2">
          <NavUserButtons type={userData?.user.role} />
        </div>
        <Nav />
      </div>
      <Separator className="hidden md:flex" />

      <div className="flex w-full visible md:hidden">
        <Drawer />
      </div>
    </>
  );
};
export default Header;
