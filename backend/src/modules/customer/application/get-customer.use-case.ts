import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { CustomerEntity } from '../domain/customer.entity';
import { GetCustomerService } from '../domain/get-customer.service';
import { CustomerNotFoundException } from '../domain/exceptions/customer-not-found.exception';

@injectable()
export class GetCustomerUseCase {
  constructor(
    @inject(TYPES.GetCustomerService) private customerService: GetCustomerService
  ) { }

  async execute(id: string): Promise<CustomerEntity> {
    const customer = await this.customerService.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }
}
