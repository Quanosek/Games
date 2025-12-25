import Link from 'next/link'
import Form from './form'

import styles from '@/styles/auth.module.scss'

export default function LoginPage() {
  return (
    <>
      <div className={styles.title}>
        <h1>Zaloguj się</h1>
        <p>Wpisz swoje dane, aby kontynuować</p>
      </div>

      <Form />

      <div className={styles.prompt}>
        <p>Nie posiadasz konta?</p>
        <Link href='/register'>Zarejestruj się!</Link>
      </div>
    </>
  )
}
