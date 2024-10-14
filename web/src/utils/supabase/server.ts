import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Database } from '@/types/database.types'

export const createClient = (key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) => {
  const cookieStore = cookies()

  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export const getUser = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/sign-in')
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profile')
    .select('*')
    .single()
  if (profileError) throw profileError

  if (!profile) {
    return redirect('/auth/sign-in')
  }

  return { profile, user }
}
