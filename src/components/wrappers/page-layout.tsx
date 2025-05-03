import Link from "next/link";

import Analytics from "@/components/analytics";

export default function PageLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {process.env.NODE_ENV !== "development" && <Analytics />}

      <section>
        <div className="mobileView">
          <p>
            Wybrana strona nie jest dostępna
            <br />
            dla urządzeń mobilnych.
          </p>
        </div>

        <main>{children}</main>
      </section>

      <footer>
        <section>
          <div>
            <p>Stworzone przez </p>
            <Link href="https://github.com/quanosek" target="_blank">
              Jakuba Kłało
            </Link>
          </div>

          <div>
            <p>
              Wszelkie prawa zastrzeżone &#169; {new Date().getFullYear()} |
              domena{" "}
            </p>
            <Link href="https://www.klalo.pl/" target="_blank">
              klalo.pl
            </Link>
          </div>
        </section>
      </footer>
    </>
  );
}
