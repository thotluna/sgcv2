import { AUTH_ERROR, PROVIDER_ERROR, VALIDATION_ERROR } from './errors'
import { z } from 'zod'

export const customerCodeSchema = z.object({
  code: z.string({
    required_error: AUTH_ERROR.CLIENT_CODE_REQUIRED,
  }),
})

export const httpCustomerCodeSchema = z.object({
  body: customerCodeSchema,
})

export const httpEmailCodeSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: VALIDATION_ERROR.EMAIL_REQUIRED })
      .email(VALIDATION_ERROR.EMAIL_INVALID),
  }),
})

export const signInSchema = z.object({
  email: z.string().email(VALIDATION_ERROR.EMAIL_INVALID),
  password: z
    .string()
    .min(8, VALIDATION_ERROR.PASSWORD_MIN_LENGTH)
    .max(36, VALIDATION_ERROR.PASSWORD_MAX_LENGTH),
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
            message: PROVIDER_ERROR.PROVIDER_INVALID,
          }
        }
        return { message: ctx.defaultError }
      },
    }),
  }),
})
