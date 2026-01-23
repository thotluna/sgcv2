import { CustomerEntity } from '@customer/domain/customer.entity';

export interface GetCustomerService {
  findById(id: string): Promise<CustomerEntity | null>;
}
