export interface DeleteRoleService {
  delete(id: number): Promise<void>;
  countUsersWithRole(id: number): Promise<number>;
}
