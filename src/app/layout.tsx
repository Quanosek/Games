import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

import { auth } from "@/utils/auth";
import { Nexa } from "@/utils/fonts";
import Wrapper from "@/components/wrappers/session";
import AccountDropdown from "@/components/account-dropdown";

import "the-new-css-reset/css/reset.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Pokój gier / klalo.pl",
  description:
    "Przeglądarkowe wersje popularnych gier towarzyskich i telewizyjnych teleturniejów w postaci interaktywnych planszy.",

  icons: {
    icon: ["/favicons/game-die.ico", "/favicons/game-die.svg"],
    apple: "/favicons/game-die.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "black",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="pl" className={Nexa.className}>
      <body>
        <Wrapper>
          <header>
            <section>
              <div className="navigation">
                <Link href="/">
                  <Image
                    alt="🎲"
                    src="/favicons/game-die.svg"
                    width={28}
                    height={28}
                    draggable={false}
                    priority={true}
                  />
                  <h1>Pokój gier</h1>
                </Link>

                <Link href="/info">
                  <p>Informacje</p>
                </Link>

                <Link
                  href="https://buycoffee.to/kubaklalo/"
                  target="_blank"
                  className="supportButton"
                >
                  <p>Wesprzyj</p>
                </Link>
              </div>

              <AccountDropdown user={session?.user} />
            </section>
          </header>

          {children}
        </Wrapper>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#2a2a2a",
              color: "#f2f2f2",
            },
          }}
        />
      </body>
    </html>
  );
}
