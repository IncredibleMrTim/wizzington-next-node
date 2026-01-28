"use client";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Drawer } from "../drawer/Drawer";
import { useSession } from "next-auth/react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userData } = useSession();
  return (
    <>
      <header className="h-48 relative">
        {/* Background image */}
        <div
          className="absolute inset-0 w-full h-48 bg-cover bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('/header-model.jpg')",
            backgroundPosition: "30%",
          }}
        />
        {/* Gradient overlay */}
        <div className="flex absolute inset-0 w-full h-48 md:bg-linear-to-r from-transparent from-20% to-[#f8f8f8] to-100% pointer-events-none" />
        {/* Content */}
        <div className="relative w-full flex justify-center md:justify-end p-4 h-48">
          <div className="relative w-40 h-40 cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/logo.webp"
              alt="Wizzington Moos Boutique Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </header>
      <div className="hidden w-full border-b border-gray-300 h-10 md:flex">
        <Navigation type={userData?.user.role} />
      </div>
      <div className="flex w-full visible md:hidden">
        <Drawer />
      </div>
    </>
  );
};
export default Header;
