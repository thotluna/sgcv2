import 'dotenv/config';
import { prisma } from '../src/config/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  // Clean up
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  await prisma.role.create({
    data: {
      name: 'user',
      description: 'Standard user',
    },
  });

  // Create Admin User
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash,
      isActive: 'ACTIVE',
      roles: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
  });

  console.log('✅ Database seeded with admin user and roles');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
