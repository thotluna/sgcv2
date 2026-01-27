import { TYPES } from '@customer/di/types';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { GetSubCustomerService } from '@customer/domain/get-subcustomer.service';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { inject, injectable } from 'inversify';

@injectable()
export class GetSubCustomerUseCase {
  constructor(
    @inject(TYPES.GetSubCustomerService) private subCustomerService: GetSubCustomerService
  ) {}

  async execute(id: string): Promise<SubCustomerEntity> {
    const subCustomer = await this.subCustomerService.findById(id);
    if (!subCustomer) {
      throw new SubCustomerNotFoundException(id);
    }
    return subCustomer;
  }
}
