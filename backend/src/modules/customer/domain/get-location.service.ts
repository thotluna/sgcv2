import { CustomerLocationEntity } from '@customer/domain/location.entity';

export interface GetLocationService {
  findById(id: string): Promise<CustomerLocationEntity | null>;
}
