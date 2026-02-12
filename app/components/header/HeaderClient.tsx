"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export const HeaderClient = () => {
  const router = useRouter();

  return (
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
  );
};
