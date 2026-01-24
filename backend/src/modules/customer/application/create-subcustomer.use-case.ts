import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CreateSubCustomerInput } from '@customer/domain/inputs/subcustomer.input';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { CreateSubCustomerService } from '@customer/domain/create-subcustomer.service';
import { SubCustomerAlreadyExistsException } from '@customer/domain/exceptions/subcustomer-already-exists.exception';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';

@injectable()
export class CreateSubCustomerUseCase {
  constructor(
    @inject(TYPES.CreateSubCustomerService) private subCustomerService: CreateSubCustomerService
  ) {}

  async execute(data: CreateSubCustomerInput): Promise<SubCustomerEntity> {
    const customer = await this.subCustomerService.findCustomerById(data.customerId);
    if (!customer) {
      throw new CustomerNotFoundException(data.customerId);
    }

    const existingByExternalCode = await this.subCustomerService.findByExternalCode(
      data.customerId,
      data.externalCode
    );

    if (existingByExternalCode) {
      throw new SubCustomerAlreadyExistsException(data.customerId, data.externalCode);
    }

    return this.subCustomerService.create(data);
  }
}
