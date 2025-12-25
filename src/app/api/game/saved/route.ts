import { NextResponse } from 'next/server'
import db from '@/utils/db'

// get all saved games list
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  const dictionary = (type: string) => {
    return {
      quizy: 'Quizy',
      wisielec: 'Wisielec',
      familiada: 'Familiada',
      pnm: 'Postaw na milion',
    }[type]
  }

  try {
    if (!userId) {
      throw new Error('Nie podano id użytkownika')
    }

    const gamesDatabase = (await db.game.findMany({ where: { userId } })).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    const games = []
    for (const game of gamesDatabase) {
      games.push({
        ...game,
        label: dictionary(game.type),
      })
    }

    return NextResponse.json({ message: 'Lista zapisanych gier', games }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Wystąpił nieoczekiwany błąd serwera', error },
      { status: 500 }
    )
  }
}
