import { validateCustomerCode } from './auth.handlers'
import { z } from 'zod'

export function getSignInFormSchema(t?: (key: string) => string) {
  return z.object({
    email: z.string().email(t?.('email_invalid') || 'email_invalid'),
    password: z
      .string()
      .min(8, t?.('password_min_length') || 'password_min_length')
      .max(50, t?.('password_max_length') || 'password_max_length')
  })
}
export type SignInFormSchemaType = z.infer<
  Awaited<ReturnType<typeof getSignInFormSchema>>
>
export function getSignUpFormSchema(t?: (key: string) => string) {
  return z
    .object({
      code: z
        .string()
        .min(1, t?.('customer_code_required') || 'customer_code_required'),
      email: z.string().email(t?.('email_invalid') || 'email_invalid'),
      password: z
        .string()
        .min(8, t?.('password_min_length') || 'password_min_length')
        .max(50, t?.('password_max_length') || 'password_max_length'),
      confirmPassword: z
        .string()
        .min(8, t?.('password_min_length') || 'password_min_length')
        .max(50, t?.('password_max_length') || 'password_max_length')
    })
    .superRefine(async ({ code }, ctx) => {
      const data = await validateCustomerCode(code)
      if (data.status !== 'success') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: data.message,
          path: ['code']
        })
      }
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t?.('password_not_match') || 'password_not_match',
          path: ['confirmPassword']
        })
      }
    })
}
export type SignUpFormSchemaType = z.infer<
  Awaited<ReturnType<typeof getSignUpFormSchema>>
>
