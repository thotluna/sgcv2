import { CreateCustomerInput } from './inputs/customer.input';
import { CustomerEntity } from './customer.entity';

export interface CreateCustomerService {
  findByCode(code: string): Promise<CustomerEntity | null>;
  findByTaxId(taxId: string): Promise<CustomerEntity | null>;
  create(data: CreateCustomerInput): Promise<CustomerEntity>;
}
