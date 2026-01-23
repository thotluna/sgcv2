import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { GetHealthUseCase } from '@modules/support/application/get-health.use-case';
import { TYPES } from '@modules/support/di/types';

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
   *     summary: Health check de la API y base de datos
   *     tags: [Soporte]
   *     responses:
   *       200:
   *         description: El servidor está funcionando y la base de datos está conectada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: ok }
   *                 timestamp: { type: string, format: date-time }
   *                 environment: { type: string, example: development }
   *                 database: { type: string, example: connected }
   *       500:
   *         description: Error en el servidor o base de datos desconectada
   */
  async getHealth(_req: Request, res: Response): Promise<Response> {
    const health = await this.getHealthUseCase.execute();
    const statusCode = health.status === 'ok' ? 200 : 500;
    return res.status(statusCode).json(health);
  }
}
