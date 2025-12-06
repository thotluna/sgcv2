import z from 'zod';

export const createSchema = z.object({
  code: z
    .string()
    .min(3, { message: 'El código debe tener al menos 3 caracteres' })
    .max(5, { message: 'El código debe tener máximo 5 caracteres' })
    .regex(/^[A-Z0-9]+$/, { message: 'El código solo puede contener letras mayúsculas y números' }),
  businessName: z
    .string()
    .min(3, { message: 'La razón social debe tener al menos 3 caracteres' })
    .max(50, { message: 'La razón social debe tener máximo 50 caracteres' })
    .optional()
    .or(z.literal('')),
  legalName: z
    .string()
    .min(3, { message: 'El nombre legal debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre legal debe tener máximo 100 caracteres' }),
  taxId: z
    .string()
    .regex(/^[VEPJG]-[0-9]{8}-[0-9]$/, { message: 'Formato inválido. Debe ser: V-12345678-9' }),
  address: z
    .string()
    .min(3, { message: 'La dirección debe tener al menos 3 caracteres' })
    .max(255, { message: 'La dirección debe tener máximo 255 caracteres' }),
  phone: z
    .string()
    .min(10, { message: 'El teléfono debe tener al menos 10 caracteres' })
    .max(15, { message: 'El teléfono debe tener máximo 15 caracteres' })
    .optional()
    .or(z.literal('')),
});

export const updateSchema = createSchema.extend({
  state: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});
