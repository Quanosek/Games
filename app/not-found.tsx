"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Header, Footer } from "@/components/assets";

export default function NotFound() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10); // 10 seconds

  useEffect(() => {
    const counter = setInterval(() => {
      setSeconds((prevSeconds: number) => prevSeconds - 1);
      if (seconds === 1) router.push("/");
    }, 1000);

    return () => clearInterval(counter);
  }, [router, seconds]);

  return (
    <>
      <Header />

      <main className="notFound">
        <h1>Nie znaleziono strony!</h1>

        <Link className="button" href="/">
          🏠 Powrót na stronę główną <span>[{seconds}]</span>
        </Link>
      </main>

      <Footer />
    </>
  );
}
