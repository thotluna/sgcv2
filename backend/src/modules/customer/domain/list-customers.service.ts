import { CustomerFilterInput, PaginatedCustomers } from './inputs/customer.input';

export interface ListCustomersService {
  findAll(filters: CustomerFilterInput): Promise<PaginatedCustomers>;
}
