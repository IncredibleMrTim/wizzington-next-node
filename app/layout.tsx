import type { Metadata } from "next";

import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import Header from "./components/header/Header";
import SessionProvider from "./providers/SessionProvider";
import { HomeHero } from "./components/HomeHero";

export const metadata: Metadata = {
  title: "Wizzington Moo's UK",
  description:
    "Welcome to Wizzington Moo's UK, your one-stop shop for all things moo-tastic!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <SessionProvider>
            <Header />
            <HomeHero />
            <div className="p-4 md:px-16 md:py-8">{children}</div>
          </SessionProvider>
        </Theme>
      </body>
    </html>
  );
}
