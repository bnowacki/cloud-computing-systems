'use client'

import AuthForm from '../components/auth-form'
import SignUpMagicLink from './magic-link'
import SignUpPassword from './password'

export default function SignUp() {
  return (
    <AuthForm title="Sign up" passwordForm={<SignUpPassword />} linkForm={<SignUpMagicLink />} />
  )
}
