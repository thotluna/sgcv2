import { CustomerState } from '@sgcv2/shared';

export { CustomerState };

export interface CustomerEntity {
  id: string;
  code: string;
  businessName: string | null;
  legalName: string;
  taxId: string;
  address: string | null;
  phone?: string | null;
  state: CustomerState;
  createdAt: Date;
  updatedAt: Date;
}
