import { TYPES } from '@customer/di/types';
import { CreateCustomerService } from '@customer/domain/create-customer.service';
import { CustomerEntity } from '@customer/domain/customer.entity';
import { CustomerRepository } from '@customer/domain/customer.repository';
import { DeleteCustomerService } from '@customer/domain/delete-customer.service';
import { GetCustomerService } from '@customer/domain/get-customer.service';
import {
  CreateCustomerInput,
  CustomerFilterInput,
  PaginatedCustomers,
  UpdateCustomerInput,
} from '@customer/domain/inputs/customer.input';
import { ListCustomersService } from '@customer/domain/list-customers.service';
import { UpdateCustomerService } from '@customer/domain/update-customer.service';
import { inject, injectable } from 'inversify';

@injectable()
export class CustomerService
  implements
    CreateCustomerService,
    ListCustomersService,
    GetCustomerService,
    UpdateCustomerService,
    DeleteCustomerService
{
  constructor(
    @inject(TYPES.CustomerRepository) private readonly customerRepository: CustomerRepository
  ) {}

  async findByCode(code: string): Promise<CustomerEntity | null> {
    return this.customerRepository.findByCode(code);
  }

  async create(data: CreateCustomerInput): Promise<CustomerEntity> {
    return this.customerRepository.create(data);
  }

  async findAll(filters: CustomerFilterInput): Promise<PaginatedCustomers> {
    return this.customerRepository.findAll(filters);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    return this.customerRepository.findById(id);
  }

  async findByTaxId(taxId: string): Promise<CustomerEntity | null> {
    return this.customerRepository.findByTaxId(taxId);
  }

  async update(id: string, data: UpdateCustomerInput): Promise<CustomerEntity> {
    return this.customerRepository.update(id, data);
  }

  async delete(id: string): Promise<CustomerEntity> {
    return this.customerRepository.delete(id);
  }
}
