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
