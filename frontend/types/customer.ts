export interface Customer {
  id: string;
  code: string;
  businessName?: string;
  legalName: string;
  taxId: string;
  address?: string;
  phone?: string;
  state: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}
