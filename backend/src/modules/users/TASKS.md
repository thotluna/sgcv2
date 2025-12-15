# Users Module - Implementation Plan

## Backend

### Domain

- [ ] **Update UserRepository Interface**:
  - `create(user: CreateUserDto): Promise<UserEntity>`
  - `update(id: number, user: UpdateUserDto): Promise<UserEntity>`
  - `delete(id: number): Promise<void>` (Soft delete)
  - `findAll(filter: UserFilter): Promise<UserEntity[]>`
  - `findById(id: number): Promise<UserEntity | null>`
  - `changePassword(id: number, newPasswordHash: string): Promise<void>`
  - `updatePreferences(id: number, preferences: UserPreferencesDto): Promise<void>`

### Application (Use Cases)

#### Admin (Management)

- [ ] **Create User**: `CreateUserUseCase` (Admin only).
- [ ] **Update User**: `UpdateUserUseCase` (Admin only - manage roles, names, status).
- [ ] **Soft Delete User**: `DeleteUserUseCase` (Admin only).
- [ ] **Get All Users**: `GetAllUsersUseCase` (Pagination, sorting, filters).

#### User (Self-Service)

- [ ] **Show Me**: `GetMeUseCase` (View own details, permissions) - _Existing_.
- [ ] **Change Password**: `ChangePasswordUseCase` (Requires current password).
- [ ] **Change Email**: `ChangeEmailUseCase` (Requires verification flow).
- [ ] **Update Preferences**: `UpdatePreferencesUseCase` (Theme: Dark/Light, Language).
- [ ] **Avatar Strategy**:
  - **Decision**: Initial implementation will use **Gravatar** based on the user's email.
  - **Future**: Custom avatar upload system will be designed later as a cross-cutting concern (file storage module), handling optimization, storage (S3/Local on robust filesystem), and validation (size, type, moderation).

### Infrastructure

- [ ] **Prisma Repository**: Implement new methods in `PrismaUserRepository`.
- [ ] **HTTP Controller**: `UsersController` with endpoints:
  - **Admin Routes**:
    - `POST /users` (Create)
    - `GET /users` (List)
    - `GET /users/:id` (Get One)
    - `PATCH /users/:id` (Update General Info)
    - `DELETE /users/:id` (Soft Delete)
  - **User Routes (Profile)**:
    - `PATCH /users/profile/password`
    - `POST /users/profile/email/request` (Start email change)
    - `POST /users/profile/email/confirm` (Verify code)
    - `PATCH /users/profile/preferences`
- [ ] **Routes**: Register routes in `users.routes.ts` with correct Guards.

## Frontend

### Infrastructure (API)

- [ ] **Users Service**: `users.service.ts`
  - Admin methods: `getUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`
  - User methods: `changePassword`, `requestEmailChange`, `confirmEmailChange`, `updatePreferences`

### Components

- [ ] **User List Table** (Admin): Avatar (Gravatar), Name, Email, Role, Status, Actions.
- [ ] **User Form** (Admin): Username, Email, First Name, Last Name, Role(s), Status.
- [ ] **Change Password Form** (User).
- [ ] **Profile Settings Components**: Theme toggle (Avatar upload UI deferred).

### Pages

- [ ] **Admin - User Management**:
  - `/admin/users` (List)
  - `/admin/users/new`
  - `/admin/users/[id]/edit`
- [ ] **User - Profile**:
  - `/profile` (Tabs/Sections: Overview, Security, Preferences)
