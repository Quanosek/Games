import { auth } from '@/utils/auth'
import GamesList from './games-list'
// import styles from "@/styles/dashboard.module.scss";

export default async function SavedPage() {
  const session = await auth()
  const user = session?.user

  return (
    <>
      <h1>Zapisane gry</h1>
      <GamesList user={user} />
    </>
  )
}
