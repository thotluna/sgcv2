import { CustomerEntity } from './customer.entity';

export interface DeleteCustomerService {
  findById(id: string): Promise<CustomerEntity | null>;
  delete(id: string): Promise<CustomerEntity>;
}
