import { z } from 'zod';
import { CustomerState } from '@customer/domain/customer.entity';

export const CustomerFilterSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  perPage: z.string().regex(/^\d+$/).transform(Number).optional(),
  state: z.nativeEnum(CustomerState).optional(),
  search: z.string().max(255).optional(),
});

export type CustomerFilterSchemaType = z.infer<typeof CustomerFilterSchema>;
