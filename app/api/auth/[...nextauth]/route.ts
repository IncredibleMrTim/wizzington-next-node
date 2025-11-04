import NextAuth, { NextAuthOptions } from "next-auth";
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
    async redirect({ url, baseUrl }) {
      // Redirect to home after successful login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/"; // Default redirect to home
    },
    async session({ session, token }) {
      // Add JWT data to session
      if (session.user) {
        session.user.id = token.sub || token.id;
        session.user.role = token.role || "user";
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.picture = token.picture;
        session.accessToken = token.accessToken;
      }

      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Persist user data in JWT (only on first sign-in)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = "user";
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
