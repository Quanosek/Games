"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import PageLayout from "@/components/wrappers/page-layout";

export default function NotFoundPage() {
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
    <PageLayout>
      <h1>Nie znaleziono strony</h1>

      <button onClick={() => router.push("/")}>
        🏠 Powrót na stronę główną <span>[{seconds}]</span>
      </button>
    </PageLayout>
  );
}
