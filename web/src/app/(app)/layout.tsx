import React, { ReactNode } from 'react'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function layout({ children }: { children: ReactNode }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/sign-in')
  }

  return (
    <div className="flex">
      <div className="p-4 w-2 flex-1">{children}</div>
    </div>
  )
}
