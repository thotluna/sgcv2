import { ForbiddenException } from '@shared/exceptions';
import { NextFunction, Request, Response } from 'express';

import { TYPES } from '../di/types';
import { requirePermission } from '../guards/permissions.guard';

// Mock the container
const mockRbacService = {
  hasPermission: jest.fn(),
};

jest.mock('../../../container', () => ({
  container: {
    get: jest.fn().mockImplementation(type => {
      if (type === TYPES.RbacService) return mockRbacService;
      return null;
    }),
  },
}));

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const nextFn = jest.fn() as NextFunction;

describe('Permissions Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows request when permission exists in user data (fast-track)', async () => {
    const reqWithPerms = {
      user: { id: 1, permissions: ['ODS.CREAR'] },
    } as unknown as Request;

    await requirePermission('ODS', 'CREAR')(reqWithPerms, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalledWith();
    expect(mockRbacService.hasPermission).not.toHaveBeenCalled();
  });

  it('allows request when permission exists in database (fallback)', async () => {
    const reqWithoutPerms = {
      user: { id: 1, permissions: [] },
    } as unknown as Request;

    mockRbacService.hasPermission.mockResolvedValue(true);

    await requirePermission('ODS', 'CREAR')(reqWithoutPerms, mockRes, nextFn);

    expect(mockRbacService.hasPermission).toHaveBeenCalledWith(1, 'ODS', 'CREAR');
    expect(nextFn).toHaveBeenCalledWith();
  });

  it('rejects request when permission missing in both (fallback failure)', async () => {
    const reqWithoutPerms = {
      user: { id: 1, permissions: [] },
    } as unknown as Request;

    mockRbacService.hasPermission.mockResolvedValue(false);

    await requirePermission('ODS', 'ELIMINAR')(reqWithoutPerms, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalledWith(expect.any(ForbiddenException));
    const error = (nextFn as jest.Mock).mock.calls[0][0];
    expect(error.message).toContain('Required permission: ODS.ELIMINAR');
  });
});
