import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import {
  SubCustomerFilterInput,
  PaginatedSubCustomers,
} from '@customer/domain/inputs/subcustomer.input';
import { ListSubCustomersService } from '@customer/domain/list-subcustomers.service';

@injectable()
export class ListSubCustomersUseCase {
  constructor(
    @inject(TYPES.ListSubCustomersService) private subCustomerService: ListSubCustomersService
  ) {}

  async execute(
    filters: SubCustomerFilterInput,
    customerId?: string
  ): Promise<PaginatedSubCustomers> {
    return this.subCustomerService.findAll(filters, customerId);
  }
}
