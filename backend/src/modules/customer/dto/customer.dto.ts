import { CustomerState } from '@prisma/client';

export class CustomerDto {
  id!: string;
  code!: string;
  businessName!: string;
  legalName!: string;
  taxId!: string;
  address!: string;
  phone!: string;
  state!: CustomerState;
  createdAt!: Date;
  updatedAt!: Date;
}
