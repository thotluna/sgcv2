import { UserFilterSchema } from '../../../infrastructure/http/user-filter.schema';

describe('UserFilterSchema', () => {
  it('should validate and transform empty query', () => {
    const result = UserFilterSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        username: undefined,
        email: undefined,
        status: undefined,
        roleId: undefined,
        limit: 10,
        offset: 0,
      });
    }

  });

  it('should validate and transform full query', () => {
    const query = {
      username: 'test',
      email: 'test@example.com',
      status: 'ACTIVE',
      roleId: '1',
      limit: '20',
      offset: '5',
    };
    const result = UserFilterSchema.safeParse(query);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        username: 'test',
        email: 'test@example.com',
        status: 'ACTIVE',
        roleId: 1,
        limit: 20,
        offset: 5,
      });
    }

  });

  it('should reject invalid status', () => {
    const result = UserFilterSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('should reject non-numeric roleId, limit, offset', () => {
    expect(UserFilterSchema.safeParse({ roleId: 'abc' }).success).toBe(false);
    expect(UserFilterSchema.safeParse({ limit: 'abc' }).success).toBe(false);
    expect(UserFilterSchema.safeParse({ offset: 'abc' }).success).toBe(false);
  });

  it('should enforce numeric constraints', () => {
    expect(UserFilterSchema.safeParse({ limit: '0' }).success).toBe(false);
    expect(UserFilterSchema.safeParse({ limit: '101' }).success).toBe(false);
    expect(UserFilterSchema.safeParse({ offset: '-1' }).success).toBe(false);
    expect(UserFilterSchema.safeParse({ roleId: '0' }).success).toBe(false);
  });
});
