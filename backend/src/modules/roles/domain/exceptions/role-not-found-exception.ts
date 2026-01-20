export class RoleNotFoundException extends Error {
  constructor(id: number | string) {
    super(`Role with id ${id} not found`);
    this.name = 'RoleNotFoundException';
  }
}
