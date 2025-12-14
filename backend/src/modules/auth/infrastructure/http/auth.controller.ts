import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoginUseCaseService } from '@auth/application/login.use-case.service';
import { InvalidPasswordException } from '@auth/domain/exceptions/invalid-password.exception';
import { TYPES } from '@auth/di/types';
import { AuthUserNotFoundException } from '@auth/domain/exceptions/auth-user-not-found.exception';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { LoginDto } from '@sgcv2/shared';
import { TypedRequest } from 'types/express-interfaces/types';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';

@injectable()
export class AuthController {
  private loginUseCaseService: LoginUseCaseService;
  constructor(@inject(TYPES.LoginUseCaseService) loginUseCaseService: LoginUseCaseService) {
    this.loginUseCaseService = loginUseCaseService;
  }

  async login(req: TypedRequest<LoginDto>, res: Response): Promise<Response> {
    const dto: LoginDto = req.body;

    try {
      const userTokenDto = await this.loginUseCaseService.execute(dto);
      return ResponseHelper.success(res, userTokenDto);
    } catch (error) {
      if (error instanceof AuthUserNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvalidPasswordException) {
        throw new UnauthorizedException(error.message);
      }

      throw error;
    }
  }
}
