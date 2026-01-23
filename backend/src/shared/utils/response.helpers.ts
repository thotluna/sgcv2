import { Response } from 'express';
import { AppResponse, Metadata, Pagination } from '@sgcv2/shared';
// import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           description: Dynamic response payload
 *         metadata:
 *           type: object
 *           description: Optional metadata (timestamp, request_id)
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         perPage:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 100
 *         totalPages:
 *           type: integer
 *           example: 10
 */
export class ResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    metadata?: Partial<Metadata>
  ): Response {
    const response: AppResponse<T> = {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    };

    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T,
    pagination: Pagination,
    statusCode: number = 200
  ): Response {
    const response: AppResponse<T> = {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        pagination,
      },
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, metadata?: Partial<Metadata>): Response {
    return this.success(res, data, 201, metadata);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
