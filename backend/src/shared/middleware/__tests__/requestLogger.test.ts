import logger from '@config/logger';
import { NextFunction, Request, Response } from 'express';

import { requestLogger } from '../requestLogger';

// Mock logger
jest.mock('@config/logger', () => ({
  http: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

describe('RequestLogger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      get: jest.fn().mockImplementation((header: string) => {
        if (header === 'user-agent') return 'jest-agent';
        return undefined;
      }),
    } as any;

    mockResponse = {
      statusCode: 200,
      send: jest.fn(),
    } as any;

    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should assign a request ID and call next', () => {
    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.id).toBe('test-uuid-123');
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should log incoming request details', () => {
    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(logger.http).toHaveBeenCalledWith(
      'Incoming request',
      expect.objectContaining({
        requestId: 'test-uuid-123',
        method: 'GET',
        url: '/test',
        ip: '127.0.0.1',
        userAgent: 'jest-agent',
      })
    );
  });

  it('should log incoming request including user ID if present', () => {
    (mockRequest as any).user = { id: 'user-id-555' };

    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(logger.http).toHaveBeenCalledWith(
      'Incoming request',
      expect.objectContaining({
        userId: 'user-id-555',
      })
    );
  });

  it('should log response completion with duration and status code', () => {
    // Setup a fake timer to control duration
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T12:00:00Z'));

    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    // Advance time by 100ms
    jest.setSystemTime(new Date('2023-01-01T12:00:00.100Z'));

    // Trigger the overridden res.send
    const data = { foo: 'bar' };
    (mockResponse as any).send(data);

    expect(logger.http).toHaveBeenCalledWith(
      'Request completed',
      expect.objectContaining({
        requestId: 'test-uuid-123',
        method: 'GET',
        url: '/test',
        statusCode: 200,
        duration: '100ms',
      })
    );

    jest.useRealTimers();
  });

  it('should preserve original res.send functionality', () => {
    // We need to spy on the original send method, but since we are mocking response object structure manually
    // we can just check if our initial jest.fn() was called.
    const originalSend = jest.fn();
    mockResponse.send = originalSend;

    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    mockResponse.send!('test-body');

    expect(originalSend).toHaveBeenCalledWith('test-body');
  });

  it('should include user ID in completion log if present', () => {
    (mockRequest as any).user = { id: 'user-finished-123' };

    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    mockResponse.send!('body');

    expect(logger.http).toHaveBeenCalledWith(
      'Request completed',
      expect.objectContaining({
        userId: 'user-finished-123',
      })
    );
  });
});
