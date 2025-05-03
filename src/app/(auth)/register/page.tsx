import Link from "next/link";

import Form from "./form";

import styles from "@/styles/auth.module.scss";

export default function RegisterPage() {
  return (
    <>
      <div className={styles.title}>
        <h1>Zarejestruj się</h1>
        <p>Stwórz konto, aby korzystać z możliwości zapisu gier</p>
      </div>

      <Form />

      <div className={styles.prompt}>
        <p>Posiadasz już konto?</p>
        <Link href="/login">Zaloguj się!</Link>
      </div>
    </>
  );
}
