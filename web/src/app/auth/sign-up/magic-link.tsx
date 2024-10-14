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
  fullName: z
    .string()
    .min(1, 'Required field')
    .max(100, 'Full name can be at most 100 charactes long')
    .trim(),
})

type InputType = z.infer<typeof schema>

export default function SignUpMagicLink() {
  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      fullName: '',
    },
  })

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<InputType>>(
    async data => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          data: { full_name: data.fullName },
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
        <div className="space-y-2">
          <FormInput
            name="email"
            control={form.control}
            placeholder="you@example.com"
            label="Email"
            description="A sign up link will be send to this email. Upon clicking it, you will be logged into the system."
          />
          <FormInput
            name="fullName"
            control={form.control}
            placeholder="Name Surname"
            label="Full name"
          />
        </div>
        <Button type="submit" loading={submitting} className="w-full">
          Send link
        </Button>
      </form>
    </Form>
  )
}
