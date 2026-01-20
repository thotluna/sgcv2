export class PermissionNotFoundException extends Error {
  constructor(id: number | string) {
    super(`Permission with id ${id} not found`);
    this.name = 'PermissionNotFoundException';
  }
}
