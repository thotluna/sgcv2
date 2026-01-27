import {
  CreateSubCustomerInput,
  PaginatedSubCustomers,
  SubCustomerFilterInput,
  UpdateSubCustomerInput,
} from '@customer/domain/inputs/subcustomer.input';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';

export interface SubCustomerRepository {
  create(data: CreateSubCustomerInput): Promise<SubCustomerEntity>;
  findAll(filters: SubCustomerFilterInput, customerId?: string): Promise<PaginatedSubCustomers>;
  findById(id: string): Promise<SubCustomerEntity | null>;
  findByExternalCode(customerId: string, externalCode: string): Promise<SubCustomerEntity | null>;
  update(id: string, data: UpdateSubCustomerInput): Promise<SubCustomerEntity>;
  delete(id: string): Promise<SubCustomerEntity>;
}
