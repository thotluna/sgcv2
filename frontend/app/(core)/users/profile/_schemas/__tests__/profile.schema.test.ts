import { UpdateEmailSchema, UpdatePasswordSchema, UpdateAvatarSchema } from '../profile.schema';

describe('Profile Schemas', () => {
  describe('UpdateEmailSchema', () => {
    it('should validate a valid email', () => {
      const result = UpdateEmailSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const result = UpdateEmailSchema.safeParse({ email: 'invalid-email' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });
  });

  describe('UpdatePasswordSchema', () => {
    it('should validate matching passwords and required current password', () => {
      const data = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };
      const result = UpdatePasswordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if currentPassword is empty', () => {
      const data = {
        currentPassword: '',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };
      const result = UpdatePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail if newPassword is too short', () => {
      const data = {
        currentPassword: 'oldPassword123',
        newPassword: '123',
        confirmPassword: '123',
      };
      const result = UpdatePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail if passwords do not match', () => {
      const data = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword',
      };
      const result = UpdatePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
      }
    });
  });

  describe('UpdateAvatarSchema', () => {
    it('should validate a valid URL', () => {
      const result = UpdateAvatarSchema.safeParse({ avatarUrl: 'https://example.com/avatar.png' });
      expect(result.success).toBe(true);
    });

    it('should validate an empty string', () => {
      const result = UpdateAvatarSchema.safeParse({ avatarUrl: '' });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid URL', () => {
      const result = UpdateAvatarSchema.safeParse({ avatarUrl: 'not-a-url' });
      expect(result.success).toBe(false);
    });
  });
});
