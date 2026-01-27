import { TYPES } from '@customer/di/types';
import { CreateCustomerService } from '@customer/domain/create-customer.service';
import { CustomerEntity } from '@customer/domain/customer.entity';
import { CustomerAlreadyExistsException } from '@customer/domain/exceptions/customer-already-exists.exception';
import { CreateCustomerInput } from '@customer/domain/inputs/customer.input';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateCustomerUseCase {
  constructor(
    @inject(TYPES.CreateCustomerService) private customerService: CreateCustomerService
  ) {}

  async execute(data: CreateCustomerInput): Promise<CustomerEntity> {
    const existingByCode = await this.customerService.findByCode(data.code);
    if (existingByCode) {
      throw new CustomerAlreadyExistsException('code', data.code);
    }

    const existingByTaxId = await this.customerService.findByTaxId(data.taxId);
    if (existingByTaxId) {
      throw new CustomerAlreadyExistsException('taxId', data.taxId);
    }

    return this.customerService.create(data);
  }
}
