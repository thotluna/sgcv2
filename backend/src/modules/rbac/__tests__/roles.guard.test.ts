// src/modules/rbac/__tests__/roles.guard.test.ts
import { NextFunction, Request, Response } from 'express';

import { requireRoles } from '../guards/roles.guard';

// Mock the entire rbac.service module
jest.mock('../rbac.service', () => ({
  rbacService: {
    hasRole: jest.fn(),
  },
}));

import { rbacService } from '../rbac.service';

const mockReq = { user: { id: 1 } } as unknown as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const nextFn = jest.fn() as NextFunction;

import { ForbiddenException } from '@shared/exceptions';

// ... (existing imports and mock setup)

describe('Roles Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows request when role matches', async () => {
    (rbacService.hasRole as jest.Mock).mockResolvedValue(true);
    await requireRoles('Administrador')(mockReq, mockRes, nextFn);
    expect(nextFn).toHaveBeenCalled();
  });

  it('rejects request when role does not match', async () => {
    (rbacService.hasRole as jest.Mock).mockResolvedValue(false);
    await requireRoles('Gerente')(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalledWith(expect.any(ForbiddenException));
    const error = (nextFn as jest.Mock).mock.calls[0][0];
    expect(error.message).toContain('Required roles: Gerente');
  });
});
