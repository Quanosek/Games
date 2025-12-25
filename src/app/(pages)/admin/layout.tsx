import { redirect } from 'next/navigation'
import { auth } from '@/utils/auth'
import { Role } from '@/utils/enums'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user

  if (!user) return redirect('/')
  else if (user.role !== Role.ADMIN) return redirect('/profile')

  return <>{children}</>
}
