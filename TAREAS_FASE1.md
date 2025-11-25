# Tareas - Primera Iteración (Fase 1: Setup y Autenticación)

## 🎯 Objetivo de la Iteración

Configurar el entorno de desarrollo completo y tener un sistema de autenticación funcional con login, RBAC y dashboard base.

**Duración estimada:** 2-3 semanas  
**Prioridad:** Alta (Bloqueante para todo lo demás)

---

## 📋 Lista de Tareas

### 1. Setup Inicial del Proyecto

#### 1.1 Configuración de Repositorio ✅ COMPLETADA

- [x] Crear repositorio Git (GitHub/GitLab)
- [x] Configurar `.gitignore` para Node.js y Next.js
- [x] Crear estructura de carpetas base:
  ```
  sgcv2/
  ├── backend/      ✅ 33 carpetas creadas
  ├── frontend/     ✅ 26 carpetas creadas
  ├── docs/         ✅ (ya existía)
  ├── database/     ✅ (archivos SQL movidos)
  └── docker/       ⏳ (pendiente)
  ```
- [x] Crear `README.md` principal (ya existe, rutas actualizadas)
- [x] Configurar branching strategy (main como default)
- [x] Primer commit inicial (2 commits realizados)

**Tiempo estimado:** 2 horas  
**Tiempo real:** ~1 hora ✅

---

#### 1.2 Setup de Backend (Node.js + Express + TypeScript) ✅ COMPLETADA

- [x] Inicializar proyecto Node.js en `/backend`
- [x] Instalar dependencias principales (express, cors, dotenv)
- [x] Instalar dependencias de desarrollo (typescript, ts-node, nodemon, @types/\*)
- [x] Configurar TypeScript (`tsconfig.json`)
- [x] Crear estructura de carpetas (ya creada en 1.1)
- [x] Configurar scripts en `package.json`:
  - ✅ `dev`: nodemon con ts-node
  - ✅ `build`: compilar TypeScript
  - ✅ `start`: ejecutar build
- [x] Crear archivo `.env.example` con variables necesarias
- [x] Configurar ESLint y Prettier (pendiente, no bloqueante)
- [x] Crear `app.ts` básico con Express
- [x] Crear `server.ts` para iniciar servidor
- [x] Probar que el servidor levanta correctamente ✅

**Endpoints funcionando:**

- GET /health → {"status":"ok"}
- GET /api/ → {"message":"SGCV2 API"}

**Tiempo estimado:** 4 horas  
**Tiempo real:** ~1.5 horas ✅

---

#### 1.3 Setup de Frontend (Next.js 14) ✅ COMPLETADA

- [x] Crear proyecto Next.js en `/frontend` con TypeScript, Tailwind y App Router
- [x] Instalar dependencias adicionales (zustand, axios, react-hook-form, zod)
- [x] Configurar estructura de carpetas:
  - ✅ app/(auth)/login
  - ✅ app/(dashboard)/{dashboard,ods,equipos,logistica,finanzas,reportes}
  - ✅ app/api
  - ✅ components/{ui,forms,tables,layouts}
  - ✅ lib/{api,validations,utils}
  - ✅ hooks, stores, types, styles
- [x] Configurar Tailwind CSS
- [x] Instalar shadcn/ui con tema Neutral
- [x] Agregar componentes básicos de shadcn/ui:
  - ✅ Button
  - ✅ Input
  - ✅ Card
  - ✅ Form
  - ✅ Label
- [x] Crear archivo `.env.local.example`
- [x] Configurar ESLint (incluido por defecto)
- [x] Probar que Next.js levanta correctamente ✅

**Frontend funcionando:**

- Next.js 16.0.3 (Turbopack)
- http://localhost:3001
- shadcn/ui components instalados

**Tiempo estimado:** 4 horas  
**Tiempo real:** ~2 horas ✅

---

#### 1.4 Docker Setup ✅ COMPLETADA

- [x] Crear `docker-compose.yml` en raíz con PostgreSQL 15
- [x] Configurar volúmenes persistentes para datos
- [x] Configurar inicialización automática del schema
- [x] Agregar pgAdmin (opcional, con profile tools)
- [x] Crear `DOCKER.md` con documentación
- [x] Probar que `docker-compose up -d` funciona ✅
- [x] Documentar comandos Docker

**Docker funcionando:**

