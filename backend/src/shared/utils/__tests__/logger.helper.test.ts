import logger from '@config/logger';

import { LoggerHelper } from '../logger.helper';

// Mock logger
jest.mock('@config/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('LoggerHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logDBOperation', () => {
    it('should log db operation as debug', () => {
      LoggerHelper.logDBOperation('create', 'User', { id: 1 });
      expect(logger.debug).toHaveBeenCalledWith('Database operation', {
        operation: 'create',
        model: 'User',
        id: 1,
      });
    });

    it('should handle empty data', () => {
      LoggerHelper.logDBOperation('delete', 'User');
      expect(logger.debug).toHaveBeenCalledWith('Database operation', {
        operation: 'delete',
        model: 'User',
      });
    });
  });

  describe('logExternalAPI', () => {
    it('should log external API call as info', () => {
      LoggerHelper.logExternalAPI('Stripe', '/v1/charges', 'POST', 200, 150);
      expect(logger.info).toHaveBeenCalledWith('External API call', {
        service: 'Stripe',
        endpoint: '/v1/charges',
        method: 'POST',
        statusCode: 200,
        duration: '150ms',
      });
    });
  });

  describe('logBusinessEvent', () => {
    it('should log business event as info', () => {
      LoggerHelper.logBusinessEvent('USER_REGISTERED', 'user-123', { source: 'web' });
      expect(logger.info).toHaveBeenCalledWith('Business event', {
        event: 'USER_REGISTERED',
        userId: 'user-123',
        source: 'web',
      });
    });
  });

  describe('logPerformance', () => {
    it('should log as info if duration is within threshold', () => {
      LoggerHelper.logPerformance('fast-op', 100, 1000);
      expect(logger.info).toHaveBeenCalledWith('Performance metric', {
        operation: 'fast-op',
        duration: '100ms',
        threshold: '1000ms',
        exceededThreshold: false,
      });
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should log as warn if duration exceeds threshold', () => {
      LoggerHelper.logPerformance('slow-op', 1500, 1000);
      expect(logger.warn).toHaveBeenCalledWith('Performance metric', {
        operation: 'slow-op',
        duration: '1500ms',
        threshold: '1000ms',
        exceededThreshold: true,
      });
      expect(logger.info).not.toHaveBeenCalled();
    });
  });

  describe('logAsyncOperation Decorator', () => {
    class TestClass {
      @LoggerHelper.logAsyncOperation
      async successMethod(arg: string) {
        return `result: ${arg}`;
      }

      @LoggerHelper.logAsyncOperation
      async failMethod() {
        throw new Error('Failure');
      }
    }

    let testInstance: TestClass;

    beforeEach(() => {
      testInstance = new TestClass();
    });

    it('should log debug on success', async () => {
      const result = await testInstance.successMethod('test');
      expect(result).toBe('result: test');
      expect(logger.debug).toHaveBeenCalledWith(
        'Async operation completed',
        expect.objectContaining({
          method: 'successMethod',
          success: true,
        })
      );
    });

    it('should log error on failure and rethrow', async () => {
      await expect(testInstance.failMethod()).rejects.toThrow('Failure');
      expect(logger.error).toHaveBeenCalledWith(
        'Async operation failed',
        expect.objectContaining({
          method: 'failMethod',
          error: 'Failure',
        })
      );
    });
  });
});
