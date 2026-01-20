export class RoleAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`Role with name ${name} already exists`);
    this.name = 'RoleAlreadyExistsException';
  }
}
