import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { CustomerFilterInput, PaginatedCustomers } from '../domain/inputs/customer.input';
import { ListCustomersService } from '../domain/list-customers.service';

@injectable()
export class ListCustomersUseCase {
  constructor(@inject(TYPES.ListCustomersService) private customerService: ListCustomersService) {}

  async execute(filters: CustomerFilterInput): Promise<PaginatedCustomers> {
    return this.customerService.findAll(filters);
  }
}
