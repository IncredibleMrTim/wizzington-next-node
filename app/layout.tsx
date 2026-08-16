import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";

import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import Header from "./components/header/Header";
import SessionProvider from "./providers/SessionProvider";
import { HomeHero } from "./components/HomeHero";
import { getCategories } from "./actions/categories.action";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-wm-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-wm-body",
});

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
  const categories = await getCategories();
  const danceWear = categories.find(
    (c) => c.name.toLowerCase() === "dance wear",
  );
  const pageantWear = categories.find(
    (c) => c.name.toLowerCase() === "pageant wear",
  );

  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${outfit.variable}`}>
        <Theme className="bg-(--wm-plum)!">
          <SessionProvider>
            <Header />
            <HomeHero
              danceWearHref={danceWear ? `/category/${danceWear.id}` : "/"}
              pageantWearHref={
                pageantWear ? `/category/${pageantWear.id}` : "/"
              }
            />
            <div className="p-4 md:px-16 md:py-8">{children}</div>
          </SessionProvider>
        </Theme>
      </body>
    </html>
  );
}
