import z from 'zod';
import { createSchema, updateSchema } from '../_schemas/schemas';

export type CreateCustomerFormData = z.infer<typeof createSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateSchema>;
export type CustomerFormData = CreateCustomerFormData | UpdateCustomerFormData;
