# Authentication Module

This module provides authentication and authorization functionality for the SGCV2 backend.

## Features

- ✅ JWT-based authentication
- ✅ Local strategy (username/password)
- ✅ Role-Based Access Control (RBAC)
- ✅ Permission-based authorization
- ✅ Protected routes middleware
- ✅ User management with roles and permissions

## Structure

```
src/modules/auth/
├── auth.controller.ts      # Controller with login, logout, and me endpoints
├── auth.service.ts          # Service with authentication logic
├── auth.routes.ts           # Routes definition
├── dto/
│   ├── login.dto.ts         # Login data transfer object
│   └── register.dto.ts      # Register data transfer object
├── strategies/
│   ├── jwt.strategy.ts      # JWT authentication strategy
│   ├── jwt.options.ts       # JWT configuration options
│   └── local.strategy.ts    # Local (username/password) strategy
├── middleware/
│   └── auth.middleware.ts   # Authentication middleware
└── guards/
    └── rbac.guard.ts        # Role and permission guards
```

## API Endpoints

### POST /api/auth/login

Login with username and password.

**Request:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/auth/me

Get current user information (requires authentication).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id_usuario": 1,
  "username": "admin",
  "email": "admin@xtel.com",
  "nombre": "Admin",
  "apellido": "User",
  "roles": [...],
  "permissions": [...]
}
```

### POST /api/auth/logout

Logout (requires authentication).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Logout successful",
  "note": "Client should remove the token from storage"
}
```

## Usage Examples

### Protecting Routes with Authentication

```typescript
import { authenticate } from './modules/auth/middleware/auth.middleware';

router.get('/protected', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

### Requiring Specific Roles

```typescript
import { authenticate } from './modules/auth/middleware/auth.middleware';
import { requireRoles } from './modules/auth/guards/rbac.guard';

router.get('/admin-only', authenticate, requireRoles('Administrador'), (req, res) => {
  res.json({ message: 'Admin only' });
});
```

### Requiring Specific Permissions

```typescript
import { authenticate } from './modules/auth/middleware/auth.middleware';
import { requirePermission } from './modules/auth/guards/rbac.guard';

router.post('/create-ods', authenticate, requirePermission('ODS', 'CREAR'), (req, res) => {
  res.json({ message: 'ODS created' });
});
```

### Multiple Roles

```typescript
router.get('/management', authenticate, requireRoles('Administrador', 'Gerente'), (req, res) => {
  res.json({ message: 'For admins and managers' });
});
```

## AuthService Methods

### `validateUser(username: string, password: string)`

Validates user credentials.

**Returns:** User object if valid, null otherwise.

### `login(user: { id_usuario: number; username: string })`

Generates a JWT token for the user.

**Returns:** `{ access_token: string }`

### `hashPassword(password: string)`

Hashes a password using bcrypt.

**Returns:** Hashed password string.

### `comparePassword(plainPassword: string, hashedPassword: string)`

Compares a plain password with a hashed password.

**Returns:** Boolean indicating if passwords match.

### `getUserWithRoles(userId: number)`

Gets a user with their roles and permissions.

**Returns:** User object with roles and permissions, or null if not found.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```env
JWT_SECRET=your-secret-key-here
```

## Testing

Run tests with:

```bash
npm test
```

Test files:

- `__tests__/auth.service.test.ts` - Service tests
- `__tests__/auth.routes.test.ts` - Routes/controller tests

## Security Notes

1. **JWT Secret**: Always use a strong, random secret in production.
2. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds.
3. **Token Expiration**: Tokens expire after 1 day by default.
4. **HTTPS**: Always use HTTPS in production to protect tokens in transit.

## Next Steps

- [ ] Implement refresh tokens
- [ ] Add rate limiting for login attempts
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Implement 2FA (Two-Factor Authentication)
