import { CustomerEntity } from './customer.entity';

export interface GetCustomerService {
  findById(id: string): Promise<CustomerEntity | null>;
}