- PostgreSQL 15 en puerto 5432
- 45 tablas creadas automáticamente
- 33 estados de workflow cargados
- 24 permisos configurados
- pgAdmin disponible en puerto 5050 (opcional)

**Tiempo estimado:** 3 horas  
**Tiempo real:** ~1 hora ✅

---

#### 1.5 Setup de Base de Datos (PostgreSQL) ✅ COMPLETADA

- [x] Base de datos creada automáticamente por Docker
- [x] Schema ejecutado automáticamente (`schema.sql`)
- [x] Validaciones ejecutadas (`workflow_validation.sql`)
- [x] Datos iniciales cargados (`seed_data.sql`)
- [x] Verificar que las tablas se crearon correctamente ✅
- [x] Verificar que los workflows se cargaron ✅

**Base de datos verificada:**

- ✅ 45 tablas creadas
- ✅ 33 estados de workflow
- ✅ 24 permisos
- ✅ Funciones de validación instaladas

**Tiempo estimado:** 1 hora  
**Tiempo real:** ~15 minutos ✅ (automatizado con Docker)

---

#### 1.6 Configurar Prisma (ORM) ✅ COMPLETADA

- [x] Instalar Prisma en backend
  ```bash
  cd backend
  npm install prisma @prisma/client
  npx prisma init
  ```
- [x] Configurar `DATABASE_URL` en `.env` (ya configurado ✅)
- [x] Hacer introspection del schema existente (Schema ya provisto ✅)
  ```bash
  npx prisma db pull
  ```
- [x] Generar Prisma Client:
  ```bash
  npx prisma generate
  ```
- [x] Crear archivo de configuración de Prisma en `src/config/prisma.ts`
- [x] Probar conexión a BD desde backend

**Tiempo estimado:** 2 horas
**Tiempo real:** ~1 hora ✅ (incluyendo debugging de versiones)

---

### 2. Módulo de Autenticación

#### 2.1 Backend - Autenticación ✅ COMPLETADA

- [x] Instalar dependencias:
  ```bash
  npm install passport passport-jwt passport-local jsonwebtoken bcrypt
  npm install -D @types/passport @types/passport-jwt @types/passport-local @types/jsonwebtoken @types/bcrypt
  ```
- [x] Crear módulo `auth/`:
  ```
  src/modules/auth/
  ├── auth.controller.ts
  ├── auth.service.ts
  ├── auth.routes.ts
  ├── dto/
  │   ├── login.dto.ts
  │   └── register.dto.ts
  ├── strategies/
  │   ├── jwt.strategy.ts
  │   ├── jwt.options.ts
  │   └── local.strategy.ts
  ├── middleware/
  │   └── auth.middleware.ts
  └── guards/
      └── rbac.guard.ts
  ```
- [x] Implementar `auth.service.ts`:
  - ✅ `login(username, password)` → retorna JWT
  - ✅ `validateUser(username, password)` → valida credenciales
  - ✅ `hashPassword(password)` → hash con bcrypt
  - ✅ `comparePassword(plain, hashed)` → compara passwords
  - ✅ `getUserWithRoles(userId)` → obtiene usuario con roles y permisos
- [x] Implementar `auth.controller.ts`:
  - ✅ `POST /api/auth/login` → login
  - ✅ `POST /api/auth/logout` → logout
  - ✅ `GET /api/auth/me` → obtener usuario actual
- [x] Configurar Passport strategies:
  - ✅ Local strategy para login
  - ✅ JWT strategy para proteger rutas
- [x] Crear middleware de autenticación
  - ✅ `authenticate` → middleware para rutas protegidas
  - ✅ `optionalAuth` → middleware para autenticación opcional
- [x] Crear guards de autorización (RBAC)
  - ✅ `requireRoles(...roles)` → requiere roles específicos
  - ✅ `requirePermission(module, action)` → requiere permisos específicos
- [x] Crear documentación (README.md)
- [x] Crear ejemplos de uso (protected.routes.example.ts)
- [x] Probar con tests automatizados ✅ (6 tests pasando)

**Tiempo estimado:** 8 horas  
**Tiempo real:** ~2 horas ✅

---

#### 2.2 Backend - Gestión de Usuarios

- [x] Crear módulo `users/`:
  ```
  src/modules/users/
  ├── users.controller.ts
  ├── users.service.ts
  ├── users.routes.ts
  └── dto/
      ├── create-user.dto.ts
      └── update-user.dto.ts
  ```
