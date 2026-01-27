import { TYPES } from '@customer/di/types';
import { DeleteSubCustomerService } from '@customer/domain/delete-subcustomer.service';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteSubCustomerUseCase {
  constructor(
    @inject(TYPES.DeleteSubCustomerService) private subCustomerService: DeleteSubCustomerService
  ) {}

  async execute(id: string): Promise<SubCustomerEntity> {
    const subCustomer = await this.subCustomerService.findById(id);
    if (!subCustomer) {
      throw new SubCustomerNotFoundException(id);
    }

    return this.subCustomerService.delete(id);
  }
}
