import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoginUseCaseService } from '@auth/application/login.use-case.service';
import { InvalidPasswordException } from '@auth/domain/exceptions/invalid-password.exception';
import { TYPES } from '@auth/di/types';
import { AuthUserNotFoundException } from '@auth/domain/exceptions/auth-user-not-found.exception';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { LoginDto } from '@sgcv2/shared';
import { TypedRequest } from 'types/express-interfaces/types';

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
        return ResponseHelper.notFound(res, error.message);
      }

      if (error instanceof InvalidPasswordException) {
        return ResponseHelper.unauthorized(res, error.message);
      }

      if (error instanceof Error) {
        return ResponseHelper.internalError(res, error.message);
      }

      return ResponseHelper.internalError(res, 'An error occurred during login');
    }
  }
}
