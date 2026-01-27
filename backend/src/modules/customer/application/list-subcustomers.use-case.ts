import { TYPES } from '@customer/di/types';
import {
  PaginatedSubCustomers,
  SubCustomerFilterInput,
} from '@customer/domain/inputs/subcustomer.input';
import { ListSubCustomersService } from '@customer/domain/list-subcustomers.service';
import { inject, injectable } from 'inversify';

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
