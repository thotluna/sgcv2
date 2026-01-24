import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { CreateSubCustomerInput } from '@customer/domain/inputs/subcustomer.input';
import { CustomerEntity } from '@customer/domain/customer.entity';

export interface CreateSubCustomerService {
  create(data: CreateSubCustomerInput): Promise<SubCustomerEntity>;
  findByExternalCode(customerId: string, externalCode: string): Promise<SubCustomerEntity | null>;
  findCustomerById(id: string): Promise<CustomerEntity | null>;
}
