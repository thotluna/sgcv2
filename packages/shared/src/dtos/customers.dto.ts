import { CustomerState } from '../types/customers.type';

class BaseCustomerDto {
  code!: string;
  legalName!: string;
  taxId!: string;
  address!: string;
  businessName?: string;
  phone?: string;
}

export class CreateCustomerDto extends BaseCustomerDto {}

export class UpdateCustomerDto extends BaseCustomerDto {
  state?: CustomerState;
}

export class CustomerDto extends BaseCustomerDto {
  id!: string;
  state!: CustomerState;
  createdAt!: Date;
  updatedAt!: Date;
}
