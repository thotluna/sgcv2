export class CustomerAlreadyExistsException extends Error {
  constructor(field: string, value: string) {
    super(`Customer with ${field} '${value}' already exists`);
    this.name = 'CustomerAlreadyExistsException';
  }
}
