import { z } from 'zod'

//  sign up
export const signUpSchema = z
  .object({
    email: z.string().email().trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 charactes long')
      .max(50, 'Password can be at most 50 charactes long'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 charactes long')
      .max(50, 'Password can be at most 50 charactes long'),
    fullName: z
      .string()
      .min(1, 'Required field')
      .max(100, 'Full name can be at most 100 charactes long')
      .trim(),
  })
  .refine(data => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

//  sign in
export const signInSchema = z.object({
  email: z.string().email().trim(),
  password: z.string(),
})

export type SignInInput = z.infer<typeof signInSchema>
