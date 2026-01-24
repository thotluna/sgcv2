import { CustomerLocationEntity } from '@customer/domain/location.entity';

export interface DeleteLocationService {
  delete(id: string): Promise<CustomerLocationEntity>;
  findById(id: string): Promise<CustomerLocationEntity | null>;
}
