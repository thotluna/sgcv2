import { CustomerLocationEntity } from '@customer/domain/location.entity';
import {
  CreateLocationInput,
  UpdateLocationInput,
  LocationFilterInput,
  PaginatedLocations,
} from '@customer/domain/inputs/location.input';

export interface LocationRepository {
  create(data: CreateLocationInput): Promise<CustomerLocationEntity>;
  findAll(filters: LocationFilterInput, customerId?: string): Promise<PaginatedLocations>;
  findById(id: string): Promise<CustomerLocationEntity | null>;
  update(id: string, data: UpdateLocationInput): Promise<CustomerLocationEntity>;
  delete(id: string): Promise<CustomerLocationEntity>;
}
