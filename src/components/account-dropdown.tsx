'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'

import { Role } from '@/utils/enums'

export default function AccountDropdownComponent({ user }: { user: User | undefined }) {
  const router = useRouter()

  const admin = user?.role === Role.ADMIN
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const hideButtonsList = () => setShowDropdown(false)

    if (showDropdown) document.addEventListener('click', hideButtonsList)
    return () => document.removeEventListener('click', hideButtonsList)
  }, [showDropdown])

  if (!user) {
    return (
      <Link className='loginButton' href='/login'>
        <p>Zaloguj się</p>
      </Link>
    )
  }

  return (
    <div className='loginButton'>
      <button onClick={() => setShowDropdown(true)}>
        <p>{user.username ? `@${user.username}` : user.email}</p>

        <Image
          style={{
            borderColor: admin ? 'var(--gold)' : 'var(--white)',
          }}
          alt=''
          src={user.image ?? '/icons/profile.svg'}
          width={100}
          height={100}
          priority={true}
        />
      </button>

      <div className='dropdown' style={{ display: showDropdown ? '' : 'none' }}>
        <Link href='/profile'>
          <p>Twój profil</p>
        </Link>

        <Link href='/saved'>
          <p>Zapisane gry</p>
        </Link>

        {admin && (
          <Link href='/admin' style={{ backgroundColor: 'var(--gold)' }}>
            <p>Panel administratora</p>
          </Link>
        )}

        <hr />

        <button
          onClick={async () => {
            await signOut({ redirect: false })
            router.push('/')
            router.refresh()
          }}
        >
          <p>Wyloguj się</p>
        </button>
      </div>
    </div>
  )
}
