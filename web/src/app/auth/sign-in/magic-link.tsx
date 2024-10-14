import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormInput } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/utils/supabase/client'

const schema = z.object({
  email: z.string().email().trim(),
})

type InputType = z.infer<typeof schema>

export default function SignInMagicLink() {
  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<InputType>>(
    async data => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: false,
        },
      })
      if (error) throw error
    },
    {
      onErrorToast: 'Failed to send magic link',
    }
  )

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          name="email"
          control={form.control}
          placeholder="you@example.com"
          label="Email"
          description="A sign in link will be send to this email. Upon clicking it, you will be logged into the system."
        />
        <Button type="submit" loading={submitting} className="w-full">
          Send link
        </Button>
      </form>
    </Form>
  )
}
