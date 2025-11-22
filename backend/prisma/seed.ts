import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  // Remove any existing admin user to avoid duplicates
  await prisma.usuario.deleteMany({ where: { username: 'admin' } });

  await prisma.usuario.create({
    data: {
      username: 'admin',
      password_hash: passwordHash,
      email: 'admin@example.com',
      // Ajusta los campos obligatorios del modelo `usuario` si existen
    },
  });

  console.log('✅ Usuario admin creado');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
