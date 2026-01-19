import { TYPES } from '@roles/di/types';
import { CreateService } from '@roles/domain/create.service';
import { CreateRoleInput, PaginatedRoles, RoleFilterInput } from '@roles/domain/inputs/roles.input';
import { PermissionRepository } from '@roles/domain/permission.repository';
import { RoleRepository } from '@roles/domain/role.repository';
import { PermissionEntity, RoleEntity } from '@roles/domain/roles.entity';
import { inject, injectable } from 'inversify';
import { ListService } from '@roles/domain/list.service';

@injectable()
export class RolesService implements CreateService, ListService {
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
}
