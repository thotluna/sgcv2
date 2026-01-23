import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { CustomerRepository } from '../../domain/customer.repository';
import { CreateCustomerService } from '../../domain/create-customer.service';
import { ListCustomersService } from '../../domain/list-customers.service';
import { GetCustomerService } from '../../domain/get-customer.service';
import { UpdateCustomerService } from '../../domain/update-customer.service';
import { DeleteCustomerService } from '../../domain/delete-customer.service';
import { CustomerEntity } from '../../domain/customer.entity';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerFilterInput,
  PaginatedCustomers,
} from '../../domain/inputs/customer.input';

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
