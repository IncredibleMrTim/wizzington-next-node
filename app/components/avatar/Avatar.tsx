import SignIn from "@/app/(pages)/auth/signin/page";
import { USER_ROLE } from "@/lib/types";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "radix-ui";
import { Separator } from "../separator/Separator";

export const AuthAvatar = ({ onClick }: { onClick: () => void }) => {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user ? (
        <>
          <div className="flex flex-col w-full fixed bottom-0 left-0 text-lg text-gray-100 p-4 items-center gap-2">
            <Separator />
            <div className="flex w-full items-center justify-center pb-2 border-b border-b-gray-300">
              <Avatar.Root>
                <Avatar.Image
                  src={session.user.image || undefined}
                  className="rounded-full"
                />
                <Avatar.Fallback className="bg-blue-500 text-white p-2 rounded-full">
                  {session.user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?"}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="flex flex-col ml-2">
                <span className="text-gray-800 text-sm font-semibold">
                  {session.user.name}
                </span>
                <span className="text-gray-600 text-xs">
                  {session.user.email}
                </span>
              </div>
            </div>
            <div className="flex flex-row w-full justify-between">
              {session.user.role === USER_ROLE.ADMIN && (
                <Link
                  href="/admin"
                  onClick={onClick}
                  className="flex justify-center text-gray-800 text-sm w-full text-center mt-2"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                onClick={() => signOut()}
                href=""
                className="flex justify-center text-gray-800 text-sm w-full text-center mt-2 lg:hidden"
              >
                Logout
              </Link>
            </div>
          </div>
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
};
