import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';

export interface DeleteSubCustomerService {
  findById(id: string): Promise<SubCustomerEntity | null>;
  delete(id: string): Promise<SubCustomerEntity>;
}
