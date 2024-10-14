'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import React from 'react'

import useLoadingState from '@/hooks/use-loading-state'
import { UserProfile } from '@/types/models'
import { createClient } from '@/utils/supabase/client'

type UserContextType = {
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  [propName: string]: any
}

export const UserContextProvider = (props: Props) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const [getProfile, profileLoading] = useLoadingState(
    useCallback(async () => {
      const supabase = createClient()

      const { data: profile, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .single()
      if (profileError) throw profileError

      setProfile(profile)
    }, []),
    {
      onErrorToast: 'Failed to get current user',
    }
  )

  React.useEffect(() => {
    const supabase = createClient()

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null)
        return
      }

      if (event === 'SIGNED_IN') {
        getProfile()
        return
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, []) // eslint-disable-line

  return (
    <UserContext.Provider
      value={{
        profile,
        isAdmin: !!profile && profile?.role === 'admin',
        loading: profileLoading,
      }}
      {...props}
    />
  )
}

export const useAuth = () => {
  const value = useContext(UserContext)
  if (!value) throw new Error('useAuth must be used within UserContextProvider')

  return value
}
