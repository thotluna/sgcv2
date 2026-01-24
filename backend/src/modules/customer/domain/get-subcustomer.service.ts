import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';

export interface GetSubCustomerService {
  findById(id: string): Promise<SubCustomerEntity | null>;
}
