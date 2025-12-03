import 'dotenv/config';
import { prisma } from '../src/config/prisma';
import bcrypt from 'bcrypt';
import { ROLES } from '../src/consts/roles';
import { PERMISSIONS } from '../src/consts/permissions';

async function main() {
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  console.log('🧹 Cleaning up database...');
  // Clean up in order to avoid foreign key constraints
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding Permissions...');
  const allPermissions = [];
  for (const resourceKey in PERMISSIONS) {
    const resourceActions = PERMISSIONS[resourceKey as keyof typeof PERMISSIONS];
    for (const actionKey in resourceActions) {
      const permissionData = resourceActions[actionKey as keyof typeof resourceActions];
      const permission = await prisma.permission.create({
        data: {
          resource: permissionData.resource,
          action: permissionData.action,
          description: `${permissionData.action} on ${permissionData.resource}`,
        },
      });
      allPermissions.push(permission);
    }
  }

  console.log('🌱 Seeding Roles...');
  const createdRoles: Record<string, any> = {};
  for (const roleName of Object.values(ROLES)) {
    const role = await prisma.role.create({
      data: {
        name: roleName,
        description: `Role ${roleName}`,
      },
    });
    createdRoles[roleName] = role;
  }

  console.log('🔗 Assigning Permissions to Roles...');
  // Assign ALL permissions to ADMIN role
  if (createdRoles[ROLES.ADMIN]) {
    for (const permission of allPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: createdRoles[ROLES.ADMIN].id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log('👤 Creating Admin User...');
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash,
      isActive: 'ACTIVE',
      roles: {
        create: {
          roleId: createdRoles[ROLES.ADMIN].id,
        },
      },
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
