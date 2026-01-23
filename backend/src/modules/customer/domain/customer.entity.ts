export enum CustomerState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface CustomerEntity {
  id: string;
  code: string;
  businessName: string | null;
  legalName: string;
  taxId: string;
  address: string | null;
  phone?: string | null;
  state: CustomerState | string;
  createdAt: Date;
  updatedAt: Date;
}
