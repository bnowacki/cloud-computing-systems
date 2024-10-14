'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import { SignInInput, SignUpInput, signInSchema, signUpSchema } from './schemas'

export const signUp = async (input: SignUpInput) => {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.format() }
  }

  const origin = headers().get('origin')
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: input.fullName,
      },
    },
  })
  if (error) throw error

  redirect('/auth/sign-in?message=Check email to continue sign in process')
}

export const signIn = async (input: SignInInput) => {
  const parsed = signInSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.format() }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    ...input,
  })

  if (error) throw error

  redirect('/')
}
