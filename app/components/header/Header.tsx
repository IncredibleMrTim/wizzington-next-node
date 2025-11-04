"use client";
import Navigation from "@/components/navigation/Navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { Drawer } from "../drawer/Drawer";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
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
        <div className="flex absolute inset-0 w-full h-48 md:bg-gradient-to-r from-transparent from-20% to-[#f8f8f8] to-100% pointer-events-none" />
        {/* Content */}
        <div className="relative w-full flex justify-center md:justify-end p-4 h-48">
          <img
            src="/wizz-logo-trans-v2-flare-stroke.webp"
            alt="Wizzington Moos Boutique Logo"
            onClick={() => router.push("/")}
          />
        </div>
      </header>
      <div className="hidden w-full border-b border-gray-300 h-10 sho md:flex">
        <Navigation />
      </div>
      <div className="flex w-full visible md:hidden">
        <Drawer />
      </div>
    </>
  );
};
export default Header;
