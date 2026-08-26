"use client";
import Image from "next/image";
import JWTViewer from "@/components/JWTViewer";
import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="-m-4 md:-mx-16 md:-my-8 p-8 min-h-screen bg-brand-plum text-brand-cream">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="-m-4 md:-mx-16 md:-my-8 p-8 min-h-screen bg-brand-plum text-brand-cream">
        <div>Not logged in</div>
        <a
          href="/auth/signin"
          className="text-brand-gold underline"
        >
          Go to login
        </a>
      </div>
    );
  }

  return (
    <div className="-m-4 md:-mx-16 md:-my-8 p-8 min-h-screen space-y-4 bg-brand-plum">
      <div className="flex justify-between items-center">
        <h1
          className="wm-h-page"
          style={{ color: "var(--color-brand-cream)" }}
        >
          Profile
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full py-2 px-4 text-sm font-medium border border-[color:rgba(232,180,196,0.4)] text-brand-rose-light hover:border-brand-gold hover:text-brand-gold transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div
        className="rounded p-4 border"
        style={{ borderColor: "rgba(201,132,154,0.15)", backgroundColor: "var(--color-brand-plum-mid)" }}
      >
        <h2
          className="wm-h-section mb-2"
          style={{ color: "var(--color-brand-cream)" }}
        >
          User Info
        </h2>
        <div
          className="flex flex-col gap-1"
          style={{ color: "rgba(245,237,232,0.75)" }}
        >
          <div>
            <strong style={{ color: "var(--color-brand-cream)" }}>Name:</strong>{" "}
            {session.user?.name}
          </div>
          <div>
            <strong style={{ color: "var(--color-brand-cream)" }}>Email:</strong>{" "}
            {session.user?.email}
          </div>
          <div>
            <strong style={{ color: "var(--color-brand-cream)" }}>ID:</strong>{" "}
            {(session.user as any)?.id}
          </div>
        </div>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Profile"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full mt-2 border-2 border-brand-gold"
          />
        )}
      </div>

      <JWTViewer />
    </div>
  );
}
