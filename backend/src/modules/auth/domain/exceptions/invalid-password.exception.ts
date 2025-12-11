export class InvalidPasswordException extends Error {
  constructor() {
    super('Invalid username, password');
    this.name = 'InvalidPasswordException';
  }
}
