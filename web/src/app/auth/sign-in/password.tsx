'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

import { FormInput } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useLoadingState from '@/hooks/use-loading-state'

import { signIn } from '../actions'
import { SignInInput, signInSchema } from '../schemas'

export default function SignInPassword() {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<SignInInput>>(
    async data => {
      const res = await signIn(data)
      if (res?.error) {
        console.error(res.error)
        throw new Error('failed server-side validation')
      }
    },
    {
      onErrorToast: 'Failed to sign in',
    }
  )

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormInput
            name="email"
            control={form.control}
            placeholder="you@example.com"
            label="Email"
          />
          <FormInput type="password" name="password" control={form.control} label="Password" />
        </div>
        <Button type="submit" loading={submitting} className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  )
}
