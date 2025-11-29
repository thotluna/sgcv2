import { CustomerState } from '@prisma/client';

export class UpdateCustomerDto {
  businessName?: string;
  legalName?: string;
  taxId?: string;
  address?: string;
  phone?: string;
  state?: CustomerState;
}
