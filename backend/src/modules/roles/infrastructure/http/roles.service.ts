import { TYPES } from '@roles/di/types';
import { CreateService } from '@roles/domain/create.service';
import { DeleteRoleService } from '@roles/domain/delete.role.service';
import { GetRoleService } from '@roles/domain/get.role.service';
import {
  CreateRoleInput,
  PaginatedRoles,
  RoleFilterInput,
  UpdateRoleInput,
} from '@roles/domain/inputs/roles.input';
import { ListService } from '@roles/domain/list.service';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';
import { RoleRepository } from '@roles/domain/role.repository';
import { RoleEntity } from '@roles/domain/roles.entity';
import { UpdateRoleService } from '@roles/domain/update.role.service';
import { inject, injectable } from 'inversify';

@injectable()
export class RolesService
  implements
    CreateService,
    ListService,
    GetRoleService,
    UpdateRoleService,
    DeleteRoleService,
    PermissionAssignmentService
{
  constructor(@inject(TYPES.RoleRepository) private readonly roleRepository: RoleRepository) {}

  getListRoles(filter: RoleFilterInput): Promise<PaginatedRoles> {
    return this.roleRepository.getAll(filter);
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    return await this.roleRepository.findByName(name);
  }

  async create(data: CreateRoleInput): Promise<RoleEntity> {
    return await this.roleRepository.create(data);
  }

  async getRole(id: number): Promise<RoleEntity | null> {
    return this.roleRepository.findById(id);
  }

  async update(id: number, data: UpdateRoleInput): Promise<RoleEntity> {
    return this.roleRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.roleRepository.delete(id);
  }

  async addPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    return this.roleRepository.addPermissions(roleId, permissionIds);
  }

  async removePermissions(roleId: number, permissionIds: number[]): Promise<void> {
    return this.roleRepository.removePermissions(roleId, permissionIds);
  }

  async countUsersWithRole(roleId: number): Promise<number> {
    return this.roleRepository.countUsersWithRole(roleId);
  }
}
