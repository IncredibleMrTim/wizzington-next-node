import "next-auth";
import "next-auth/jwt";
import { USER_ROLE } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: USER_ROLE;
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    role: USER_ROLE;
    firstName?: string;
    lastName?: string;
  }

  interface JWT {
    role: USER_ROLE;
    id: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }
}
