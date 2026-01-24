import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { UpdateSubCustomerInput } from '@customer/domain/inputs/subcustomer.input';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { UpdateSubCustomerService } from '@customer/domain/update-subcustomer.service';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { SubCustomerAlreadyExistsException } from '@customer/domain/exceptions/subcustomer-already-exists.exception';

@injectable()
export class UpdateSubCustomerUseCase {
  constructor(
    @inject(TYPES.UpdateSubCustomerService) private subCustomerService: UpdateSubCustomerService
  ) {}

  async execute(id: string, data: UpdateSubCustomerInput): Promise<SubCustomerEntity> {
    const subCustomer = await this.subCustomerService.findById(id);
    if (!subCustomer) {
      throw new SubCustomerNotFoundException(id);
    }

    if (data.externalCode && data.externalCode !== subCustomer.externalCode) {
      const existing = await this.subCustomerService.findByExternalCode(
        subCustomer.customerId,
        data.externalCode
      );
      if (existing) {
        throw new SubCustomerAlreadyExistsException(subCustomer.customerId, data.externalCode);
      }
    }

    return this.subCustomerService.update(id, data);
  }
}
