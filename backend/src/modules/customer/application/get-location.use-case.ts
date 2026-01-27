import { TYPES } from '@customer/di/types';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';
import { GetLocationService } from '@customer/domain/get-location.service';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { inject, injectable } from 'inversify';

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
