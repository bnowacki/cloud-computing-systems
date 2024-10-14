import React, { ReactNode, useMemo } from 'react'

import { usePathname } from 'next/navigation'
import { parseAsStringEnum, useQueryState } from 'nuqs'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import FormDivider from './divider'
import LinkButton from './link-button'
import SocialLoginButtons from './social-login-buttons'

enum AuthTab {
  link = 'link',
  password = 'password',
}

type Props = {
  title: string
  linkForm: ReactNode
  passwordForm: ReactNode
  disabled?: boolean
}

export default function AuthForm({ title, linkForm, passwordForm, disabled }: Props) {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum<AuthTab>(Object.values(AuthTab)).withDefault(AuthTab.link)
  )
  const pathname = usePathname()
  const isSignUp = useMemo(() => pathname.includes('sign-up'), [pathname])

  return (
    <div className="flex-1 flex flex-col w-full px-6 sm:max-w-md justify-center gap-6 border py-8 rounded-lg">
      <h1 className="text-center font-bold text-2xl">{title}</h1>
      <Tabs value={tab} onValueChange={v => setTab(v as AuthTab)} className="w-full space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="link" className="flex-1">
            Magic link
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1">
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="link"
          className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500"
        >
          {linkForm}
        </TabsContent>
        <TabsContent
          value="password"
          className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500"
        >
          {passwordForm}
        </TabsContent>
      </Tabs>
      <div className="space-y-4">
        <FormDivider text={isSignUp ? 'Already have an account?' : 'New here?'} />
        <LinkButton href={isSignUp ? '/auth/sign-in' : '/auth/sign-up'}>
          {isSignUp ? 'Sign in' : 'Sign up'}
        </LinkButton>
        <SocialLoginButtons disabled={disabled} />
      </div>
    </div>
  )
}
