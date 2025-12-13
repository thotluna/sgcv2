import logger from '@config/logger';

export class LoggerHelper {
  // Log de operaciones de base de datos
  static logDBOperation(
    operation: string,
    model: string,
    data: Record<string, unknown> = {}
  ): void {
    logger.debug('Database operation', {
      operation,
      model,
      ...data,
    });
  }

  // Log de llamadas a APIs externas
  static logExternalAPI(
    service: string,
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number
  ): void {
    logger.info('External API call', {
      service,
      endpoint,
      method,
      statusCode,
      duration: `${duration}ms`,
    });
  }

  // Log de eventos de negocio
  static logBusinessEvent(event: string, userId: string, data: Record<string, unknown> = {}): void {
    logger.info('Business event', {
      event,
      userId,
      ...data,
    });
  }

  // Log de performance
  static logPerformance(operation: string, duration: number, threshold: number = 1000): void {
    const level = duration > threshold ? 'warn' : 'info';
    logger[level]('Performance metric', {
      operation,
      duration: `${duration}ms`,
      threshold: `${threshold}ms`,
      exceededThreshold: duration > threshold,
    });
  }
  static logAsyncOperation(_target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const startTime = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        logger.debug('Async operation completed', {
          method: propertyKey,
          duration: `${duration}ms`,
          success: true,
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        logger.error('Async operation failed', {
          method: propertyKey,
          duration: `${duration}ms`,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        throw error;
      }
    };

    return descriptor;
  }
}
