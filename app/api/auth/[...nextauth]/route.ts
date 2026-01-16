import prisma from "@/lib/prisma";
import NextAuth, { NextAuthOptions, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl, user }) {
      // If user is admin, redirect to admin page
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        
        if (dbUser?.role === "ADMIN") {
          return `${baseUrl}/admin`;
        }
      }

      // Default redirect to home
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/";
    },
    async session({ session, token }) {
      // Add JWT data to session
      if (session.user) {
        session.user.id = token.sub || token.id;
        session.user.role = token.role || "USER";
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.picture = token.picture;
        session.accessToken = token.accessToken as string | undefined;
      }

      return session;
    },
    async jwt({ token, user, account, profile }) {
      // On first sign-in, save user to database
      if (user && user.email) {
        const googleProfile = profile as any;
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {}, // Don't update on subsequent sign-ins
          create: {
            email: user.email,
            firstName: googleProfile?.given_name || "",
            surname: googleProfile?.family_name || "",
            role: "USER", // Default role - you'll set to ADMIN manually in DB
          },
        });

        token.id = dbUser.id;
        token.email = dbUser.email;
        token.name = user.name;
        token.role = dbUser.role;
      }

      // If user already exists, fetch latest role from DB
      if (!user && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        token.role = dbUser?.role || "USER";
      }

      // Extract first and last name from Google profile (only available on first sign-in)
      if (profile) {
        const googleProfile = profile as any;
        token.firstName = googleProfile.given_name;
        token.lastName = googleProfile.family_name;
        token.picture = googleProfile.picture;
      }

      // Store OAuth access token if available
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
