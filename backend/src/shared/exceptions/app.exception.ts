import logger from '@config/logger';
import { ErrorCodes } from '../enums/error-codes.enum';

export class AppException extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCodes;
  public readonly details?: Record<string, any>;

  constructor(
    statusCode: number,
    code: ErrorCodes,
    message: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);

    this.logError();
  }

  private logError() {
    logger.error({
      message: this.message,
      code: this.code,
      stack: this.stack,
      details: this.details,
      errorClass: this.constructor.name,
    });
  }
}
