export class SubCustomerAlreadyExistsException extends Error {
  constructor(customerId: string, externalCode: string) {
    super(
      `SubCustomer with external code ${externalCode} already exists for customer ${customerId}`
    );
    this.name = 'SubCustomerAlreadyExistsException';
  }
}
