import React from 'react'

import { getUser } from '@/utils/supabase/server'

import Logo from './logo'
import SignOutButton from './sign-out-button'

export default async function Header() {
  const { user } = await getUser()

  return (
    <div className="bg-zinc-900 w-full">
      <div className="max-w-screen-xl m-auto p-4 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-4">
          <div>{user?.email}</div>
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}
