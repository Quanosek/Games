'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Game } from 'next-auth'
import axios from 'axios'
import toast from 'react-hot-toast'

import { NunitoSans } from '@/utils/fonts'
import styles from '@/styles/dashboard.module.scss'

interface Games extends Game {
  label: string
}

export default function SavedGamesList({ user }: { user: User | undefined }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState<Games[]>([])

  useEffect(() => {
    if (!user) return

    axios
      .get('/api/game/saved', { params: { userId: user.id } })
      .then((response) => setGames(response.data.games))
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false))
  }, [user])

  const loadGame = (game: Game) => {
    const gameData = {
      id: game.id,
      data: JSON.parse(game.data),
    }

    localStorage.setItem(game.type, JSON.stringify(gameData))
    router.push(`/${game.type}`)
  }

  const deleteGame = (game: Game) => {
    if (!confirm('Czy na pewno chcesz usunąć tę grę?')) return

    axios
      .delete('/api/game', { params: { id: game.id } })
      .then(() => {
        setGames(games.filter((g) => g.id !== game.id))
        toast.success('Gra została usunięta')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
      .finally(() => {
        localStorage.removeItem(game.type)
      })
  }

  if (loading) {
    return (
      <div className='loading'>
        <p>Trwa ładowanie...</p>
      </div>
    )
  }

  return (
    <div className={styles.gamesList}>
      {!games.length && <p className={styles.emptyList}>Brak zapisanych gier</p>}

      {games.map((game, i) => (
        <div key={i} className={styles.gameData}>
          <button className={styles.info} onClick={() => loadGame(game)}>
            <div className={styles.dataTitle}>
              <h2>{game.label}</h2>
              {' • '}
              <p>{`"${game.title}"`}</p>
            </div>

            <h3>
              {`Utworzono: ${new Date(game.createdAt).toLocaleDateString()}, ${new Date(
                game.createdAt
              ).toLocaleTimeString()}`}{' '}
              {game.updatedAt !== game.createdAt && (
                <>
                  {`(aktualizacja: ${new Date(game.updatedAt).toLocaleDateString()}, ${new Date(
                    game.updatedAt
                  ).toLocaleTimeString()})`}
                </>
              )}
            </h3>

            <hr />

            <code className={`${NunitoSans.className} ${styles.dataParams}`}>{game.data}</code>
          </button>

          <button className={styles.deleteButton} onClick={() => deleteGame(game)}>
            <Image
              className='icon'
              alt='Usuń'
              src='/icons/trashcan.svg'
              width={24}
              height={24}
              draggable={false}
            />
          </button>
        </div>
      ))}
    </div>
  )
}
