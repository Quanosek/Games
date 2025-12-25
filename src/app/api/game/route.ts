import { NextResponse } from 'next/server'
import db from '@/utils/db'

// get saved game params
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    // id required
    if (!id) throw new Error('Nie podano id gry')

    // game not found
    const game = await db.game.findUnique({ where: { id } })

    if (!game) {
      return NextResponse.json({ message: 'Nie znaleziono gry' }, { status: 404 })
    }

    // return response
    return NextResponse.json(
      { message: 'Pomyślnie wczytano grę z twojego konta', game },
      { status: 200 }
    )
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: 'Wystąpił nieoczekiwany błąd serwera', error },
      { status: 500 }
    )
  }
}

// save new game
export async function POST(req: Request) {
  const data = await req.json()

  try {
    // save new game
    const game = await db.game.create({ data })

    // return response
    return NextResponse.json({ message: 'Pomyślnie zapisano nową grę', game }, { status: 201 })
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: 'Wystąpił nieoczekiwany błąd serwera', error },
      { status: 500 }
    )
  }
}

// update saved game data
export async function PUT(req: Request) {
  const data = await req.json()

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    // id required
    if (!id) throw new Error('Nie podano id gry')

    // game not found
    const existingGame = await db.game.findUnique({ where: { id } })

    if (!existingGame) {
      return NextResponse.json({ message: 'Nie znaleziono gry' }, { status: 404 })
    }

    // update saved game data
    const game = await db.game.update({ where: { id }, data })

    // return response
    return NextResponse.json({ message: 'Pomyślnie zaktualizowano grę', game }, { status: 200 })
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: 'Wystąpił nieoczekiwany błąd serwera', error },
      { status: 500 }
    )
  }
}

// delete saved game
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    // id required
    if (!id) throw new Error('Nie podano id gry')

    // game not found
    const existingGame = await db.game.findUnique({ where: { id } })

    if (!existingGame) {
      return NextResponse.json({ message: 'Nie znaleziono gry' }, { status: 404 })
    }

    // delete saved game
    await db.game.delete({ where: { id } })

    // return response
    return NextResponse.json(
      { message: 'Pomyślnie usunięto grę', game: existingGame },
      { status: 200 }
    )
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: 'Wystąpił nieoczekiwany błąd serwera', error },
      { status: 500 }
    )
  }
}
