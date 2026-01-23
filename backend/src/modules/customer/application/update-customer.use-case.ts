import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { UpdateCustomerInput } from '@customer/domain/inputs/customer.input';
import { CustomerEntity } from '@customer/domain/customer.entity';
import { UpdateCustomerService } from '@customer/domain/update-customer.service';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from '@customer/domain/exceptions/customer-already-exists.exception';

@injectable()
export class UpdateCustomerUseCase {
  constructor(
    @inject(TYPES.UpdateCustomerService) private customerService: UpdateCustomerService
  ) {}

  async execute(id: string, data: UpdateCustomerInput): Promise<CustomerEntity> {
    const customer = await this.customerService.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    if (data.taxId && data.taxId !== customer.taxId) {
      const existingByTaxId = await this.customerService.findByTaxId(data.taxId);
      if (existingByTaxId && existingByTaxId.id !== id) {
        throw new CustomerAlreadyExistsException('taxId', data.taxId);
      }
    }

    return this.customerService.update(id, data);
  }
}
