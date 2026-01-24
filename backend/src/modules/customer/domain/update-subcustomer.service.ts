import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { UpdateSubCustomerInput } from '@customer/domain/inputs/subcustomer.input';

export interface UpdateSubCustomerService {
  update(id: string, data: UpdateSubCustomerInput): Promise<SubCustomerEntity>;
  findById(id: string): Promise<SubCustomerEntity | null>;
  findByExternalCode(customerId: string, externalCode: string): Promise<SubCustomerEntity | null>;
}
