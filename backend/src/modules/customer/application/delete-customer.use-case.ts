import { TYPES } from '@customer/di/types';
import { CustomerEntity } from '@customer/domain/customer.entity';
import { DeleteCustomerService } from '@customer/domain/delete-customer.service';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteCustomerUseCase {
  constructor(
    @inject(TYPES.DeleteCustomerService) private customerService: DeleteCustomerService
  ) {}

  async execute(id: string): Promise<CustomerEntity> {
    const customer = await this.customerService.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return this.customerService.delete(id);
  }
}
