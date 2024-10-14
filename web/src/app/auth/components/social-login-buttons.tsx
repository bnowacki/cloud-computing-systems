'use client'

import React from 'react'

import { Provider } from '@supabase/supabase-js'
import { FcGoogle } from 'react-icons/fc'
import { SiLinkedin } from 'react-icons/si'

import toast from '@/components/toast'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

import FormDivider from './divider'

export default function SocialLoginButtons({ disabled }: { disabled?: boolean }) {
  const supabase = createClient()
  const [providerLoading, setProviderLoading] = React.useState<Provider | null>(null)

  const handleProvider = React.useCallback(
    async (provider: Provider) => {
      setProviderLoading(provider)
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin + '/auth/callback',
          },
        })
        if (error) throw error
      } catch (e) {
        console.error(e)
        setProviderLoading(null)
        toast({ title: 'Failed to sign in', type: 'error' })
      }
    },
    [supabase]
  )

  return (
    <>
      <FormDivider text="or continue with" />
      <Button
        onClick={() => handleProvider('google')}
        disabled={disabled || !!providerLoading}
        className="w-full border-1 border-foreground text-primary-foreground"
      >
        <div className="flex items-center gap-2 ">
          <FcGoogle className="h-4 w-4" /> <span>Google</span>
        </div>
      </Button>
      <Button
        onClick={() => handleProvider('linkedin_oidc')}
        disabled={disabled || !!providerLoading}
        className="w-full border-1 border-foreground text-foreground bg-[#0077B5] hover:bg-[#046293] active:bg-[#0B4971]"
      >
        <div className="flex items-center gap-2">
          <SiLinkedin className="h-4 w-4 " /> <span>LinkedIn</span>
        </div>
      </Button>
    </>
  )
}
