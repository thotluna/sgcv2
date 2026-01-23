import { z } from 'zod';
import { CustomerState } from '@customer/domain/customer.entity';

export const UpdateCustomerSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name must not be empty')
    .max(255, 'Business name must be at most 255 characters')
    .optional(),
  legalName: z
    .string()
    .min(1, 'Legal name must not be empty')
    .max(255, 'Legal name must be at most 255 characters')
    .optional(),
  taxId: z
    .string()
    .min(1, 'Tax ID must not be empty')
    .max(50, 'Tax ID must be at most 50 characters')
    .optional(),
  address: z
    .string()
    .min(1, 'Address must not be empty')
    .max(500, 'Address must be at most 500 characters')
    .optional(),
  phone: z.string().max(20, 'Phone must be at most 20 characters').optional().nullable(),
  state: z.nativeEnum(CustomerState).optional(),
});

export type UpdateCustomerSchemaType = z.infer<typeof UpdateCustomerSchema>;
