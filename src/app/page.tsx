import Image from 'next/image'
import Link from 'next/link'

import PageLayout from '@/components/wrappers/page-layout'
import styles from './page.module.scss'

export default function HomePage() {
  const dev = process.env.NODE_ENV === 'development'

  return (
    <PageLayout>
      <h1>Wybierz grę</h1>

      <div className={styles.buttons}>
        <Link href='/quizy'>
          <Image
            alt='❔'
            src='/favicons/white-question-mark.svg'
            width={22}
            height={22}
            draggable={false}
          />
          <p>Quizy</p>
        </Link>

        <Link href='/wisielec'>
          <Image alt='🪢' src='/favicons/knot.svg' width={22} height={22} draggable={false} />
          <p>Wisielec</p>
        </Link>

        <Link href='/familiada'>
          <Image alt='💰' src='/favicons/money-bag.svg' width={22} height={22} draggable={false} />
          <p>{`"Familiada"`}</p>
        </Link>

        <Link href='/pnm' tabIndex={dev ? 0 : -1} className={dev ? '' : 'disabled'}>
          <Image
            alt='💵'
            src='/favicons/dollar-banknote.svg'
            width={22}
            height={22}
            draggable={false}
          />
          <p>{`"Postaw na milion"`}</p>
        </Link>
      </div>
    </PageLayout>
  )
}
