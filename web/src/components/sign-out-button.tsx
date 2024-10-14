'use client'

import { useCallback } from 'react'

import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/utils/supabase/client'

import { Button } from './ui/button'

export default function SignOutButton() {
  const router = useRouter()

  const [signOut, loading] = useLoadingState(
    useCallback(async () => {
      const { error } = await createClient().auth.signOut()
      if (error) throw error
      router.refresh()
    }, [router])
  )

  return (
    <Button onClick={signOut} loading={loading} variant="outline" iconRight={<LogOutIcon />}>
      Sign out
    </Button>
  )
}
