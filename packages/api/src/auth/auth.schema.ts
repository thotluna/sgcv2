import { z } from 'zod'

export const clientCodeSchema = z.object({
  clientCode: z
    .string()
    .regex(
      /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
      { message: 'auth_error_invalid_client_code' },
    ),
})

export const httpClientCodeSchema = z.object({
  body: clientCodeSchema,
})

export const signInSchema = z.object({
  email: z.string().email('El email no es valido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(36, 'La contraseña no puede tener más de 36 caracteres'),
})

export const httpSingInSchema = z.object({
  body: signInSchema,
})

export const signUpSchema = signInSchema.merge(clientCodeSchema)

export const httpSignUpSchema = z.object({
  body: signUpSchema,
})

export const authorizeSchema = z.object({
  query: z.object({
    provider: z.enum(['google', 'github'], {
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return {
            message: `El provider debe ser 'google' o 'github'. Se recibió: '${ctx.data}'.`,
          }
        }
        return { message: ctx.defaultError }
      },
    }),
  }),
})
