import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { GetSubCustomerService } from '@customer/domain/get-subcustomer.service';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';

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
