import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { GetLocationService } from '@customer/domain/get-location.service';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';

@injectable()
export class GetLocationUseCase {
  constructor(@inject(TYPES.GetLocationService) private locationService: GetLocationService) {}

  async execute(id: string): Promise<CustomerLocationEntity> {
    const location = await this.locationService.findById(id);
    if (!location) {
      throw new LocationNotFoundException(id);
    }

    return location;
  }
}
