import Board from './board'
import styles from './styles.module.scss'

export default async function WisielecBoardPage({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id

  return (
    <div className={styles.board}>
      <div className={styles.layout}>
        <Board id={id} />

        <div className={styles.credits}>
          <p>Stworzone na stronie games.klalo.pl</p>
        </div>
      </div>
    </div>
  )
}
