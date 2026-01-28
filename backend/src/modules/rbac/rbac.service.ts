// src/modules/rbac/rbac.service.ts
import { TYPES } from '@modules/rbac/di/types';
import { RbacRepository } from '@modules/rbac/domain/rbac.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class RbacService {
  constructor(
    @inject(TYPES.RbacRepository)
    private readonly rbacRepository: RbacRepository
  ) {}

  /**
   * Retrieve all permissions assigned to a user (through its roles).
   * Returns an array of objects { resource: string, action: string }.
   */
  async getUserPermissions(userId: number) {
    return this.rbacRepository.getUserPermissions(userId);
  }

  /**
   * Check if a user has a specific permission.
   */
  async hasPermission(userId: number, resource: string, action: string): Promise<boolean> {
    const perms = await this.getUserPermissions(userId);
    return perms.some(p => p.resource === resource && p.action === action);
  }

  /**
   * Check if a user has at least one of the specified roles.
   */
  async hasRole(userId: number, ...roleNames: string[]): Promise<boolean> {
    return this.rbacRepository.hasRole(userId, roleNames);
  }
}
