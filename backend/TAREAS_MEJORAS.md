# Tareas de Mejora - Backend SGCV2

**Fecha de creación:** 2025-11-30  
**Última actualización:** 2025-11-30

---

## 📋 Índice

- [1. Arquitectura y Organización](#1-arquitectura-y-organización)
- [2. Validación y DTOs](#2-validación-y-dtos)
- [3. Manejo de Errores](#3-manejo-de-errores)
- [4. Seguridad](#4-seguridad)
- [5. Base de Datos y Prisma](#5-base-de-datos-y-prisma)
- [6. TypeScript y Tipos](#6-typescript-y-tipos)
- [7. Testing](#7-testing)
- [8. Performance](#8-performance)
- [9. Configuración y Variables de Entorno](#9-configuración-y-variables-de-entorno)
- [10. Código Limpio y Mantenibilidad](#10-código-limpio-y-mantenibilidad)
- [11. API y Respuestas](#11-api-y-respuestas)
- [12. Documentación](#12-documentación)
- [13. DevOps y CI/CD](#13-devops-y-cicd)
- [14. Mejoras Específicas por Archivo](#14-mejoras-específicas-por-archivo)
- [Priorización](#priorización)

---

## 1. Arquitectura y Organización 🏗️

### [ ] 1.1 Implementar Inyección de Dependencias

**Prioridad:** Media  
**Complejidad:** Alta  
**Tiempo estimado:** 6-8 horas

**Descripción:**  
Los controladores instancian directamente sus servicios en el constructor (`this.authService = new AuthService()`). Esto dificulta el testing y crea acoplamiento fuerte.

**Archivos afectados:**

- `src/modules/auth/auth.controller.ts`
- `src/modules/users/users.controller.ts`
- `src/modules/customer/customer.controller.ts`

**Solución propuesta:**

- Implementar un contenedor de IoC como `tsyringe` o `inversify`
- Usar decoradores para inyección automática
- Facilitar el mocking en tests

**Ejemplo:**

```typescript
@injectable()
export class AuthController {
  constructor(@inject('AuthService') private authService: AuthService) {}
}
```

---

### [ ] 1.2 Mover Validaciones de Controladores a DTOs/Middleware

**Prioridad:** Alta  
**Complejidad:** Media  
**Tiempo estimado:** 4-6 horas

**Descripción:**  
Los controladores contienen lógica de validación (validación de email, longitud de password, etc.). Esta lógica debería estar en DTOs con decoradores de validación o en middleware dedicado.

**Archivos afectados:**

- `src/modules/users/users.controller.ts` (líneas 102-115, 152-162)
- `src/modules/auth/auth.controller.ts` (líneas 17-19)

**Solución propuesta:**

- Usar `class-validator` en DTOs
- Crear middleware de validación global
- Eliminar validaciones manuales de controladores

---

### [ ] 1.3 Centralizar Constantes Duplicadas

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 1 hora

**Descripción:**  
`SALT_ROUNDS` está definido en `AuthService` y `UsersService`. Otras constantes como longitud mínima de password están hardcodeadas.

**Archivos afectados:**

- `src/modules/auth/auth.service.ts` (línea 6)
- `src/modules/users/users.service.ts` (línea 6)

**Solución propuesta:**

- Crear `src/config/constants.ts`
- Centralizar todas las constantes de la aplicación
- Exportar desde un único lugar

**Ejemplo:**

```typescript
// src/config/constants.ts
export const AUTH_CONSTANTS = {
  SALT_ROUNDS: 10,
  MIN_PASSWORD_LENGTH: 6,
  JWT_EXPIRES_IN: '1d',
} as const;
```

---

## 2. Validación y DTOs ✅

### [ ] 2.1 Implementar Validación en DTOs

**Prioridad:** Alta  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
Los DTOs actuales son clases vacías sin validación. Implementar validación con `class-validator` y `class-transformer`.

**Archivos afectados:**

- `src/modules/auth/dto/login.dto.ts`
- `src/modules/users/dto/create-user.dto.ts`
- `src/modules/users/dto/update-user.dto.ts`
- `src/modules/customer/dto/*.dto.ts`

**Pasos:**

1. Instalar dependencias: `npm install class-validator class-transformer`
2. Agregar decoradores de validación a DTOs
3. Crear middleware de validación global
4. Actualizar tests

**Ejemplo:**

```typescript
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
```

---

### [ ] 2.2 Crear Middleware de Validación Global

**Prioridad:** Alta  
**Complejidad:** Media  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
Crear un middleware que valide automáticamente los DTOs en cada request.

**Solución propuesta:**

- Crear `src/shared/middleware/validation.middleware.ts`
- Usar `class-transformer` para transformar body a DTO
- Usar `class-validator` para validar
- Retornar errores de validación en formato estándar

---

### [ ] 2.3 Validación de IDs en Parámetros

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2 horas

**Descripción:**  
La conversión y validación de IDs (`parseInt(req.params.id)`) se repite en múltiples endpoints.

**Archivos afectados:**

- `src/modules/users/users.controller.ts` (líneas 75, 136, 192)
- `src/modules/customer/customer.controller.ts`

**Solución propuesta:**

- Crear un middleware o pipe de validación de parámetros
- Validar que sean números válidos
- Retornar error 400 si no son válidos

---

## 3. Manejo de Errores ⚠️

### [ ] 3.1 Implementar Sistema de Logging Profesional

**Prioridad:** Alta  
**Complejidad:** Media  
**Tiempo estimado:** 4-5 horas

**Descripción:**  
Se usa `console.error` en 18 lugares diferentes. Implementar un sistema de logging profesional.

**Archivos afectados:**

- `src/app.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/users/users.controller.ts`
- `src/modules/customer/customer.controller.ts`
- `src/modules/rbac/guards/*.guard.ts`

**Pasos:**

1. Instalar `winston` o `pino`: `npm install winston`
2. Crear `src/config/logger.ts`
3. Configurar niveles de log (error, warn, info, debug)
4. Configurar rotación de archivos
5. Reemplazar todos los `console.error` y `console.log`

**Ejemplo:**

```typescript
// src/config/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

### [ ] 3.2 Mejorar Manejo de Errores con Contexto

**Prioridad:** Media  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
En los bloques catch, se pierde el stack trace del error original. Incluir más contexto en desarrollo.

**Solución propuesta:**

- Crear clase de error personalizada con contexto
- Incluir stack trace en desarrollo
- Integrar con sistema de tracking (Sentry, Rollbar) en producción
- Sanitizar información sensible antes de loguear

---

### [ ] 3.3 Estandarizar Manejo de Errores en Servicios

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
Algunos servicios lanzan errores (`throw new Error('User not found')`), otros retornan `null`. Estandarizar el enfoque.

**Archivos afectados:**

- `src/modules/users/users.service.ts`
- `src/modules/customer/customer.service.ts`
- `src/modules/auth/auth.service.ts`

**Solución propuesta:**

- Decidir una estrategia: lanzar errores o retornar null
- Crear errores personalizados por tipo (NotFoundError, ValidationError, etc.)
- Documentar la estrategia elegida

---

## 4. Seguridad 🔒

### [ ] 4.1 Validar JWT_SECRET al Inicio

**Prioridad:** Alta  
**Complejidad:** Baja  
**Tiempo estimado:** 1 hora

**Descripción:**  
No hay validación de que `JWT_SECRET` exista al inicio de la aplicación. Podría fallar en runtime.

**Archivo afectado:**

- `src/modules/auth/auth.service.ts` (línea 18)
- `src/server.ts` o `src/app.ts`

**Solución propuesta:**

- Validar variables de entorno críticas al arrancar
- Fallar rápido si faltan variables requeridas
- Usar `zod` o `joi` para validación

---

### [ ] 4.2 Implementar Rate Limiting

**Prioridad:** Alta  
**Complejidad:** Baja  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
No hay protección contra fuerza bruta en `/api/auth/login`.

**Pasos:**

1. Instalar `express-rate-limit`: `npm install express-rate-limit`
2. Configurar límite para endpoint de login
3. Configurar límite global para API
4. Agregar headers informativos

**Ejemplo:**

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
});

app.post('/api/auth/login', loginLimiter, authController.login);
```

---

### [ ] 4.3 Revisar Configuración de CORS

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 1 hora

**Descripción:**  
El CORS permite requests sin origin (`if (!origin) return callback(null, true)`). Esto puede ser un riesgo de seguridad.

**Archivo afectado:**

- `src/app.ts` (líneas 27-29)

**Solución propuesta:**

- Revisar si realmente se necesita permitir requests sin origin
- Si es para desarrollo, solo permitirlo en modo development
- Documentar la decisión

---

### [ ] 4.4 Proteger Endpoint /health

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 1 hora

**Descripción:**  
El endpoint `/health` expone información del entorno y estado de la base de datos.

**Archivo afectado:**

- `src/app.ts` (líneas 48-66)

**Solución propuesta:**

- Limitar información en producción
- Considerar proteger con autenticación básica
- O crear endpoint `/health/detailed` protegido

---

### [ ] 4.5 Sanitización de Logs

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2 horas

**Descripción:**  
Asegurarse de que los DTOs nunca logueen passwords u otra información sensible.

**Solución propuesta:**

- Crear función de sanitización de objetos
- Aplicar antes de loguear
- Agregar tests para verificar

---

## 5. Base de Datos y Prisma 💾

### [ ] 5.1 Optimizar Queries N+1

**Prioridad:** Media  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
En `getUserWithRoles`, se hacen queries anidadas con múltiples includes. Revisar si se puede optimizar.

**Archivos afectados:**

- `src/modules/auth/auth.service.ts` (líneas 30-48)
- `src/modules/users/users.service.ts` (líneas 58-109)

**Solución propuesta:**

- Usar `select` específicos en lugar de traer todo
- Considerar queries separadas si es más eficiente
- Medir performance antes y después

---

### [ ] 5.2 Implementar Transacciones

**Prioridad:** Alta  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
Operaciones como `createUser` que involucran múltiples writes deberían estar en una transacción.

**Archivos afectados:**

- `src/modules/users/users.service.ts` (líneas 148-201, 203-270)

**Solución propuesta:**

- Usar `prisma.$transaction` para operaciones atómicas
- Manejar rollback en caso de error
- Agregar tests para verificar atomicidad

**Ejemplo:**

```typescript
async createUser(data: CreateUserDto) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ ... });
    if (data.roleIds?.length) {
      await tx.userRole.createMany({ ... });
    }
    return user;
  });
}
```

---

### [ ] 5.3 Manejo de Desconexión de Prisma

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 1 hora

**Descripción:**  
No hay manejo de desconexión de Prisma al cerrar la aplicación.

**Archivo afectado:**

- `src/server.ts`

**Solución propuesta:**

- Agregar `prisma.$disconnect()` en handlers de SIGTERM/SIGINT
- Asegurar cierre graceful de conexiones

---

### [ ] 5.4 Límite Máximo en Paginación

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 1 hora

**Descripción:**  
La paginación acepta cualquier valor de `limit`. Establecer un máximo para prevenir queries costosas.

**Archivos afectados:**

- `src/modules/users/users.service.ts` (línea 111)
- `src/modules/customer/customer.service.ts` (línea 53)

**Solución propuesta:**

- Establecer límite máximo (ej: 100)
- Validar en controlador o DTO
- Documentar el límite

---

## 6. TypeScript y Tipos 📘

### [ ] 6.1 Eliminar Uso de `any`

**Prioridad:** Alta  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
Hay múltiples usos de `any` en el código que reducen la seguridad de tipos.

**Archivos afectados:**

- `src/modules/auth/auth.controller.ts` (línea 52: `req.user as any`)
- `src/modules/users/users.controller.ts` (líneas 19, 138, 145)
- `src/modules/auth/strategies/jwt.strategy.ts` (línea 5: `payload: any`)

**Solución propuesta:**

- Crear interfaces para tipos específicos
- Extender tipos de Express para incluir `user`
- Usar type guards donde sea necesario

**Ejemplo:**

```typescript
// src/types/express.d.ts
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
```

---

### [ ] 6.2 Tipar Errores Correctamente

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2 horas

**Descripción:**  
Los errores en catch se tipan como `any`. Usar `unknown` y hacer type guards.

**Archivos afectados:**

- `src/modules/users/users.controller.ts` (líneas 120, 172)

**Solución propuesta:**

- Cambiar `error: any` a `error: unknown`
- Crear type guards para verificar tipo de error
- Manejar diferentes tipos de error apropiadamente

---

### [ ] 6.3 Tipos de Retorno Explícitos

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
Algunas funciones no tienen tipo de retorno explícito.

**Solución propuesta:**

- Agregar tipos de retorno a todas las funciones públicas
- Usar inferencia solo para funciones privadas simples
- Mejorar documentación del código

---

## 7. Testing 🧪

### [ ] 7.1 Mejorar Cobertura de Estrategias

**Prioridad:** Media  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
Las estrategias JWT y Local tienen baja cobertura de tests.

**Archivos afectados:**

- `src/modules/auth/strategies/jwt.strategy.ts`
- `src/modules/auth/strategies/local.strategy.ts`

**Solución propuesta:**

- Crear tests unitarios para cada estrategia
- Mockear Prisma apropiadamente
- Probar casos de éxito y error
- Alcanzar >80% de cobertura

---

### [ ] 7.2 Mejorar Mocks de Prisma

**Prioridad:** Media  
**Complejidad:** Media  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
Asegurarse de que los tests usen mocks apropiados de Prisma para no depender de la base de datos real.

**Solución propuesta:**

- Usar `jest.mock` para mockear Prisma
- Crear factory de mocks reutilizables
- Documentar estrategia de mocking

---

### [ ] 7.3 Tests de Integración End-to-End

**Prioridad:** Baja  
**Complejidad:** Alta  
**Tiempo estimado:** 6-8 horas

**Descripción:**  
Faltan tests de integración end-to-end para flujos completos.

**Solución propuesta:**

- Crear tests para flujo: login → crear usuario → asignar rol
- Usar base de datos de test
- Limpiar datos después de cada test
- Probar flujos críticos de negocio

---

## 8. Performance ⚡

### [ ] 8.1 Implementar Caché de Permisos

**Prioridad:** Baja  
**Complejidad:** Alta  
**Tiempo estimado:** 6-8 horas

**Descripción:**  
Los permisos de usuario se consultan en cada request. Implementar caché para optimizar.

**Solución propuesta:**

- Instalar Redis: `npm install redis`
- Crear servicio de caché
- Cachear permisos por usuario
- Invalidar caché al cambiar roles/permisos
- Configurar TTL apropiado

---

### [ ] 8.2 Optimizar Queries con Select Específicos

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
Algunos queries traen todos los campos cuando solo se necesitan algunos.

**Archivos afectados:**

- Todos los servicios con queries de Prisma

**Solución propuesta:**

- Revisar cada query
- Usar `select` para traer solo campos necesarios
- Medir impacto en performance

---

## 9. Configuración y Variables de Entorno ⚙️

### [ ] 9.1 Validación de Variables de Entorno

**Prioridad:** Alta  
**Complejidad:** Media  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
No hay validación de variables de entorno al inicio de la aplicación.

**Pasos:**

1. Instalar `zod`: `npm install zod`
2. Crear `src/config/env.ts`
3. Definir schema de validación
4. Validar al arrancar la aplicación
5. Exportar variables tipadas

**Ejemplo:**

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
});

export const env = envSchema.parse(process.env);
```

---

### [ ] 9.2 Centralizar Configuración

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2 horas

**Descripción:**  
Hay valores por defecto hardcodeados en el código. Centralizar en archivo de configuración.

**Archivos afectados:**

- `src/app.ts`
- `src/server.ts`
- Varios servicios

**Solución propuesta:**

- Crear `src/config/app.config.ts`
- Centralizar todas las configuraciones
- Usar variables de entorno validadas

---

### [ ] 9.3 Usar Variable de Entorno para JWT_EXPIRES_IN

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 30 minutos

**Descripción:**  
`JWT_EXPIRES_IN` está en `.env.example` pero no se usa en el código (hardcoded a '1d').

**Archivo afectado:**

- `src/modules/auth/auth.service.ts` (línea 18)

**Solución propuesta:**

- Usar `process.env.JWT_EXPIRES_IN` en lugar de '1d'
- Validar con schema de env

---

## 10. Código Limpio y Mantenibilidad 🧹

### [ ] 10.1 Traducir Comentarios a Inglés

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 30 minutos

**Descripción:**  
Hay comentarios en español en `jest.config.ts`. Mantener consistencia en inglés.

**Archivo afectado:**

- `jest.config.ts` (líneas 10, 15, 17)

**Solución propuesta:**

- Traducir comentarios a inglés
- Revisar otros archivos por comentarios en español

---

### [ ] 10.2 Reemplazar Magic Numbers con Constantes

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 1-2 horas

**Descripción:**  
Valores como `10` (SALT_ROUNDS), `6` (longitud mínima de password) deberían ser constantes nombradas.

**Solución propuesta:**

- Crear archivo de constantes
- Reemplazar todos los magic numbers
- Documentar el significado de cada constante

---

### [ ] 10.3 Eliminar Duplicación de Código

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
La lógica de "eliminar passwordHash" se repite en múltiples lugares.

**Archivos afectados:**

- `src/modules/auth/auth.controller.ts` (líneas 31, 64)
- `src/modules/users/users.service.ts`

**Solución propuesta:**

- Crear función helper `excludePassword(user)`
- O crear transformer/serializer
- Usar en todos los lugares donde se retorna usuario

**Ejemplo:**

```typescript
// src/shared/utils/user.helpers.ts
export function excludePassword<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
```

---

### [ ] 10.4 Limpiar Carpeta Middleware Vacía

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 15 minutos

**Descripción:**  
Hay una carpeta `shared/middleware` con solo un `.gitkeep`.

**Solución propuesta:**

- Si no se va a usar, eliminarla
- O implementar middlewares globales (logging, error handling)

---

## 11. API y Respuestas 🌐

### [ ] 11.1 Estandarizar Formato de /health

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 30 minutos

**Descripción:**  
El endpoint `/health` usa un formato de respuesta diferente al resto (no usa `AppResponse`).

**Archivo afectado:**

- `src/app.ts` (líneas 48-66)

**Solución propuesta:**

- Usar `ResponseHelper.success()` para consistencia
- O documentar por qué usa formato diferente

---

### [ ] 11.2 Mejorar Mensajes de Error

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
Mensajes como "An error occurred" no son útiles. Proporcionar más contexto cuando sea seguro.

**Solución propuesta:**

- Crear mensajes de error más descriptivos
- Incluir códigos de error específicos
- Sanitizar información sensible

---

### [ ] 11.3 Implementar Versionado de API

**Prioridad:** Baja  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
No hay versionado de API. Considerar `/api/v1/` para futuras versiones.

**Solución propuesta:**

- Cambiar rutas a `/api/v1/`
- Preparar estructura para múltiples versiones
- Documentar estrategia de versionado

---

## 12. Documentación 📚

### [ ] 12.1 Implementar Swagger/OpenAPI

**Prioridad:** Media  
**Complejidad:** Media  
**Tiempo estimado:** 4-6 horas

**Descripción:**  
No hay documentación automática de API.

**Pasos:**

1. Instalar `swagger-ui-express` y `swagger-jsdoc`
2. Crear `src/config/swagger.ts`
3. Documentar endpoints con JSDoc
4. Exponer en `/api/docs`

**Ejemplo:**

```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 */
```

---

### [ ] 12.2 Estandarizar JSDoc

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
Algunos métodos tienen comentarios JSDoc, otros no.

**Solución propuesta:**

- Agregar JSDoc a todos los métodos públicos
- Documentar parámetros y retornos
- Incluir ejemplos donde sea útil

---

### [ ] 12.3 Actualizar README

**Prioridad:** Media  
**Complejidad:** Baja  
**Tiempo estimado:** 2-3 horas

**Descripción:**  
Según `TAREAS_FASE1.md`, el README necesita actualización.

**Contenido a incluir:**

- Instrucciones de instalación actualizadas
- Variables de entorno necesarias
- Comandos para correr el proyecto
- Credenciales de prueba
- Arquitectura del proyecto
- Guía de contribución

---

## 13. DevOps y CI/CD 🚀

### [ ] 13.1 Configurar GitHub Actions

**Prioridad:** Media  
**Complejidad:** Media  
**Tiempo estimado:** 3-4 horas

**Descripción:**  
No hay CI/CD configurado para tests automáticos en PRs.

**Pasos:**

1. Crear `.github/workflows/ci.yml`
2. Configurar jobs para:
   - Linting
   - Tests unitarios
   - Tests de integración
   - Build
3. Ejecutar en cada PR y push a main

---

### [ ] 13.2 Agregar Scripts de NPM

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 1 hora

**Descripción:**  
Faltan scripts útiles en `package.json`.

**Scripts a agregar:**

- `test:watch` - Tests en modo watch
- `test:coverage` - Tests con reporte de cobertura
- `lint` - Ejecutar ESLint
- `lint:fix` - Ejecutar ESLint con --fix
- `format` - Ejecutar Prettier
- `format:check` - Verificar formato

---

### [ ] 13.3 Healthcheck de Docker

**Prioridad:** Baja  
**Complejidad:** Baja  
**Tiempo estimado:** 30 minutos

**Descripción:**  
El `docker-compose.yml` podría beneficiarse de healthchecks.

**Archivo afectado:**

- `docker-compose.yml`

**Solución propuesta:**

- Agregar healthcheck para PostgreSQL
- Configurar depends_on con condition: service_healthy

---

## 14. Mejoras Específicas por Archivo 📁

### [ ] 14.1 auth.controller.ts

**Prioridad:** Alta  
**Tiempo estimado:** 2 horas

**Mejoras:**

- Línea 52: Reemplazar `req.user as any` con tipo correcto
- Líneas 17-19: Mover validación manual a DTO
- Agregar JSDoc a métodos públicos

---

### [ ] 14.2 users.controller.ts

**Prioridad:** Alta  
**Tiempo estimado:** 3 horas

**Mejoras:**

- Líneas 102-115: Mover validaciones manuales a DTO
- Línea 145: Mover lógica de autorización a guard/middleware
- Línea 107: Usar DTO validator en lugar de regex manual
- Eliminar `as any` en múltiples líneas

---

### [ ] 14.3 auth.service.ts

**Prioridad:** Alta  
**Tiempo estimado:** 1 hora

**Mejoras:**

- Línea 18: Validar `JWT_SECRET` al inicio de la app
- Línea 18: Usar variable de entorno para `expiresIn`
- Agregar manejo de errores más específico

---

### [ ] 14.4 app.ts

**Prioridad:** Media  
**Tiempo estimado:** 2 horas

**Mejoras:**

- Líneas 48-66: Estandarizar formato de endpoint `/health`
- Líneas 99-106: Mejorar error handler con logging profesional
- Líneas 27-29: Revisar configuración de CORS

---

### [ ] 14.5 users.service.ts

**Prioridad:** Alta  
**Tiempo estimado:** 3 horas

**Mejoras:**

- Implementar transacciones en `createUser` y `updateUser`
- Optimizar queries con select específicos
- Estandarizar manejo de errores (throw vs return null)

---

### [ ] 14.6 customer.service.ts

**Prioridad:** Media  
**Tiempo estimado:** 2 horas

**Mejoras:**

- Implementar transacciones donde sea necesario
- Agregar límite máximo a paginación
- Estandarizar manejo de errores

---

## Priorización 🎯

### 🔴 Alta Prioridad (Seguridad y Estabilidad)

**Completar primero - Tiempo total: ~25-30 horas**

1. [ ] 4.1 - Validar JWT_SECRET al inicio
2. [ ] 4.2 - Implementar Rate Limiting
3. [ ] 3.1 - Sistema de logging profesional
4. [ ] 9.1 - Validación de variables de entorno
5. [ ] 5.2 - Implementar transacciones
6. [ ] 2.1 - Implementar validación en DTOs
7. [ ] 2.2 - Middleware de validación global
8. [ ] 1.2 - Mover validaciones a DTOs/Middleware
9. [ ] 6.1 - Eliminar uso de `any`
10. [ ] 14.1 - Mejoras en auth.controller.ts
11. [ ] 14.2 - Mejoras en users.controller.ts
12. [ ] 14.3 - Mejoras en auth.service.ts
13. [ ] 14.5 - Mejoras en users.service.ts

### 🟡 Media Prioridad (Calidad de Código)

**Siguiente fase - Tiempo total: ~35-40 horas**

1. [ ] 1.1 - Inyección de dependencias
2. [ ] 3.2 - Mejorar manejo de errores con contexto
3. [ ] 3.3 - Estandarizar manejo de errores
4. [ ] 4.3 - Revisar configuración de CORS
5. [ ] 4.5 - Sanitización de logs
6. [ ] 5.1 - Optimizar queries N+1
7. [ ] 5.3 - Manejo de desconexión de Prisma
8. [ ] 6.2 - Tipar errores correctamente
9. [ ] 7.1 - Mejorar cobertura de estrategias
10. [ ] 7.2 - Mejorar mocks de Prisma
11. [ ] 8.2 - Optimizar queries con select
12. [ ] 9.2 - Centralizar configuración
13. [ ] 10.3 - Eliminar duplicación de código
14. [ ] 11.2 - Mejorar mensajes de error
15. [ ] 12.1 - Implementar Swagger/OpenAPI
16. [ ] 12.3 - Actualizar README
17. [ ] 13.1 - Configurar GitHub Actions
18. [ ] 14.4 - Mejoras en app.ts
19. [ ] 14.6 - Mejoras en customer.service.ts

### 🟢 Baja Prioridad (Optimizaciones)

**Mejoras futuras - Tiempo total: ~25-30 horas**

1. [ ] 1.3 - Centralizar constantes
2. [ ] 2.3 - Validación de IDs en parámetros
3. [ ] 4.4 - Proteger endpoint /health
4. [ ] 5.4 - Límite máximo en paginación
5. [ ] 6.3 - Tipos de retorno explícitos
6. [ ] 7.3 - Tests de integración E2E
7. [ ] 8.1 - Caché de permisos
8. [ ] 9.3 - Usar variable para JWT_EXPIRES_IN
9. [ ] 10.1 - Traducir comentarios a inglés
10. [ ] 10.2 - Reemplazar magic numbers
11. [ ] 10.4 - Limpiar carpeta middleware vacía
12. [ ] 11.1 - Estandarizar formato de /health
13. [ ] 11.3 - Versionado de API
14. [ ] 12.2 - Estandarizar JSDoc
15. [ ] 13.2 - Agregar scripts de NPM
16. [ ] 13.3 - Healthcheck de Docker

---

## Resumen de Tiempo Estimado

| Prioridad | Tareas | Tiempo Estimado  |
| --------- | ------ | ---------------- |
| 🔴 Alta   | 13     | 25-30 horas      |
| 🟡 Media  | 19     | 35-40 horas      |
| 🟢 Baja   | 16     | 25-30 horas      |
| **TOTAL** | **48** | **85-100 horas** |

---

## Notas Finales

- **Enfoque iterativo**: No es necesario completar todas las tareas de una vez
- **Priorizar seguridad**: Las tareas de alta prioridad son críticas para producción
- **Testing continuo**: Agregar tests para cada mejora implementada
- **Documentar cambios**: Actualizar documentación al implementar mejoras
- **Code review**: Revisar cambios antes de mergear a main

---

**Última actualización:** 2025-11-30  
**Versión:** 1.0
