import { validateClientCode } from './auth.handlers'
import { z } from 'zod'

// export const SingformSchemaBase = z.object({
//   email: z.string().email('email_invalid'),
//   password: z
//     .string()
//     .min(8, 'password_min_length')
//     .max(50, 'password_max_length'),
//   confirmPassword: z
//     .string()
//     .min(8, 'password_min_length')
//     .max(50, 'password_max_length'),
// })

// export const SingInFormSchema = SingformSchemaBase.omit({
//   confirmPassword: true,
// })

// export const formSchemaBase = z.object({
//   clientCode: z
//     .string()
//     .regex(
//       /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
//       { message: 'client_code_invalid_format' },
//     ),
//   email: z.string().email('email_invalid'),
//   password: z
//     .string()
//     .min(8, 'password_min_length')
//     .max(50, 'password_max_length'),
//   confirmPassword: z
//     .string()
//     .min(8, 'password_min_length')
//     .max(50, 'password_max_length'),
// })

// export const SingUpFormSchema = formSchemaBase
//   .superRefine(async ({ clientCode }, ctx) => {
//     const data = await validateClientCode(clientCode)
//     if (data.status !== 'success') {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'client_code_invalid_validation',
//         path: ['clientCode'],
//       })
//     }
//   })
//   .superRefine((data, ctx) => {
//     if (data.password !== data.confirmPassword) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'password_not_match',
//         path: ['confirmPassword'],
//       })
//     }
//   })

// export const SingUpFormEntity = formSchemaBase.omit({ confirmPassword: true })

export function getSignInFormSchema(t?: (key: string) => string) {
  return z.object({
    email: z.string().email(t?.('email_invalid') || 'email_invalid'),
    password: z
      .string()
      .min(8, t?.('password_min_length') || 'password_min_length')
      .max(50, t?.('password_max_length') || 'password_max_length'),
  })
}

export type SignInFormSchemaType = z.infer<
  Awaited<ReturnType<typeof getSignInFormSchema>>
>

export function getSignUpFormSchema(t?: (key: string) => string) {
  return z
    .object({
      clientCode: z.string(),
      // .regex(
      //   /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
      //   { message: t?.('client_code_invalid_format') || 'client_code_invalid_format' },
      // ),
      email: z.string().email(t?.('email_invalid') || 'email_invalid'),
      password: z
        .string()
        .min(8, t?.('password_min_length') || 'password_min_length')
        .max(50, t?.('password_max_length') || 'password_max_length'),
      confirmPassword: z
        .string()
        .min(8, t?.('password_min_length') || 'password_min_length')
        .max(50, t?.('password_max_length') || 'password_max_length'),
    })
    .superRefine(async ({ clientCode }, ctx) => {
      const data = await validateClientCode(clientCode)
      console.log({ data, error: data.message })
      if (data.status !== 'success') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: data.message,
          path: ['clientCode'],
        })
      }
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t?.('password_not_match') || 'password_not_match',
          path: ['confirmPassword'],
        })
      }
    })
}
