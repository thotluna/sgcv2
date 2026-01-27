import { UpdateSubCustomerInput } from '@customer/domain/inputs/subcustomer.input';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';

export interface UpdateSubCustomerService {
  update(id: string, data: UpdateSubCustomerInput): Promise<SubCustomerEntity>;
  findById(id: string): Promise<SubCustomerEntity | null>;
  findByExternalCode(customerId: string, externalCode: string): Promise<SubCustomerEntity | null>;
}
