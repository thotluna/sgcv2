export interface RbacRepository {
  getUserPermissions(userId: number): Promise<{ resource: string; action: string }[]>;
  hasRole(userId: number, roleNames: string[]): Promise<boolean>;
}
