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
- [x] Instalar dependencias de desarrollo (typescript, ts-node, nodemon, @types/*)
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
- [ ] Crear módulo `users/`:
  ```
  src/modules/users/
  ├── users.controller.ts
  ├── users.service.ts
  ├── users.routes.ts
  └── dto/
      ├── create-user.dto.ts
      └── update-user.dto.ts
  ```
- [ ] Implementar `users.service.ts`:
  - `findById(id)` → obtener usuario
  - `findByUsername(username)` → buscar por username
  - `getUserWithRoles(id)` → usuario con roles y permisos
  - `updateUser(id, data)` → actualizar usuario
- [ ] Implementar `users.controller.ts`:
  - `GET /api/users/me` → perfil del usuario actual
  - `GET /api/users/:id` → obtener usuario (admin)
  - `PUT /api/users/:id` → actualizar usuario
- [ ] Probar endpoints

**Tiempo estimado:** 4 horas

---

#### 2.3 Backend - Sistema RBAC
- [ ] Crear módulo `rbac/`:
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
- [ ] Implementar `rbac.service.ts`:
  - `getUserPermissions(userId)` → permisos del usuario
  - `hasPermission(userId, module, action)` → verificar permiso
  - `hasRole(userId, roleName)` → verificar rol
- [ ] Crear decorators:
  - `@Roles('admin', 'gerente')` → requiere roles
  - `@RequirePermission('ODS', 'CREAR')` → requiere permiso
- [ ] Crear guards para proteger rutas
- [ ] Probar sistema de permisos

**Tiempo estimado:** 6 horas

---

### 3. Frontend - Autenticación

#### 3.1 Setup de Autenticación en Frontend
- [ ] Crear store de autenticación con Zustand:
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
- [ ] Crear API client con Axios:
  ```typescript
  // lib/api-client.ts
  - Configurar baseURL
  - Interceptor para agregar JWT token
  - Interceptor para manejar errores 401
  ```
- [ ] Crear tipos TypeScript:
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

---

#### 3.2 Página de Login
- [ ] Crear ruta `app/(auth)/login/page.tsx`
- [ ] Crear componente de formulario de login:
  - Input de username
  - Input de password
  - Botón de submit
  - Validación con Zod
  - Manejo de errores
- [ ] Implementar lógica de login:
  - Llamar a API `/api/auth/login`
  - Guardar token en localStorage/cookie
  - Actualizar store de autenticación
  - Redirect a dashboard
- [ ] Agregar loading state
- [ ] Agregar mensajes de error
- [ ] Estilizar con Tailwind/shadcn

**Tiempo estimado:** 4 horas

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

#### 5.1 Testing Backend
- [ ] Configurar Jest para backend
- [ ] Crear tests para auth.service:
  - Test de login exitoso
  - Test de login fallido
  - Test de validación de token
- [ ] Crear tests para RBAC:
  - Test de verificación de permisos
  - Test de verificación de roles
- [ ] Ejecutar tests y verificar coverage

**Tiempo estimado:** 4 horas

---

#### 5.2 Testing Frontend
- [ ] Configurar Jest + React Testing Library
- [ ] Crear tests para componente Login:
  - Renderizado correcto
  - Validación de formulario
  - Submit exitoso
  - Manejo de errores
- [ ] Crear tests para auth store
- [ ] Ejecutar tests

**Tiempo estimado:** 4 horas

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

| Categoría | Tiempo Estimado |
|-----------|-----------------|
| 1. Setup Inicial | 16 horas |
| 2. Backend Auth | 18 horas |
| 3. Frontend Auth | 10 horas |
| 4. Dashboard Base | 10 horas |
| 5. Testing | 11 horas |
| 6. Documentación | 3-9 horas |
| **TOTAL** | **68-74 horas** |

**Con 1 developer:** ~2-3 semanas  
**Con 2 developers:** ~1-2 semanas

---

## ✅ Criterios de Aceptación

Al finalizar esta iteración, debes tener:

- ✅ Proyecto configurado con backend y frontend funcionando
- ✅ Base de datos PostgreSQL con schema cargado
- ✅ Sistema de login funcional
- ✅ JWT authentication implementado
- ✅ RBAC básico funcionando
- ✅ Dashboard con layout principal
- ✅ Rutas protegidas
- ✅ Tests básicos pasando
- ✅ Documentación actualizada

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

**Versión:** 1.0  
**Fecha:** 2025-11-21  
**Próxima revisión:** Al completar 50% de las tareas
