import { TYPES } from '@customer/di/types';
import { LocationFilterInput, PaginatedLocations } from '@customer/domain/inputs/location.input';
import { ListLocationsService } from '@customer/domain/list-locations.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ListLocationsUseCase {
  constructor(@inject(TYPES.ListLocationsService) private locationService: ListLocationsService) {}

  async execute(filters: LocationFilterInput, customerId?: string): Promise<PaginatedLocations> {
    return this.locationService.findAll(filters, customerId);
  }
}
