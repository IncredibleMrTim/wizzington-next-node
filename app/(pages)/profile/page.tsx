"use client";
import Image from "next/image";
import JWTViewer from "@/components/JWTViewer";
import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="wm-scope -m-4 md:-mx-16 md:-my-8 p-8 min-h-screen bg-[color:var(--wm-plum)] text-[color:var(--wm-cream)]">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="wm-scope -m-4 md:-mx-16 md:-my-8 p-8 min-h-screen bg-[color:var(--wm-plum)] text-[color:var(--wm-cream)]">
        <div>Not logged in</div>
        <a
          href="/auth/signin"
          className="text-[color:var(--wm-gold)] underline"
        >
          Go to login
        </a>
      </div>
    );
  }

  return (
    <div className="wm-scope -m-4 md:-mx-16 md:-my-8 p-8 min-h-screen space-y-4 bg-[color:var(--wm-plum)]">
      <div className="flex justify-between items-center">
        <h1
          className="wm-h-page"
          style={{ fontFamily: "var(--font-wm-display)", color: "var(--wm-cream)" }}
        >
          Profile
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full py-2 px-4 text-sm font-medium border border-[color:rgba(232,180,196,0.4)] text-[color:var(--wm-rose-light)] hover:border-[color:var(--wm-gold)] hover:text-[color:var(--wm-gold)] transition-colors"
          style={{ fontFamily: "var(--font-wm-body)" }}
        >
          Sign Out
        </button>
      </div>

      <div
        className="rounded p-4 border"
        style={{ borderColor: "rgba(201,132,154,0.15)", backgroundColor: "var(--wm-plum-mid)" }}
      >
        <h2
          className="wm-h-section mb-2"
          style={{ fontFamily: "var(--font-wm-display)", color: "var(--wm-cream)" }}
        >
          User Info
        </h2>
        <div
          className="flex flex-col gap-1"
          style={{ color: "rgba(245,237,232,0.75)", fontFamily: "var(--font-wm-body)" }}
        >
          <div>
            <strong style={{ color: "var(--wm-cream)" }}>Name:</strong>{" "}
            {session.user?.name}
          </div>
          <div>
            <strong style={{ color: "var(--wm-cream)" }}>Email:</strong>{" "}
            {session.user?.email}
          </div>
          <div>
            <strong style={{ color: "var(--wm-cream)" }}>ID:</strong>{" "}
            {(session.user as any)?.id}
          </div>
        </div>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Profile"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full mt-2 border-2 border-[color:var(--wm-gold)]"
          />
        )}
      </div>

      <JWTViewer />
    </div>
  );
}
