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
import { ListPermissionsService } from '@roles/domain/list-permissions.service';
import { PermissionRepository } from '@roles/domain/permission.repository';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';
import { RoleRepository } from '@roles/domain/role.repository';
import { PermissionEntity, RoleEntity } from '@roles/domain/roles.entity';
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
    ListPermissionsService,
    PermissionAssignmentService
{
  constructor(
    @inject(TYPES.RoleRepository) private readonly roleRepository: RoleRepository,
    @inject(TYPES.PermissionRepository) private readonly permissionRepository: PermissionRepository
  ) {}

  getListRoles(filter: RoleFilterInput): Promise<PaginatedRoles> {
    return this.roleRepository.getAll(filter);
  }
  async findPermissionById(id: number): Promise<PermissionEntity | null> {
    return await this.permissionRepository.findById(id);
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

  async getAllPermissions(): Promise<PermissionEntity[]> {
    return this.permissionRepository.getAll();
  }
}
