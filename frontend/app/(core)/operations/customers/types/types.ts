import z from 'zod';
import {
  CreateCustomerSchema as createSchema,
  UpdateCustomerSchema as updateSchema,
} from '@sgcv2/shared';

export type CreateCustomerFormData = z.infer<typeof createSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateSchema>;
export type CustomerFormData = CreateCustomerFormData | UpdateCustomerFormData;
