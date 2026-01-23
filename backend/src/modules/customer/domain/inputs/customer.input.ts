import { CustomerState, CustomerEntity } from '../customer.entity';

export interface CreateCustomerInput {
  code: string;
  businessName: string;
  legalName: string;
  taxId: string;
  address: string;
  phone?: string;
}

export interface UpdateCustomerInput {
  businessName?: string;
  legalName?: string;
  taxId?: string;
  address?: string;
  phone?: string;
  state?: CustomerState | string;
}

export interface CustomerFilterInput {
  state?: CustomerState | string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCustomers {
  items: CustomerEntity[];
  total: number;
}
