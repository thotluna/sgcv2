import { LocationFilterInput, PaginatedLocations } from '@customer/domain/inputs/location.input';

export interface ListLocationsService {
  findAll(filters: LocationFilterInput, customerId?: string): Promise<PaginatedLocations>;
}
