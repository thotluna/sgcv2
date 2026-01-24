import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';

export interface CreateSubCustomerInput {
  customerId: string;
  businessName: string;
  externalCode: string;
}

export interface UpdateSubCustomerInput {
  businessName?: string;
  externalCode?: string;
}

export interface SubCustomerFilterInput {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSubCustomers {
  items: SubCustomerEntity[];
  total: number;
}
