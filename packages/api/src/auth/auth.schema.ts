import { z } from 'zod'

export const validateCodeClient = z.object({
  body: z.object({
    clientCode: z
      .string()
      .regex(
        /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
        {
          message:
            'Formato invalido, ingrese 4 grupos de 8 caracteres alfanuméricos y especiales separados por guiones.',
        },
      ),
  }),
})

export const validateSingUp = z.object({
  body: z.object({
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
      .max(36, 'La contraseña no puede tener más de 36 caracteres'),
  }),
})
