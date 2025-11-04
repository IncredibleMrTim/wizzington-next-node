"use client";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { cn } from "@/app/lib/utils";

function PasswordInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  const [inputType, setInputType] = useState<"text" | "password">("password");
  return (
    <div className="relative">
      <input
        type={type ?? inputType}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent bg-white",
          className
        )}
        {...props}
      />
      <FiEye
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() =>
          setInputType(inputType === "password" ? "text" : "password")
        }
      />
    </div>
  );
}

export { PasswordInput };
