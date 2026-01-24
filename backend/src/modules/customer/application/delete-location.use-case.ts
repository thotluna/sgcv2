import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { DeleteLocationService } from '@customer/domain/delete-location.service';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';

@injectable()
export class DeleteLocationUseCase {
  constructor(
    @inject(TYPES.DeleteLocationService) private locationService: DeleteLocationService
  ) {}

  async execute(id: string): Promise<CustomerLocationEntity> {
    const location = await this.locationService.findById(id);
    if (!location) {
      throw new LocationNotFoundException(id);
    }

    return this.locationService.delete(id);
  }
}
