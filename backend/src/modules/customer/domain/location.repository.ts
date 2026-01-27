import {
  CreateLocationInput,
  LocationFilterInput,
  PaginatedLocations,
  UpdateLocationInput,
} from '@customer/domain/inputs/location.input';
import { CustomerLocationEntity } from '@customer/domain/location.entity';

export interface LocationRepository {
  create(data: CreateLocationInput): Promise<CustomerLocationEntity>;
  findAll(filters: LocationFilterInput, customerId?: string): Promise<PaginatedLocations>;
  findById(id: string): Promise<CustomerLocationEntity | null>;
  update(id: string, data: UpdateLocationInput): Promise<CustomerLocationEntity>;
  delete(id: string): Promise<CustomerLocationEntity>;
}
