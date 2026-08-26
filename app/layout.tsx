import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";

import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import Header from "./components/header/Header";
import SessionProvider from "./providers/SessionProvider";
import { HomeHero } from "./components/HomeHero";
import { getCategories } from "./actions/categories.action";
import { SITE_URL, SITE_NAME, organizationJsonLd } from "@/lib/seo";

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

const DEFAULT_DESCRIPTION =
  "Handcrafted dancewear & pageant couture from Wizzington Moo's Boutique, based in Park Gate (SO31), UK — shipping worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Dancewear & Pageant Couture`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Dancewear & Pageant Couture`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    locale: "en_GB",
    images: [{ url: "/logo.webp", width: 300, height: 297, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | Dancewear & Pageant Couture`,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
    <html lang="en-GB">
      <body className={`${playfairDisplay.variable} ${outfit.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <Theme className="bg-brand-plum!">
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
