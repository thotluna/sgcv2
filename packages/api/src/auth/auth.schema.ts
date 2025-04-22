import { z } from 'zod'

export const clientCodeSchema = z.object({
  clientCode: z
    .string()
    .regex(
      /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
      { message: 'Codigo de cliente tiene un formato invalido' },
    ),
})

export const httpClientCodeSchema = z.object({
  body: clientCodeSchema,
})

export const singInSchema = z.object({
  email: z.string().email('El email no es valido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(36, 'La contraseña no puede tener más de 36 caracteres'),
})

export const httpSingInSchema = z.object({
  body: singInSchema,
})

export const singUpSchema = singInSchema.merge(clientCodeSchema)

export const httpSingUpSchema = z.object({
  body: singUpSchema,
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
