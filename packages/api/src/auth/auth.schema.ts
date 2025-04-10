import { z } from 'zod'

export const clientCodeSchema = z.object({
  clientCode: z
    .string()
    .regex(
      /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
      { message: 'Formato invalido' },
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
  email: z.string().email('El email no es valido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(36, 'La contraseña no puede tener más de 36 caracteres'),
})

export const singUpSchema = singInSchema.merge(clientCodeSchema)

export const httpSingUpSchema = z.object({
  body: singUpSchema,
})
