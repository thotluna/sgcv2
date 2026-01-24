import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { SubCustomerRepository } from '@customer/domain/subcustomer.repository';
import { CustomerRepository } from '@customer/domain/customer.repository';
import { CreateSubCustomerService } from '@customer/domain/create-subcustomer.service';
import { ListSubCustomersService } from '@customer/domain/list-subcustomers.service';
import { GetSubCustomerService } from '@customer/domain/get-subcustomer.service';
import { UpdateSubCustomerService } from '@customer/domain/update-subcustomer.service';
import { DeleteSubCustomerService } from '@customer/domain/delete-subcustomer.service';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { CustomerEntity } from '@customer/domain/customer.entity';
import {
  CreateSubCustomerInput,
  UpdateSubCustomerInput,
  SubCustomerFilterInput,
  PaginatedSubCustomers,
} from '@customer/domain/inputs/subcustomer.input';

@injectable()
export class SubCustomerService
  implements
    CreateSubCustomerService,
    ListSubCustomersService,
    GetSubCustomerService,
    UpdateSubCustomerService,
    DeleteSubCustomerService
{
  constructor(
    @inject(TYPES.SubCustomerRepository)
    private readonly subCustomerRepository: SubCustomerRepository,
    @inject(TYPES.CustomerRepository)
    private readonly customerRepository: CustomerRepository
  ) {}

  async findByExternalCode(
    customerId: string,
    externalCode: string
  ): Promise<SubCustomerEntity | null> {
    return this.subCustomerRepository.findByExternalCode(customerId, externalCode);
  }

  async create(data: CreateSubCustomerInput): Promise<SubCustomerEntity> {
    return this.subCustomerRepository.create(data);
  }

  async findAll(
    filters: SubCustomerFilterInput,
    customerId?: string
  ): Promise<PaginatedSubCustomers> {
    return this.subCustomerRepository.findAll(filters, customerId);
  }

  async findById(id: string): Promise<SubCustomerEntity | null> {
    return this.subCustomerRepository.findById(id);
  }

  async findCustomerById(id: string): Promise<CustomerEntity | null> {
    return this.customerRepository.findById(id);
  }

  async update(id: string, data: UpdateSubCustomerInput): Promise<SubCustomerEntity> {
    return this.subCustomerRepository.update(id, data);
  }

  async delete(id: string): Promise<SubCustomerEntity> {
    return this.subCustomerRepository.delete(id);
  }
}
