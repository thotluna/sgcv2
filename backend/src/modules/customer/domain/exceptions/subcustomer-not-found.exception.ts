export class SubCustomerNotFoundException extends Error {
  constructor(id: string) {
    super(`SubCustomer with ID ${id} not found`);
    this.name = 'SubCustomerNotFoundException';
  }
}
