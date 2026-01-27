import { UpdateLocationInput } from '@customer/domain/inputs/location.input';
import { CustomerLocationEntity } from '@customer/domain/location.entity';

export interface UpdateLocationService {
  update(id: string, data: UpdateLocationInput): Promise<CustomerLocationEntity>;
  findById(id: string): Promise<CustomerLocationEntity | null>;
}
