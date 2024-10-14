'use client'

import AuthForm from '../components/auth-form'
import SignInMagicLink from './magic-link'
import SignInPassword from './password'

export default function SignIn() {
  return (
    <AuthForm title="Sign in" linkForm={<SignInMagicLink />} passwordForm={<SignInPassword />} />
  )
}
