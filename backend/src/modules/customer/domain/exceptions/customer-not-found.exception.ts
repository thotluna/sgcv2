export class CustomerNotFoundException extends Error {
  constructor(id: string) {
    super(`Customer with ID '${id}' not found`);
    this.name = 'CustomerNotFoundException';
  }
}
