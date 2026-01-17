import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { ListUsersService } from '@users/domain/list.service';
import { PaginatedUsers, UserFilterInput } from '@users/domain/dtos/user.dtos';

@injectable()
export class ListUseCase {
  constructor(@inject(TYPES.ListUsersService) private readonly service: ListUsersService) {}

  async execute(filter: UserFilterInput): Promise<PaginatedUsers> {
    return this.service.getAll(filter);
  }
}
