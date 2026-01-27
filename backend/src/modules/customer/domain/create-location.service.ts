import { CustomerEntity } from '@customer/domain/customer.entity';
import { CreateLocationInput } from '@customer/domain/inputs/location.input';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';

export interface CreateLocationService {
  create(data: CreateLocationInput): Promise<CustomerLocationEntity>;
  findCustomerById(id: string): Promise<CustomerEntity | null>;
  findSubCustomerById(id: string): Promise<SubCustomerEntity | null>;
}
