import React from 'react'

import { IconCloudUpload } from '@tabler/icons-react'

import { getUser } from '@/utils/supabase/server'

import SignOutButton from './sign-out-button'

export default async function Header() {
  const { user } = await getUser()

  return (
    <div className="bg-zinc-900 w-full">
      <div className="max-w-screen-xl m-auto p-4 flex items-center justify-between gap-4">
        <div className="font-bold text-xl flex items-center gap-2">
          <IconCloudUpload />
          <div>Cloudrive</div>
        </div>
        <div className="flex items-center gap-4">
          <div>{user?.email}</div>
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}
