import { CreateUserSchema } from '@modules/users/infrastructure/http/create-user.schema';

describe('CreateUserSchema', () => {
  it('should validate a correct user object', () => {
    const validUser = {
      username: 'jdoe',
      email: 'jdoe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      isActive: 'ACTIVE',
    };

    const result = CreateUserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should fail if username is too short', () => {
    const invalidUser = {
      username: 'jd',
      email: 'jdoe@example.com',
      password: 'password123',
    };

    const result = CreateUserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('should fail if email is invalid', () => {
    const invalidUser = {
      username: 'jdoe',
      email: 'invalid-email',
      password: 'password123',
    };

    const result = CreateUserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('should fail if password is too short', () => {
    const invalidUser = {
      username: 'jdoe',
      email: 'jdoe@example.com',
      password: 'pass',
    };

    const result = CreateUserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('should allow optional fields to be missing', () => {
    const minimalUser = {
      username: 'jdoe',
      email: 'jdoe@example.com',
      password: 'password123',
    };

    const result = CreateUserSchema.safeParse(minimalUser);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe('ACTIVE');
    }
  });

  it('should fail on extra fields because of strict mode', () => {
    const extraFieldsUser = {
      username: 'jdoe',
      email: 'jdoe@example.com',
      password: 'password123',
      extra: 'not allowed',
    };

    const result = CreateUserSchema.safeParse(extraFieldsUser);
    expect(result.success).toBe(false);
  });
});
