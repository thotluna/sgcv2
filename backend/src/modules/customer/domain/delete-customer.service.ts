import { CustomerEntity } from '@customer/domain/customer.entity';

export interface DeleteCustomerService {
  findById(id: string): Promise<CustomerEntity | null>;
  delete(id: string): Promise<CustomerEntity>;
}
