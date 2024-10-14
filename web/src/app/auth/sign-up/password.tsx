'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

import { FormInput } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useLoadingState from '@/hooks/use-loading-state'

import { signUp } from '../actions'
import { SignUpInput, signUpSchema } from '../schemas'

export default function SignUpPassword() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  })

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<SignUpInput>>(
    async data => {
      const res = await signUp(data)
      if (res?.error) throw res.error
    },
    {
      onErrorToast: 'Failed to sign up',
    }
  )

  return (
    <Form {...form}>
      <form
        className="animate-in fade-in duration-500	space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <FormInput
            name="email"
            control={form.control}
            placeholder="you@example.com"
            label="Email"
          />
          <FormInput
            name="fullName"
            control={form.control}
            placeholder="Name Surname"
            label="Full name"
          />
          <FormInput type="password" name="password" control={form.control} label="Password" />
          <FormInput
            type="password"
            name="confirmPassword"
            control={form.control}
            label="Confirm password"
          />
        </div>
        <Button type="submit" loading={submitting} className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
