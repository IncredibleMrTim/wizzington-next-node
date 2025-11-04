import type { Metadata } from "next";

import "@radix-ui/themes/styles.css";
import "./globals.css";
import DevToolsProvider from "./devTools/DevToolsProvider";
import { Container, Theme } from "@radix-ui/themes";
import BreadCrumb from "./components/breadCrumb/BreadCrumbWrapper";
import Header from "./components/header/Header";
import { ReactQueryProvider } from "./providers/reactQueryProvider";
import ReduxProvider from "@/providers/reduxProvider";
import SessionProvider from "./providers/SessionProvider";

export const metadata: Metadata = {
  title: "Wizzington Moo's UK",
  description:
    "Welcome to Wizzington Moo's UK, your one-stop shop for all things moo-tastic!",
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
            <ReactQueryProvider>
              <ReduxProvider>
                <DevToolsProvider />
                <Header />

                <Container
                  size="4"
                  className="!m-0 !p-0 bg-gradient-to-br from-purple-50  to-white min-h-screen"
                >
                  <BreadCrumb />
                  {children}
                </Container>
              </ReduxProvider>
            </ReactQueryProvider>
          </SessionProvider>
        </Theme>
      </body>
    </html>
  );
}
