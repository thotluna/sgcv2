import { Response } from 'express';
import { AppResponse, ErrorData, Metadata, Pagination } from '@sgcv2/shared';
import { ErrorCodes } from '../enums/error-codes.enum';
// import { v4 as uuidv4 } from 'uuid';

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
        // requestId: metadata?.requestId || uuidv4(),
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
        // requestId: uuidv4(),
        pagination,
      },
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    code: ErrorCodes,
    message: string,
    statusCode: number = 500,
    details?: Record<string, string>
  ): Response {
    const errorData: ErrorData = {
      code,
      message,
      details,
    };

    const response: AppResponse<null> = {
      success: false,
      error: errorData,
      metadata: {
        timestamp: new Date().toISOString(),
        // requestId: uuidv4(),
      },
    };

    return res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    message: string,
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.VALIDATION_ERROR, message, 400, details);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found',
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.NOT_FOUND, message, 404, details);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.UNAUTHORIZED, message, 401, details);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.FORBIDDEN, message, 403, details);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad request',
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.BAD_REQUEST, message, 400, details);
  }

  static unprocessableEntity(
    res: Response,
    message: string = 'Unprocessable entity',
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.UNPROCESSABLE_ENTITY, message, 422, details);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict',
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.CONFLICT, message, 409, details);
  }

  static internalError(
    res: Response,
    message: string = 'Internal server error',
    details?: Record<string, string>
  ): Response {
    return this.error(res, ErrorCodes.INTERNAL_SERVER_ERROR, message, 500, details);
  }

  static created<T>(res: Response, data: T, metadata?: Partial<Metadata>): Response {
    return this.success(res, data, 201, metadata);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
