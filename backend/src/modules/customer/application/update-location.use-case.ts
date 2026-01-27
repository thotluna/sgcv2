import { TYPES } from '@customer/di/types';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';
import { UpdateLocationInput } from '@customer/domain/inputs/location.input';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { UpdateLocationService } from '@customer/domain/update-location.service';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateLocationUseCase {
  constructor(
    @inject(TYPES.UpdateLocationService) private locationService: UpdateLocationService
  ) {}

  async execute(id: string, data: UpdateLocationInput): Promise<CustomerLocationEntity> {
    const location = await this.locationService.findById(id);
    if (!location) {
      throw new LocationNotFoundException(id);
    }

    return this.locationService.update(id, data);
  }
}