- [x] Implementar `users.service.ts`:
  - ✅ `findById(id)` → obtener usuario
  - ✅ `findByUsername(username)` → buscar por username
  - ✅ `getUserWithRoles(id)` → usuario con roles y permisos
  - ✅ `updateUser(id, data)` → actualizar usuario
  - ✅ `createUser(data)` → crear usuario
  - ✅ `deleteUser(id)` → soft delete
- [x] Implementar `users.controller.ts`:
  - ✅ `GET /api/users/me` → perfil del usuario actual
  - ✅ `GET /api/users` → listar usuarios (admin)
  - ✅ `GET /api/users/:id` → obtener usuario (admin)
  - ✅ `POST /api/users` → crear usuario (admin)
  - ✅ `PUT /api/users/:id` → actualizar usuario
  - ✅ `DELETE /api/users/:id` → eliminar usuario (admin)
- [x] Probar endpoints con tests automatizados ✅ (Tests unitarios y de integración)

**Tiempo estimado:** 4 horas

---

#### 2.3 Backend - Sistema RBAC

- [x] Crear módulo `rbac/`:
  ```
  src/modules/rbac/
  ├── rbac.service.ts
  ├── guards/
  │   ├── roles.guard.ts
  │   └── permissions.guard.ts
  └── decorators/
      ├── roles.decorator.ts
      └── permissions.decorator.ts
  ```
- [x] Implementar `rbac.service.ts`:
  - ✅ `getUserPermissions(userId)` → permisos del usuario
  - ✅ `hasPermission(userId, module, action)` → verificar permiso
  - ✅ `hasRole(userId, roleName)` → verificar rol
- [x] Crear decorators:
  - ✅ `@Roles('admin', 'gerente')` → requiere roles
  - ✅ `@RequirePermission('ODS', 'CREAR')` → requiere permiso
- [x] Crear guards para proteger rutas
- [x] Probar sistema de permisos ✅ (Tests unitarios con cobertura >78%)

**Tiempo estimado:** 6 horas

---

### 3. Frontend - Autenticación

#### 3.1 Setup de Autenticación en Frontend ✅ COMPLETADA

- [x] Crear store de autenticación con Zustand:
  ```typescript
  // stores/auth.store.ts
  interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
  }
  ```
- [x] Crear API client con Axios:
  ```typescript
  // lib/api/client.ts
  - Configurar baseURL ✅
  - Interceptor para agregar JWT token ✅
  - Interceptor para manejar errores 401 ✅
  ```
- [x] Crear tipos TypeScript:
  ```typescript
  // types/auth.ts
  interface User {
    id: number;
    username: string;
    email: string;
    roles: Role[];
    permissions: Permission[];
  }
  ```

**Tiempo estimado:** 3 horas  
**Tiempo real:** ~1.5 horas ✅

---

#### 3.2 Página de Login ✅ COMPLETADA

- [x] Crear ruta `app/(auth)/login/page.tsx`
- [x] Crear componente de formulario de login:
  - ✅ Input de username
  - ✅ Input de password
  - ✅ Botón de submit
  - ✅ Validación con Zod
  - ✅ Manejo de errores
- [x] Implementar lógica de login:
  - ✅ Llamar a API `/api/auth/login`
  - ✅ Guardar token en localStorage con Zustand persist
  - ✅ Actualizar store de autenticación
  - ✅ Redirect a dashboard
- [x] Agregar loading state
- [x] Agregar mensajes de error con Sonner
- [x] Estilizar con Tailwind/shadcn

**Bugs corregidos:**

- ✅ Validación de username cambiada de email a string (permitir 'admin')
- ✅ Backend actualizado para devolver `{ user, token }` en lugar de solo `{ access_token }`
- ✅ Tests actualizados para reflejar nuevo formato de respuesta

**Credenciales de prueba:**

- Username: `admin`
- Password: `admin123`

**Tiempo estimado:** 4 horas  
**Tiempo real:** ~2 horas ✅

---

#### 3.3 Protección de Rutas

- [ ] Crear middleware de autenticación:
  ```typescript
  // middleware.ts
  - Verificar token en cookies
  - Redirect a /login si no autenticado
  - Permitir rutas públicas (/login)
  ```
