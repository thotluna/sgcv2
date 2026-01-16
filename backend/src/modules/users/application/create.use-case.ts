import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { CreateUserInput } from '@users/domain/dtos/user.dtos';
import { UserEntity } from '@users/domain/user-entity';
import { CreateUserService } from '@users/domain/create.service';
import { PasswordHasher } from '@modules/auth/domain/password-hasher';
import { TYPES as AuthTypes } from '@modules/auth/di/types';

@injectable()
export class CreateUseCase {
  constructor(
    @inject(TYPES.CreateUserService) private readonly service: CreateUserService,
    @inject(AuthTypes.PasswordHasher) private readonly hasher: PasswordHasher
  ) {}

  async execute(data: CreateUserInput): Promise<UserEntity> {
    const passwordHash = await this.hasher.hashPassword(data.password);

    return this.service.create({
      ...data,
      password: passwordHash,
    });
  }
}
