import { GetHealthUseCase } from '@modules/support/application/get-health.use-case';
import { TYPES } from '@modules/support/di/types';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class HealthController {
  constructor(
    @inject(TYPES.GetHealthUseCase)
    private readonly getHealthUseCase: GetHealthUseCase
  ) {}

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: API and Database Health Check
   *     tags: [Support]
   *     responses:
   *       200:
   *         description: Server is running and database is connected
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
   *                         status: { type: string, example: ok }
   *                         timestamp: { type: string, format: date-time }
   *                         environment: { type: string, example: development }
   *                         database: { type: string, example: connected }
   *       500:
   *         description: Server error or database disconnected
   */
  async getHealth(_req: Request, res: Response): Promise<Response> {
    const health = await this.getHealthUseCase.execute();
    const statusCode = health.status === 'ok' ? 200 : 500;
    return ResponseHelper.success(res, health, statusCode);
  }
}
