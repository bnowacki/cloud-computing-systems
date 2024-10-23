import React from 'react'

import { redirect } from 'next/navigation'

import Logo from '@/components/logo'
import { createClient } from '@/utils/supabase/server'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) return redirect('/')

  return (
    <div className="flex items-center justify-center flex-col gap-4 h-full min-h-screen">
      <Logo />
      <div className="flex items-center justify-center self-stretch">{children}</div>
    </div>
  )
}
