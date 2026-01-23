import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CustomerFilterInput, PaginatedCustomers } from '@customer/domain/inputs/customer.input';
import { ListCustomersService } from '@customer/domain/list-customers.service';

@injectable()
export class ListCustomersUseCase {
  constructor(@inject(TYPES.ListCustomersService) private customerService: ListCustomersService) {}

  async execute(filters: CustomerFilterInput): Promise<PaginatedCustomers> {
    return this.customerService.findAll(filters);
  }
}
