export interface SubCustomerBase {
  id: string;
  customerId: string;
  businessName: string;
  externalCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubCustomerEntity extends SubCustomerBase {
  customer?: {
    legalName: string;
    businessName: string | null;
  };
}
