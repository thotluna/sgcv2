import { TYPES } from '@customer/di/types';
import { CustomerEntity } from '@customer/domain/customer.entity';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { GetCustomerService } from '@customer/domain/get-customer.service';
import { inject, injectable } from 'inversify';

@injectable()
export class GetCustomerUseCase {
  constructor(@inject(TYPES.GetCustomerService) private customerService: GetCustomerService) {}

  async execute(id: string): Promise<CustomerEntity> {
    const customer = await this.customerService.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }
}
