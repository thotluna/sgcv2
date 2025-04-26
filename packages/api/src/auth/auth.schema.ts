import { z } from 'zod'

export const customerCodeSchema = z.object({
  code: z.string({ required_error: 'client_code_required' }),
})

export const httpCustomerCodeSchema = z.object({
  body: customerCodeSchema,
})

export const httpEmailCodeSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email_required' })
      .email('email_invalid'),
  }),
})

export const signInSchema = z.object({
  email: z.string().email('email_invalid'),
  password: z
    .string()
    .min(8, 'password_min_length')
    .max(36, 'password_max_length'),
})

export const httpSingInSchema = z.object({
  body: signInSchema,
})

export const signUpSchema = signInSchema.merge(customerCodeSchema)

export const httpSignUpSchema = z.object({
  body: signUpSchema,
})

export const authorizeSchema = z.object({
  query: z.object({
    provider: z.enum(['google', 'github'], {
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return {
            message: 'provider_invalid',
          }
        }
        return { message: ctx.defaultError }
      },
    }),
  }),
})
