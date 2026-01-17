import 'dotenv/config';
import { prisma } from '../src/config/prisma';
import { CustomerState, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ROLES } from '../src/consts/roles';
import { PERMISSIONS } from '../src/consts/permissions';

async function main() {
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  console.log('🧹 Cleaning up database...');
  // Clean up in order to avoid foreign key constraints
  await prisma.customer.deleteMany();
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
  const createdRoles: Record<string, Role> = {};
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
      status: 'ACTIVE',
      roles: {
        create: {
          roleId: createdRoles[ROLES.ADMIN].id,
        },
      },
    },
  });

  console.log('🏢 Seeding Customers...');
  const customers = [
    {
      code: 'C001',
      legalName: 'Corporación Telcel C.A.',
      taxId: 'J-12345678-9',
      address: 'Av. Francisco de Miranda, Torre Parque Cristal, Piso 15, Caracas',
      phone: '+58 212-555-0101',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C002',
      legalName: 'Inversiones La Polar S.A.',
      taxId: 'J-23456789-0',
      address: 'Calle Principal de Las Mercedes, Centro Comercial San Ignacio, Local 45',
      phone: '+58 212-555-0102',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C003',
      legalName: 'Distribuidora El Mayorista C.A.',
      taxId: 'J-34567890-1',
      address: 'Zona Industrial La Yaguara, Galpón 12-B, Caracas',
      phone: '+58 212-555-0103',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C004',
      legalName: 'Tecnología y Sistemas Avanzados S.A.',
      taxId: 'J-45678901-2',
      address: 'Av. Principal de Los Ruices, Edificio Centro Empresarial, Piso 8',
      phone: '+58 212-555-0104',
      state: CustomerState.INACTIVE,
    },
    {
      code: 'C005',
      legalName: 'Comercializadora Global Express C.A.',
      taxId: 'J-56789012-3',
      address: 'Calle Urdaneta, Edificio Torre América, Piso 12, Valencia',
      phone: '+58 241-555-0105',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C006',
      legalName: 'Alimentos del Caribe S.A.',
      taxId: 'J-67890123-4',
      address: 'Zona Industrial Castillito, Galpón 5, San Diego',
      phone: '+58 241-555-0106',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C007',
      legalName: 'Construcciones y Proyectos Andinos C.A.',
      taxId: 'J-78901234-5',
      address: 'Av. Las Américas, Centro Comercial Sambil, Torre Empresarial, Piso 6, Maracaibo',
      phone: '+58 261-555-0107',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C008',
      legalName: 'Farmacéutica Salud Total S.A.',
      taxId: 'J-89012345-6',
      address: 'Calle 77 con Av. 3H, Edificio Medical Center, Maracaibo',
      phone: '+58 261-555-0108',
      state: CustomerState.SUSPENDED,
    },
    {
      code: 'C009',
      legalName: 'Textiles y Confecciones Oriente C.A.',
      taxId: 'J-90123456-7',
      address: 'Av. Universidad, Zona Industrial, Barcelona',
      phone: '+58 281-555-0109',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C010',
      legalName: 'Importadora Mundo Digital S.A.',
      taxId: 'J-01234567-8',
      address: 'Av. Bolívar Norte, Centro Comercial Paseo Las Delicias, Local 23, Maracay',
      phone: '+58 243-555-0110',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C011',
      legalName: 'Servicios Petroleros del Sur C.A.',
      taxId: 'J-11234567-9',
      address: 'Zona Industrial Matanzas, Puerto Ordaz',
      phone: '+58 286-555-0111',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C012',
      legalName: 'Automotriz Central S.A.',
      taxId: 'J-21234567-0',
      address: 'Autopista Regional del Centro, Km 15, Valencia',
      phone: '+58 241-555-0112',
      state: CustomerState.INACTIVE,
    },
    {
      code: 'C013',
      legalName: 'Hotelería y Turismo Costa Azul C.A.',
      taxId: 'J-31234567-1',
      address: 'Av. 4 de Mayo, Sector Playa El Agua, Isla de Margarita',
      phone: '+58 295-555-0113',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C014',
      legalName: 'Agroindustrias Los Llanos S.A.',
      taxId: 'J-41234567-2',
      address: 'Carretera Nacional Vía Calabozo, Km 8, Guárico',
      phone: '+58 246-555-0114',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C015',
      legalName: 'Editorial y Publicaciones Modernas C.A.',
      taxId: 'J-51234567-3',
      address: 'Av. Libertador, Edificio Torre Británica, Piso 9, Caracas',
      phone: '+58 212-555-0115',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C016',
      legalName: 'Transporte y Logística Nacional S.A.',
      taxId: 'J-61234567-4',
      address: 'Autopista Caracas-La Guaira, Km 12, Catia La Mar',
      phone: '+58 212-555-0116',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C017',
      legalName: 'Minera del Caroní C.A.',
      taxId: 'J-71234567-5',
      address: 'Zona Industrial Matanzas, Ciudad Guayana',
      phone: '+58 286-555-0117',
      state: CustomerState.SUSPENDED,
    },
    {
      code: 'C018',
      legalName: 'Consultoría Empresarial Estratégica S.A.',
      taxId: 'J-81234567-6',
      address: 'Av. Francisco de Miranda, Centro Lido, Torre A, Piso 11, Caracas',
      phone: '+58 212-555-0118',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C019',
      legalName: 'Plásticos y Empaques Industriales C.A.',
      taxId: 'J-91234567-7',
      address: 'Zona Industrial Los Guayos, Valencia',
      phone: '+58 241-555-0119',
      state: CustomerState.ACTIVE,
    },
    {
      code: 'C020',
      legalName: 'Energía Renovable del Futuro S.A.',
      taxId: 'J-02234567-8',
      address: 'Av. Principal de Bello Monte, Torre BOD, Piso 14, Caracas',
      phone: '+58 212-555-0120',
      state: CustomerState.ACTIVE,
    },
  ];

  for (const customerData of customers) {
    await prisma.customer.create({
      data: customerData,
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