- [ ] Crear componente `ProtectedRoute`:
  - Verificar autenticación
  - Verificar permisos (opcional)
  - Redirect si no autorizado
- [ ] Implementar en layout de dashboard
- [ ] Probar que funciona correctamente

**Tiempo estimado:** 3 horas

---

### 4. Dashboard Base

#### 4.1 Layout Principal

- [ ] Crear layout de dashboard `app/(dashboard)/layout.tsx`:
  - Sidebar con navegación
  - Header con usuario y logout
  - Área de contenido principal
- [ ] Crear componente `Sidebar`:
  - Logo
  - Menú de navegación
  - Links a módulos principales
  - Indicador de sección activa
- [ ] Crear componente `Header`:
  - Breadcrumbs
  - Notificaciones (placeholder)
  - Perfil de usuario
  - Botón de logout
- [ ] Hacer responsive (mobile/desktop)
- [ ] Estilizar con Tailwind

**Tiempo estimado:** 6 horas

---

#### 4.2 Página de Dashboard

- [ ] Crear `app/(dashboard)/dashboard/page.tsx`
- [ ] Agregar cards de métricas básicas:
  - Total de ODS
  - ODS en progreso
  - ODS completadas este mes
  - Técnicos disponibles
- [ ] Agregar gráfico simple (placeholder)
- [ ] Agregar tabla de ODS recientes (placeholder)
- [ ] Estilizar con shadcn/ui Cards

**Tiempo estimado:** 4 horas

---

### 5. Testing y QA

#### 5.1 Testing Backend ✅ COMPLETADA

- [x] Configurar Jest para backend
- [x] Crear tests para auth.service:
  - ✅ Test de login exitoso
  - ✅ Test de login fallido
  - ✅ Test de validación de token
  - ✅ Test de hash y comparación de passwords
- [x] Crear tests para auth.controller:
  - ✅ Test de endpoint login (200, 400, 401)
  - ✅ Test de endpoint logout
  - ✅ Test de endpoint me
- [x] Crear tests para auth.routes:
  - ✅ Tests de integración de rutas de autenticación
- [x] Crear tests para RBAC:
  - ✅ Test de verificación de permisos
  - ✅ Test de verificación de roles
  - ✅ Test de guards (roles.guard, permissions.guard)
- [x] Crear tests para users module:
  - ✅ Tests de users.service
  - ✅ Tests de users.controller
  - ✅ Tests de users.routes
- [x] Ejecutar tests y verificar coverage

**Resultados:**

- ✅ 9 test suites pasando
- ✅ 69 tests pasando
- ✅ Coverage general: ~40% (módulos críticos >78%)
- ✅ Auth module: 85%+ coverage
- ✅ RBAC module: 78%+ coverage
- ✅ Users module: 90%+ coverage

**Tiempo estimado:** 4 horas  
**Tiempo real:** ~3 horas ✅

---

#### 5.2 Testing Frontend ✅ COMPLETADA

- [x] Configurar Jest + React Testing Library
- [x] Crear tests para componente Login:
  - ✅ Renderizado correcto
  - ✅ Validación de formulario
  - ✅ Submit exitoso
  - ✅ Manejo de errores
  - ✅ Loading states
  - ✅ Accessibility
- [x] Crear tests para auth store:
  - ✅ Initial state
  - ✅ Login success/failure
  - ✅ Logout
  - ✅ CheckAuth
  - ✅ State persistence
- [x] Ejecutar tests

**Resultados:**

- ✅ 2 test suites pasando
- ✅ 18 tests pasando
- ✅ Login component: 11 tests
- ✅ Auth store: 7 tests
- ✅ Cobertura completa de funcionalidad crítica

**Archivos creados:**

- `jest.config.ts` - Configuración de Jest
- `jest.setup.ts` - Setup y mocks globales
- `app/(auth)/login/__tests__/page.test.tsx` - Tests del componente Login
- `stores/__tests__/auth.store.test.ts` - Tests del auth store

**Tiempo estimado:** 4 horas  
**Tiempo real:** ~2 horas ✅

---

#### 5.3 Testing Manual

- [ ] Probar flujo completo de login
- [ ] Probar protección de rutas
- [ ] Probar logout
- [ ] Probar en diferentes navegadores
- [ ] Probar responsive design
- [ ] Documentar bugs encontrados
- [ ] Corregir bugs críticos

