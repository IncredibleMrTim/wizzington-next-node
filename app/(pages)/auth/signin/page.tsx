"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthRedirect } from "@/app/components/auth/AuthRedirect";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthRedirect />
      <div className="-m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 min-h-screen flex items-end lg:items-center justify-end lg:justify-center py-4 lg:py-12 px-4 sm:px-6 lg:px-8 sticky bottom-0 bg-brand-plum">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2
              className="wm-h-section mt-6 text-center italic"
              style={{ color: "var(--color-brand-cream)" }}
            >
              Sign in to your account
            </h2>
            <div
              className="mt-2 text-center text-sm"
              style={{ color: "rgba(245,237,232,0.55)" }}
            >
              Use your Google account to continue
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 rounded-full text-sm font-medium uppercase tracking-[0.1em] bg-brand-gold text-brand-plum hover:bg-brand-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full hidden lg:flex justify-center py-2.5 px-4 rounded-full text-sm font-medium border border-[color:rgba(232,180,196,0.4)] text-brand-rose-light hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
