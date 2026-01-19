import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    role: "USER" | "ADMIN";
    firstName?: string;
    lastName?: string;
  }

  interface JWT {
    role: "USER" | "ADMIN";
    id: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }
}
