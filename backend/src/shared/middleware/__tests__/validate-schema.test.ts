import { z } from 'zod';
import { validateSchema } from '../validate-schema';
import { ValidationException } from '../../exceptions/http-exceptions';
import { Response, NextFunction } from 'express';


describe('validateSchema Middleware', () => {
  const schema = z.object({
    name: z.string(),
    age: z.coerce.number(),
  });

  let mockReq: any;
  let mockRes: Response;
  let nextFn: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {},
    };
    mockRes = {} as Response;
    nextFn = jest.fn();
  });

  it('should validate body by default', () => {
    mockReq.body = { name: 'John', age: '30' };
    const middleware = validateSchema(schema);
    middleware(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalled();
    expect(mockReq.body).toEqual({ name: 'John', age: 30 });
  });

  it('should validate query when specified', () => {
    mockReq.query = { name: 'John', age: '30' };
    const middleware = validateSchema(schema, 'query');
    middleware(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalled();
    expect(mockReq.query).toEqual({ name: 'John', age: 30 });
  });

  it('should validate params when specified', () => {
    mockReq.params = { name: 'John', age: '30' };
    const middleware = validateSchema(schema, 'params');
    middleware(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalled();
    expect(mockReq.params).toEqual({ name: 'John', age: 30 });
  });

  it('should throw ValidationException on invalid data', () => {
    mockReq.body = { name: 'John', age: 'not-a-number' };
    const middleware = validateSchema(schema);

    expect(() => middleware(mockReq, mockRes, nextFn)).toThrow(ValidationException);
    expect(nextFn).not.toHaveBeenCalled();
  });
});
