import {
  SubCustomerFilterInput,
  PaginatedSubCustomers,
} from '@customer/domain/inputs/subcustomer.input';

export interface ListSubCustomersService {
  findAll(filters: SubCustomerFilterInput, customerId?: string): Promise<PaginatedSubCustomers>;
}
