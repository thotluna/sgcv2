# Auth Module Refactoring Tasks

## Objetivo

Refactorizar el módulo de Autenticación para adherirse estrictamente a la Arquitectura Hexagonal y los principios SOLID (específicamente Segregación de Interfaces). El objetivo es centralizar la lógica "core" de autenticación, desacoplar el acceso a datos y limpiar la deuda técnica.

## 1. Segregación de Interfaces y Unificación de Servicios (ISP)

- [x] **Definir Interfaces Segregadas (Domain Layer):**
  - Crear interfaces específicas para cada consumidor en `src/modules/auth/domain/interfaces/`:
    - `IPasswordService`: Métodos `hashPassword`, `comparePassword`.
    - `ITokenService`: Métodos `generateToken`, `verifyToken`.
    - `IUserValidationService`: Método `validateCredentials(username, password)`.
  - Eliminar interfaces redundantes o genéricas antiguas.

- [x] **Centralizar Implementación (Infrastructure Layer):**
  - Refactorizar `AuthServiceImpl` para que implemente todas las interfaces anteriores o coordine las utilidades necesarias.
  - Evaluar si `ValidationServiceImpl` debe fusionarse dentro de este servicio central o mantenerse solo si aporta lógica compleja.

- [x] **Actualizar Consumidores:**
  - `LocalStrategy`: Debe depender de `IUserValidationService`.
  - `JwtStrategy`: Debe depender de `IUserFinderForAuth` (o `ITokenService` si la validación se mueve allí).
  - `LoginUseCase`: Debe depender de `ITokenService` y `IPasswordService` (o `IUserValidationService` si se delega la validación completa).

- [x] **Actualizar Contenedor DI:**
  - Ajustar `container.ts` para vincular las nuevas interfaces a la implementación única (o implementaciones coordinadas).

---

## 2. Abstracción de Repositorio en JWT Strategy

- [x] **Actualizar Interfaz de Repositorio:**
  - Modificar `UserFinderForAuth` (o crear una nueva interfaz `IAuthUserRepository`) para incluir:
    - `findByIdForAuth(id: number): Promise<AuthUser | null>`

- [x] **Implementar en Repositorio:**
  - Actualizar `UsersPrismaRepository` (en módulo `users`) para implementar el nuevo método `findByIdForAuth`.

- [x] **Refactorizar `JwtStrategy`:**
  - Eliminar importación directa de `prisma` (`import { prisma } ...`).
  - Inyectar la interfaz `UserFinderForAuth` (o la nueva interfaz definida) en el constructor.
  - Reemplazar la llamada directa a `prisma.user.findUnique` por el método del repositorio inyectado.

---

## 3. Limpieza de Deuda Técnica (Cleanup)

- [x] **Eliminar Archivos Legacy:**
  - Borrar `auth.service.old.ts`.
  - Borrar `auth.controller.old.ts`.
  - Borrar `auth.routes.old.ts`.

- [x] **Revisar DTO Mapping:**
  - Revisar el mapeo manual de `UserDto` en `LoginUseCaseService` (donde se asignan strings vacíos). Evaluar si el repositorio debe devolver un objeto más completo o si el DTO de respuesta debe ser más estricto.

## 4. Testing

- [ ] **Actualizar Tests Unitarios:**
  - Actualizar mocks en `jwt.strategy.test.ts` para reflejar la inyección de dependencia del repositorio.
  - Actualizar mocks en `local.strategy.test.ts` y `login.use-case.test.ts` según los cambios de interfaces.
  - Verificar que todos los tests pasen (82/82).
