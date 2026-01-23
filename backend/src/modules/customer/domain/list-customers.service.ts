import { CustomerFilterInput, PaginatedCustomers } from '@customer/domain/inputs/customer.input';

export interface ListCustomersService {
  findAll(filters: CustomerFilterInput): Promise<PaginatedCustomers>;
}
