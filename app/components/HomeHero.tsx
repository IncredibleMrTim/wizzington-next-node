"use client";

import { usePathname } from "next/navigation";
import { Separator } from "./separator/Separator";

export const HomeHero = () => {
  const pathname = usePathname();

  // Only show on home page
  if (pathname !== "/") {
    return null;
  }

  return (
    <>
      <div
        className="relative flex flex-col items-end gap-4 w-full h-auto md:h-100 bg-cover bg-no-repeat bg-blend-lighten bg-white md:bg-white/50"
        style={{
          backgroundImage: "url('/header-model.jpg')",
          backgroundPosition: "30%",
        }}
      >
        <div className="flex flex-col justify-center items-center gap-6 h-full md:w-1/2 bg-white/40">
          <div className="hidden md:flex font-petitFormalScript  text-5xl text-center">{`Wizzington Moo's Boutique UK`}</div>
          <div className=" text-black text-lg text-center w-1/2">
            Costumes that transform every performance into an
            unforgettable spectacle, embracing individuality and artistry.
          </div>
        </div>
      </div>
      <Separator className="hidden md:flex" />
    </>
  );
};
