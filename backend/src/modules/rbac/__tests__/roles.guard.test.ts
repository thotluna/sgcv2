// src/modules/rbac/__tests__/roles.guard.test.ts
import { ForbiddenException } from '@shared/exceptions';
import { NextFunction, Request, Response } from 'express';

import { TYPES } from '../di/types';
import { requireRoles } from '../guards/roles.guard';

// Mock the container
const mockRbacService = {
  hasRole: jest.fn(),
};

jest.mock('../../../container', () => ({
  container: {
    get: jest.fn().mockImplementation(type => {
      if (type === TYPES.RbacService) return mockRbacService;
      return null;
    }),
  },
}));

const mockReq = { user: { id: 1 } } as unknown as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const nextFn = jest.fn() as NextFunction;

describe('Roles Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows request when role matches', async () => {
    mockRbacService.hasRole.mockResolvedValue(true);
    await requireRoles('Administrador')(mockReq, mockRes, nextFn);
    expect(nextFn).toHaveBeenCalled();
  });

  it('rejects request when role does not match', async () => {
    mockRbacService.hasRole.mockResolvedValue(false);
    await requireRoles('Gerente')(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalledWith(expect.any(ForbiddenException));
    const error = (nextFn as jest.Mock).mock.calls[0][0];
    expect(error.message).toContain('Required roles: Gerente');
  });
});
