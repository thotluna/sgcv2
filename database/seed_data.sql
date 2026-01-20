-- ============================================
-- SGCV2 - Seed Data
-- ============================================

-- Roles
INSERT INTO roles (name, description) VALUES
('Admin', 'System Administrator'),
('User', 'Regular User');

-- Permissions
INSERT INTO permissions (resource, action, description) VALUES
('users', 'create', 'Create users'),
('users', 'read', 'Read users'),
('users', 'update', 'Update users'),
('users', 'delete', 'Delete users'),
('roles', 'create', 'Create roles'),
('roles', 'read', 'Read roles'),
('roles', 'update', 'Update roles'),
('roles', 'delete', 'Delete roles'),
('permissions', 'create', 'Create permissions'),
('permissions', 'read', 'Read permissions'),
('permissions', 'update', 'Update permissions'),
('permissions', 'delete', 'Delete permissions');

-- Admin User
-- Password: admin123 (hash from previous seed)
INSERT INTO users (username, email, password_hash, first_name, last_name, user_state) VALUES
('admin', 'admin@example.com', '$2b$10$rBV2kHYW5dF5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5', 'Admin', 'User', 'ACTIVE');

-- Assign Role to Admin
INSERT INTO user_roles (user_id, role_id) VALUES
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'Admin'));

-- Assign Permissions to Admin Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'Admin'), id FROM permissions;
