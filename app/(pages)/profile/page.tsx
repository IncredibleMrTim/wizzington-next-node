"use client"
import JWTViewer from "@/components/JWTViewer"
import { useSession, signOut } from "next-auth/react"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="p-8">Loading...</div>
  }

  if (!session) {
    return (
      <div className="p-8">
        <p>Not logged in</p>
        <a href="/login" className="text-blue-500 underline">
          Go to login
        </a>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>

      <div className="border rounded p-4">
        <h2 className="text-xl font-bold mb-2">User Info</h2>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>ID:</strong> {(session.user as any)?.id}</p>
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-20 h-20 rounded-full mt-2"
          />
        )}
      </div>

      <JWTViewer />
    </div>
  )
}