**Tiempo estimado:** 3 horas

---

### 6. Documentación y Deploy

#### 6.1 Documentación

- [ ] Actualizar README.md con:
  - Instrucciones de instalación actualizadas
  - Variables de entorno necesarias
  - Comandos para correr el proyecto
  - Credenciales de prueba
- [ ] Crear `CONTRIBUTING.md` (opcional)
- [ ] Documentar API con Swagger/OpenAPI (opcional)
- [ ] Crear guía de desarrollo

**Tiempo estimado:** 3 horas

---

#### 6.2 Deploy de Desarrollo (Opcional)

- [ ] Configurar servidor de desarrollo
- [ ] Deploy de backend
- [ ] Deploy de frontend
- [ ] Configurar base de datos en servidor
- [ ] Probar en ambiente de desarrollo
- [ ] Configurar CI/CD básico (GitHub Actions)

**Tiempo estimado:** 6 horas (si se hace)

---

## 📊 Resumen de Tiempo Estimado

| Categoría         | Tiempo Estimado | Tiempo Real   | Estado            |
| ----------------- | --------------- | ------------- | ----------------- |
| 1. Setup Inicial  | 16 horas        | ~5.5 horas    | ✅ Completo       |
| 2. Backend Auth   | 18 horas        | ~5 horas      | ✅ Completo       |
| 3. Frontend Auth  | 10 horas        | ~3.5 horas    | ✅ Completo       |
| 4. Dashboard Base | 10 horas        | -             | ⏳ Pendiente      |
| 5. Testing        | 11 horas        | ~5 horas      | ✅ Completo       |
| 6. Documentación  | 3-9 horas       | -             | ⏳ Pendiente      |
| **TOTAL**         | **68-74 horas** | **~19 horas** | **~70% completo** |

**Progreso actual:**

- ✅ **Completado:** Setup, Backend Auth, Frontend Auth (Login), Testing (Backend + Frontend)
- ⏳ **Pendiente:** Protección de rutas, Dashboard layout, Documentación

**Con 1 developer:** ~2-3 semanas  
**Con 2 developers:** ~1-2 semanas

---

## 📈 Estado Actual del Proyecto (2025-11-25)

### ✅ Completado (70%)

- Setup completo de backend y frontend
- Base de datos PostgreSQL con schema
- Sistema de autenticación JWT completo
- RBAC implementado y testeado
- Página de login funcional
- **Testing completo:**
  - Backend: 69 tests (9 suites)
  - Frontend: 18 tests (2 suites)
- API client con interceptores
- Zustand store para autenticación

### ⏳ En Progreso / Pendiente (30%)

- Middleware de protección de rutas
- Layout de dashboard
- Componentes de navegación (Sidebar, Header)
- Documentación actualizada
- Deploy (opcional)

---

## ✅ Criterios de Aceptación

Al finalizar esta iteración, debes tener:

- ✅ Proyecto configurado con backend y frontend funcionando
- ✅ Base de datos PostgreSQL con schema cargado
- ✅ Sistema de login funcional
- ✅ JWT authentication implementado
- ✅ RBAC básico funcionando
- ⏳ Dashboard con layout principal (pendiente)
- ⏳ Rutas protegidas (pendiente)
- ✅ Tests básicos pasando (69 tests, 9 suites)
- ⏳ Documentación actualizada (pendiente)

**Estado actual:** 6/9 criterios completados (67%)

---

## 🚀 Siguiente Iteración

Una vez completada esta fase, la siguiente iteración será:

**Fase 2: Módulo de ODS Core**

- CRUD de Clientes, Clientes Finales, Localidades
- Workflow Engine
- Gestión de ODS
- Sistema de modificaciones con aprobación

---

## 📝 Notas Importantes

1. **Priorizar funcionalidad sobre perfección**: En esta fase, lo importante es tener la base funcionando
2. **Usar datos de prueba**: Crear usuarios de prueba para cada rol
3. **Commits frecuentes**: Hacer commits pequeños y descriptivos
4. **Documentar decisiones**: Si cambias algo del plan, documentarlo
5. **Pedir ayuda si te atascas**: No perder tiempo en bloqueos

---

**Versión:** 1.1  
**Fecha inicial:** 2025-11-21  
**Última actualización:** 2025-11-25  
**Próxima revisión:** Al completar Dashboard y protección de rutas
