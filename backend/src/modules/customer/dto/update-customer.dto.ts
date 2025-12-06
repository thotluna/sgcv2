import { CustomerState } from '@prisma/client';

export class UpdateCustomerDto {
  code?: string;
  businessName?: string;
  legalName?: string;
  taxId?: string;
  address?: string;
  phone?: string;
  state?: CustomerState;
}
