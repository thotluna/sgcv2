import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { CustomerEntity } from '../domain/customer.entity';
import { DeleteCustomerService } from '../domain/delete-customer.service';
import { CustomerNotFoundException } from '../domain/exceptions/customer-not-found.exception';

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
