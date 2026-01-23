import { CustomerState, CustomerEntity } from '@customer/domain/customer.entity';

export interface CreateCustomerInput {
  code: string;
  businessName: string;
  legalName: string;
  taxId: string;
  address: string;
  phone?: string | null;
}

export interface UpdateCustomerInput {
  businessName?: string;
  legalName?: string;
  taxId?: string;
  address?: string;
  phone?: string | null;
  state?: CustomerState;
}

export interface CustomerFilterInput {
  state?: CustomerState;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCustomers {
  items: CustomerEntity[];
  total: number;
}
