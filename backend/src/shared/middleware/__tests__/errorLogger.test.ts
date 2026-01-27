import logger from '@config/logger';
import { NextFunction, Request, Response } from 'express';

import { errorLogger } from '../errorLogger';

// Mock logger
jest.mock('@config/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('ErrorLogger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      id: 'req-123',
      method: 'POST',
      url: '/test-url',
      params: { id: '1' },
      query: { type: 'test' },
      body: { name: 'Test User' },
      ip: '127.0.0.1',
    } as any; // Using any to allow adding custom properties like 'id' and 'user'

    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should log error details and call next', () => {
    const error = new Error('Something went wrong');

    errorLogger(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(logger.error).toHaveBeenCalledWith(
      'Error occurred',
      expect.objectContaining({
        requestId: 'req-123',
        error: expect.objectContaining({
          message: 'Something went wrong',
          name: 'Error',
        }),
        request: expect.objectContaining({
          method: 'POST',
          url: '/test-url',
          ip: '127.0.0.1',
        }),
      })
    );

    expect(nextFunction).toHaveBeenCalledWith(error);
  });

  it('should redact sensitive information from body', () => {
    const error = new Error('Error with sensitive data');
    mockRequest.body = {
      username: 'user',
      password: 'secretPassword',
      token: 'secretToken',
      other: 'value',
    };

    errorLogger(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(logger.error).toHaveBeenCalledWith(
      'Error occurred',
      expect.objectContaining({
        request: expect.objectContaining({
          body: {
            username: 'user',
            password: '[REDACTED]',
            token: '[REDACTED]',
            other: 'value',
          },
        }),
      })
    );
  });

  it('should include user id if present in request', () => {
    const error = new Error('Auth Error');
    (mockRequest as any).user = { id: 'user-123' };

    errorLogger(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(logger.error).toHaveBeenCalledWith(
      'Error occurred',
      expect.objectContaining({
        user: 'user-123',
      })
    );
  });

  it('should handle missing optional fields', () => {
    const error = new Error('Minimal Error');
    mockRequest = {
      // Missing id, ip, user, etc. to test fallbacks if any
      method: 'GET',
      url: '/',
      body: {},
      params: {},
      query: {},
    } as any;

    errorLogger(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(logger.error).toHaveBeenCalled();
    const loggedData = (logger.error as jest.Mock).mock.calls[0][1];

    expect(loggedData.request.ip).toBe('unknown');
    expect(loggedData.requestId).toBeUndefined(); // or whatever expected behavior
    expect(loggedData.user).toBeUndefined();
  });
});
