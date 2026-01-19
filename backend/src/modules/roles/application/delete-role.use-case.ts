import { inject, injectable } from 'inversify';
import { DeleteRoleService } from '@roles/domain/delete.role.service';
import { TYPES } from '@roles/di/types';
import { GetRoleService } from '@roles/domain/get.role.service';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { RoleInUseException } from '@roles/domain/exceptions/role-in-use-exception';

@injectable()
export class DeleteRoleUseCase {
  constructor(
    @inject(TYPES.DeleteRoleService) private readonly service: DeleteRoleService,
    @inject(TYPES.GetRoleService) private readonly getService: GetRoleService
  ) {}

  async execute(id: number): Promise<void> {
    const role = await this.getService.getRole(id);
    if (!role) {
      throw new RoleNotFoundException(id);
    }

    const usageCount = await this.service.countUsersWithRole(id);
    if (usageCount > 0) {
      throw new RoleInUseException(id, usageCount);
    }

    await this.service.delete(id);
  }
}
