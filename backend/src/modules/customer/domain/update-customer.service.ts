import { UpdateCustomerInput } from './inputs/customer.input';
import { CustomerEntity } from './customer.entity';

export interface UpdateCustomerService {
  findById(id: string): Promise<CustomerEntity | null>;
  findByTaxId(taxId: string): Promise<CustomerEntity | null>;
  update(id: string, data: UpdateCustomerInput): Promise<CustomerEntity>;
}
