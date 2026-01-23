import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { UpdateCustomerInput } from '../domain/inputs/customer.input';
import { CustomerEntity } from '../domain/customer.entity';
import { UpdateCustomerService } from '../domain/update-customer.service';
import { CustomerNotFoundException } from '../domain/exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from '../domain/exceptions/customer-already-exists.exception';

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
