import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be at most 50 characters'),
  businessName: z.string().min(1, 'Business name is required').max(255, 'Business name must be at most 255 characters'),
  legalName: z.string().min(1, 'Legal name is required').max(255, 'Legal name must be at most 255 characters'),
  taxId: z.string().min(1, 'Tax ID is required').max(50, 'Tax ID must be at most 50 characters'),
  address: z.string().min(1, 'Address is required').max(500, 'Address must be at most 500 characters'),
  phone: z.string().max(20, 'Phone must be at most 20 characters').optional(),
});

export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;
