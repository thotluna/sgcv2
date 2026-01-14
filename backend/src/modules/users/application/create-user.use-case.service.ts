import { inject, injectable } from 'inversify';
import { TYPES } from '@users/di/types';
import { CreateUserInput } from '@users/domain/dtos/user.dtos';
import { UserEntity } from '@users/domain/user-entity';
import bcrypt from 'bcrypt';
import { CreateUserService } from '../domain/create.service';

@injectable()
export class CreateUserUseCaseService {
  constructor(@inject(TYPES.CreateUserService) private readonly userService: CreateUserService) {}

  async execute(data: CreateUserInput): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.userService.create({
      ...data,
      password: passwordHash,
    });
  }
}
