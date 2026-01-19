export class RoleInUseException extends Error {
  constructor(id: number, usageCount: number) {
    super(`Cannot delete role with ID ${id} because it is assigned to ${usageCount} users.`);
    this.name = 'RoleInUseException';
  }
}
