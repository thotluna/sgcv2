import z from 'zod';
import { createSchema, updateSchema } from '../_schemas/schemas';

export type CreateCustomerFormData = z.infer<typeof createSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateSchema>;
export type CustomerFormData = CreateCustomerFormData | UpdateCustomerFormData;

export type StateCustomer = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export interface Customer {
  id: string;
  code: string;
  businessName?: string;
  legalName: string;
  taxId: string;
  address?: string;
  phone?: string;
  state: StateCustomer;
  createdAt: string;
  updatedAt: string;
}

export type CreateCustomerDto = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'state'>;
export type UpdateCustomerDto = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;
