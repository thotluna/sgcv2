import { z } from 'zod'
import { validateClientCode } from './auth.handlers'

export const SingformSchemaBase = z.object({
  email: z.string().email('El email no es valido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
  confirmPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
})

export const SingInFormSchema = SingformSchemaBase.omit({
  confirmPassword: true,
})

export const formSchemaBase = z.object({
  clientCode: z
    .string()
    .regex(
      /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
      { message: 'Formato invalido' },
    ),
  email: z.string().email('El email no es valido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
  confirmPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
})

export const SingUpFormSchema = formSchemaBase
  .superRefine(async ({ clientCode }, ctx) => {
    const data = await validateClientCode(clientCode)
    if (data.status !== 'ok') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Error al validar el codigo de cliente',
        path: ['clientCode'],
      })
    }
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      })
    }
  })

export const SingUpFormEntity = formSchemaBase.omit({ confirmPassword: true })
