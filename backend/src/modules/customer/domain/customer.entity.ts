export enum CustomerState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface CustomerEntity {
  id: string;
  code: string;
  businessName: string;
  legalName: string;
  taxId: string;
  address: string;
  phone?: string | null;
  state: CustomerState | string;
  createdAt: Date;
  updatedAt: Date;
}
