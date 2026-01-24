import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CreateLocationInput } from '@customer/domain/inputs/location.input';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { CreateLocationService } from '@customer/domain/create-location.service';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';

@injectable()
export class CreateLocationUseCase {
  constructor(
    @inject(TYPES.CreateLocationService) private locationService: CreateLocationService
  ) {}

  async execute(data: CreateLocationInput): Promise<CustomerLocationEntity> {
    const customer = await this.locationService.findCustomerById(data.customerId);
    if (!customer) {
      throw new CustomerNotFoundException(data.customerId);
    }

    if (data.subCustomerId) {
      const subCustomer = await this.locationService.findSubCustomerById(data.subCustomerId);
      if (!subCustomer) {
        throw new SubCustomerNotFoundException(data.subCustomerId);
      }
    }

    return this.locationService.create(data);
  }
}
