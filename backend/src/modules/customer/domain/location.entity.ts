export interface CustomerLocationEntity {
  id: string;
  customerId: string;
  subCustomerId: string | null;
  name: string;
  address: string;
  city: string;
  zipCode: string | null;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}
