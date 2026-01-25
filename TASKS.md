# TASKS - SGCV2 Project

**Última Actualización:** 2026-01-25  
**Estado del Proyecto:** Fase 2 en Progreso (~60%)  
**Cumplimiento Global:** ~25% del sistema completo

---

## 📊 Resumen de Progreso

| Fase                                           | Estado         | Progreso | Prioridad  |
| ---------------------------------------------- | -------------- | -------- | ---------- |
| **Fase 1: Setup y Autenticación**              | ✅ Completa    | 95%      | -          |
| **Fase 2: Gestión de Clientes**                | 🟡 En Progreso | 75%      | 🔴 Alta    |
| **Fase 3: Workflow Engine**                    | ❌ No Iniciada | 0%       | 🔴 CRÍTICA |
| **Fase 4: Módulo ODS Core**                    | ❌ No Iniciada | 0%       | 🔴 CRÍTICA |
| **Fase 5: Logística - Equipos**                | ❌ No Iniciada | 0%       | 🟠 Alta    |
| **Fase 6: Logística - Herramientas e Insumos** | ❌ No Iniciada | 0%       | 🟡 Media   |
| **Fase 7: Finanzas**                           | ❌ No Iniciada | 0%       | 🟡 Media   |
| **Fase 8: RRHH**                               | ❌ No Iniciada | 0%       | 🟢 Baja    |

---

## 🎯 FASE 2: Completar Gestión de Clientes (EN PROGRESO)

**Objetivo:** Finalizar el módulo completo de Clientes con Localidades y Contactos  
**Prioridad:** 🔴 Alta  
**Estimación:** 1-2 semanas  
**Progreso Actual:** 75%

**✅ Completado:**

- CRUD completo de Customers
- CRUD completo de SubCustomers
- **Backend de Locations (100%):**
  - ✅ Domain Layer (Entity, Repository, Services, Exceptions)
  - ✅ Application Layer (5 Use Cases: Create, Update, Delete, Get, List)
  - ✅ Infrastructure Layer (Repository Prisma, Service, Mapper)
  - ✅ HTTP Layer (Controller, Routes integradas)
  - ✅ Tests completos (9 test suites pasando)

**🟡 Pendiente:**

- Frontend UI para Locations
- Backend y Frontend para Contacts

### 2.1 Backend - Customer Locations ✅ COMPLETADO

- [x] **Application Layer**
  - [x] Crear `CreateLocationUseCase`
  - [x] Crear `UpdateLocationUseCase`
  - [x] Crear `DeleteLocationUseCase`
  - [x] Crear `GetLocationsByCustomerUseCase`
  - [x] Crear `GetLocationByIdUseCase`

- [x] **Infrastructure Layer**
  - [x] Implementar `LocationRepository` con Prisma
  - [x] Implementar `LocationService` (implementa `ILocationService`)

- [x] **HTTP Layer**
  - [x] Crear `LocationController`
  - [x] Implementar endpoints:
    - [x] `POST /api/customers/:customerId/locations` - Crear localidad
    - [x] `GET /api/customers/:customerId/locations` - Listar localidades
    - [x] `GET /api/locations/:id` - Obtener localidad
    - [x] `PUT /api/locations/:id` - Actualizar localidad
    - [x] `DELETE /api/locations/:id` - Eliminar localidad
  - [x] Crear rutas en `location.routes.ts`
  - [x] Integrar con `app.ts`

- [x] **Testing**
  - [x] Unit tests para `LocationService`
  - [x] Unit tests para Use Cases
  - [x] Integration tests para endpoints

**Estado:** ✅ Completado (9 test suites pasando)

---

### 2.2 Backend - Customer Contacts

- [ ] **Domain Layer**
  - [ ] Crear schema Prisma para `CustomerContact`:

    ```prisma
    model CustomerContact {
      id            String   @id @default(uuid())
      customerId    String
      locationId    String?
      firstName     String
      lastName      String
      position      String?
      phone         String?
      email         String?
      isPrimary     Boolean  @default(false)
      createdAt     DateTime @default(now())
      updatedAt     DateTime @updatedAt

      customer      Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
      location      CustomerLocation? @relation(fields: [locationId], references: [id], onDelete: SetNull)

      @@map("customer_contacts")
    }
    ```

  - [ ] Crear DTOs (CreateContactDTO, UpdateContactDTO)
  - [ ] Crear Domain Entity `CustomerContact`
  - [ ] Crear Domain Exceptions

- [ ] **Application Layer**
  - [ ] Crear Use Cases (Create, Update, Delete, GetByCustomer, GetById)

- [ ] **Infrastructure Layer**
  - [ ] Implementar `ContactRepository`
  - [ ] Implementar `ContactService`

- [ ] **HTTP Layer**
  - [ ] Crear `ContactController`
  - [ ] Implementar endpoints:
    - [ ] `POST /api/customers/:customerId/contacts`
    - [ ] `GET /api/customers/:customerId/contacts`
    - [ ] `GET /api/contacts/:id`
    - [ ] `PUT /api/contacts/:id`
    - [ ] `DELETE /api/contacts/:id`

- [ ] **Testing**
  - [ ] Unit tests completos
  - [ ] Integration tests

**Estimación:** 1 semana

---

### 2.3 Frontend - Customer Locations y Contacts

- [ ] **Locations UI**
  - [x] Crear componente `LocationsList` (Skeleton/Placeholder)
  - [ ] Crear formulario `LocationForm` (Create/Edit)
  - [x] Integrar en página de detalle de cliente (Layout con Tabs)
  - [ ] Implementar Server Actions para Locations
  - [ ] Tests de componentes

- [ ] **Contacts UI**
  - [ ] Crear componente `ContactsList`
  - [ ] Crear formulario `ContactForm` (Create/Edit)
  - [ ] Integrar en página de detalle de cliente
  - [ ] Implementar Server Actions para Contacts
  - [ ] Tests de componentes

- [ ] **Mejoras UX**
  - [x] Tabs para separar Locations y Contacts (Implementado en Layout Base)
  - [ ] Indicador visual de contacto primario
  - [x] Validaciones de formulario con Zod (Unificado en @sgcv2/shared)
  - [x] Manejo de errores con toast notifications (Integrado con Server Actions y useActionState)
  - [x] Soporte para No-JS y Server Actions en CustomerForm

**Estimación:** 1 semana

---

### 2.4 Mejoras al Módulo de Clientes

- [x] **Unificación de Esquemas**
  - [x] Esquemas de validación movidos a `@sgcv2/shared` para consistencia.
  - [x] Eliminación de lógica de validación duplicada en frontend.

- [ ] **Validaciones de Negocio**
  - [ ] Validar que `taxId` sea único y válido
  - [ ] Validar que `code` sea único (5 caracteres)
  - [ ] Validar que al menos haya un contacto primario por cliente

- [ ] **Historial de Servicios** (Preparación)
  - [ ] Agregar vista de "Servicios Prestados" (placeholder)
  - [ ] Preparar relación con ODS (para fase futura)

**Estimación:** 3 días

---
