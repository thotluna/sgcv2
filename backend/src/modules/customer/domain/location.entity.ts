export interface CustomerLocationEntity {
  id: string;
  customerId: string;
  subCustomerId: string | null;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
