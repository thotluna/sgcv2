export class CreateCustomerDto {
  code!: string;
  businessName?: string | undefined;
  legalName!: string;
  taxId!: string;
  address!: string;
  phone?: string | undefined;
}
