import Link from "next/link";
import Image from "next/image";

import { NunitoSans } from "@/utils/fonts";
import PageLayout from "@/components/wrappers/page-layout";
import styles from "../styles.module.scss";

export default function PnmRulesPage() {
  return (
    <PageLayout>
      <div className={styles.rulesTitle}>
        <Link href="/pnm" className={styles.backButton}>
          <Image
            style={{ rotate: "-90deg" }}
            className="icon"
            alt=""
            src="/icons/arrow.svg"
            width={25}
            height={25}
          />
          <p>Powrót</p>
        </Link>

        <h1>{"✨ Zasady gry ✨"}</h1>
      </div>

      <div className={`${NunitoSans.className} ${styles.rulesContainer}`}>
        <p>
          Po uruchomieniu planszy etapu wybór kategorii możliwy jest przez
          kliknięcie w odpowiednią nazwę lub wciśnięcie odpowiednio klawiszy{" "}
          <span>[1]</span> lub <span>[2]</span>. Następnie po pojawieniu się
          wszystkich możliwych odpowiedzi należy włączyć odliczanie czasu przez
          wciśnięcie klawisza <span>[Spacji]</span>. Pieniądze przydziela się do
          odpowiedzi przez wciskanie lub wciśnięcie i przytrzymanie przycisków -
          i + na ekranie. Po zakończeniu odliczania czasu, aby wyświetlić
          poprawną odpowiedź (uruchomić zapadnie) należy ponownie wcisnąć
          klawisz <span>[Spacji]</span> i poczekać na animację.
        </p>

        <p style={{ opacity: "90%" }}>Więcej zasad już wkrótce...</p>
      </div>
    </PageLayout>
  );
}
