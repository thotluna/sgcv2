import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { UpdateLocationInput } from '@customer/domain/inputs/location.input';

export interface UpdateLocationService {
  update(id: string, data: UpdateLocationInput): Promise<CustomerLocationEntity>;
  findById(id: string): Promise<CustomerLocationEntity | null>;
}
