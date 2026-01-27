import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoginUseCaseService } from '@auth/application/login.use-case.service';
import { InvalidPasswordException } from '@auth/domain/exceptions/invalid-password.exception';
import { TYPES } from '@auth/di/types';
import { AuthUserNotFoundException } from '@auth/domain/exceptions/auth-user-not-found.exception';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { LoginDto } from '@sgcv2/shared';
import { TypedRequest } from 'types/express-interfaces/types';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { AuthMapper } from './mapper';

@injectable()
export class AuthController {
  private loginUseCaseService: LoginUseCaseService;
  constructor(@inject(TYPES.LoginUseCaseService) loginUseCaseService: LoginUseCaseService) {
    this.loginUseCaseService = loginUseCaseService;
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: User Login
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginDto'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         user:
   *                           $ref: '#/components/schemas/AuthenticatedUserDto'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async login(req: TypedRequest<LoginDto>, res: Response): Promise<Response> {
    const dto: LoginDto = req.body;

    try {
      const { user, token } = await this.loginUseCaseService.execute(dto);

      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: false, // Force false for local dev
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      const authenticatedUser = AuthMapper.toAuthenticatedUserDto(user);
      return ResponseHelper.success(res, { user: authenticatedUser, token });
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

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: User Logout
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Logged out successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         message:
   *                           type: string
   *                           example: Logged out successfully
   */
  async logout(_req: Request, res: Response): Promise<Response> {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return ResponseHelper.success(res, { message: 'Logged out successfully' });
  }
}
