import { TYPES } from '@roles/di/types';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { RoleEntity } from '@roles/domain/roles.entity';
import { inject, injectable } from 'inversify';

@injectable()
export class GetRoleUseCase {
  constructor(@inject(TYPES.GetRoleService) private readonly service: GetRoleService) {}

  async execute(id: number): Promise<RoleEntity> {
    const role = await this.service.getRole(id);
    if (!role) {
      throw new RoleNotFoundException(id);
    }
    return role;
  }
}
