import { CreateCustomerInput } from '@customer/domain/inputs/customer.input';
import { CustomerEntity } from '@customer/domain/customer.entity';

export interface CreateCustomerService {
  findByCode(code: string): Promise<CustomerEntity | null>;
  findByTaxId(taxId: string): Promise<CustomerEntity | null>;
  create(data: CreateCustomerInput): Promise<CustomerEntity>;
}
