import { CustomerEntity } from '@customer/domain/customer.entity';
import {
  CreateCustomerInput,
  CustomerFilterInput,
  PaginatedCustomers,
  UpdateCustomerInput,
} from '@customer/domain/inputs/customer.input';

export interface CustomerRepository {
  create(data: CreateCustomerInput): Promise<CustomerEntity>;
  findAll(filters: CustomerFilterInput): Promise<PaginatedCustomers>;
  findById(id: string): Promise<CustomerEntity | null>;
  findByCode(code: string): Promise<CustomerEntity | null>;
  findByTaxId(taxId: string): Promise<CustomerEntity | null>;
  update(id: string, data: UpdateCustomerInput): Promise<CustomerEntity>;
  delete(id: string): Promise<CustomerEntity>;
}
