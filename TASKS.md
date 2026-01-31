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
- **Backend de Locations (100%): ✅ Corregido error de Null constraint city**
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

- [x] **Locations UI**
  - [x] Crear componente `LocationsList`
  - [x] Crear formulario `LocationForm` (Create/Edit)
  - [x] Integrar en página de detalle de cliente (Layout con Tabs)
  - [x] Implementar Server Actions para Locations
  - [ ] Tests de componentes

- [x] **SubCustomers UI**
  - [x] Crear componente `SubCustomersList`
  - [x] Crear formulario `SubCustomerForm` (Creación unificada con Sede)
  - [x] Integrar en página de detalle de cliente
  - [x] Implementar Server Actions para SubCustomers (incluye creación combinada)
  - [x] Refactorizar Sidebar para soportar submenús (Clientes -> Listado/Sub Clientes)

- [ ] **Mejoras UX**
  - [x] Tabs para separar Locations y Contacts (Implementado en Layout Base)
  - [ ] Indicador visual de contacto primario
  - [x] Validaciones de formulario con Zod (Unificado en @sgcv2/shared)
  - [x] Manejo de errores con toast notifications (Integrado con Server Actions y useActionState)
  - [x] Soporte para No-JS y Server Actions en CustomerForm (Corregido error de tipos en useActionState y error de restricción NULL en Ciudad)

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

- [x] **Estandarización de Tablas**
  - [x] Crear componente genérico `ServerTable` para unificar lógica de orquestación. (Migrado a `DataTable`)
  - [x] Refactorizar `CustomersList` para usar el componente `DataTable`.
  - [x] Refactorizar `RolesList` para usar el componente `DataTable` (incluye backend sorting).
  - [x] Refactorizar `PermissionsList` para usar el componente `DataTable` (incluye backend sorting).
  - [x] Refactorizar `UsersList` para usar el componente `DataTable`.

**Estado:** ✅ Completado (Reducción de ~70% de boilerplate en tablas)

---

### 2.5 Re-arquitectura de Localidades (Página Global) 🟡 EN PROGRESO

**Objetivo:** Migrar de una pestaña jerárquica dentro de Clientes a una gestión global de sedes/localidades para mayor eficiencia operativa.

- [ ] **Backend**
  - [ ] Habilitar búsqueda global de sedes (hacer `customerId` opcional en la búsqueda)
  - [ ] Añadir filtro opcional por `subCustomerId` en el endpoint de sedes
- [ ] **Frontend**
  - [ ] Crear página global `/operations/locations` con `DataTable`
  - [ ] Implementar filtros globales (search, sub-customer, city)
  - [ ] Eliminar pestaña "Sedes" de `CustomerDetailPage`
  - [ ] Vincular tabla de Sub-clientes con la nueva página global mediante filtros en la URL

---

## 🔴 FASE 3: Workflow Engine (CRÍTICA)

**Objetivo:** Implementar el motor de workflows dinámicos para ODS  
**Prioridad:** 🔴 CRÍTICA (Bloqueante para ODS)  
**Estimación:** 4-6 semanas  
**Dependencias:** Ninguna

### 3.1 Backend - Modelo de Datos de Workflows

- [ ] **Schema Prisma**
  - [ ] Crear modelo `ServiceType`:

    ```prisma
    model ServiceType {
      id          Int       @id @default(autoincrement())
      code        String    @unique
      name        String
      description String?
      createdAt   DateTime  @default(now())
      updatedAt   DateTime  @updatedAt
      workflows   WorkflowDefinition[]

      @@map("service_types")
    }
    ```

  - [ ] Crear modelo `WorkflowDefinition`:

    ```prisma
    model WorkflowDefinition {
      id            Int       @id @default(autoincrement())
      serviceTypeId Int
      name          String
      description   String?
      version       Int       @default(1)
      isActive      Boolean   @default(true)
      createdAt     DateTime  @default(now())
      updatedAt     DateTime  @updatedAt

      serviceType   ServiceType @relation(fields: [serviceTypeId], references: [id])
      states        WorkflowState[]
      transitions   WorkflowTransition[]

      @@unique([serviceTypeId, version])
      @@map("workflow_definitions")
    }
    ```

  - [ ] Crear modelo `WorkflowState`:

    ```prisma
    model WorkflowState {
      id          Int       @id @default(autoincrement())
      workflowId  Int
      code        String
      name        String
      description String?
      isInitial   Boolean   @default(false)
      isFinal     Boolean   @default(false)
      color       String?
      order       Int
      createdAt   DateTime  @default(now())
      updatedAt   DateTime  @updatedAt

      workflow    WorkflowDefinition @relation(fields: [workflowId], references: [id], onDelete: Cascade)
      transitionsFrom WorkflowTransition[] @relation("FromState")
      transitionsTo   WorkflowTransition[] @relation("ToState")

      @@unique([workflowId, code])
      @@map("workflow_states")
    }
    ```

  - [ ] Crear modelo `WorkflowTransition`:

    ```prisma
    model WorkflowTransition {
      id                  Int       @id @default(autoincrement())
      workflowId          Int
      fromStateId         Int
      toStateId           Int
      actionName          String
      requiresApproval    Boolean   @default(false)
      requiresJustification Boolean @default(false)
      createdAt           DateTime  @default(now())
      updatedAt           DateTime  @updatedAt

      workflow            WorkflowDefinition @relation(fields: [workflowId], references: [id], onDelete: Cascade)
      fromState           WorkflowState @relation("FromState", fields: [fromStateId], references: [id])
      toState             WorkflowState @relation("ToState", fields: [toStateId], references: [id])
      validationRules     ValidationRule[]

      @@unique([workflowId, fromStateId, toStateId])
      @@map("workflow_transitions")
    }
    ```

  - [ ] Crear modelo `ValidationRule`:

    ```prisma
    model ValidationRule {
      id           Int       @id @default(autoincrement())
      transitionId Int
      ruleType     ValidationRuleType
      condition    Json
      errorMessage String
      createdAt    DateTime  @default(now())
      updatedAt    DateTime  @updatedAt

      transition   WorkflowTransition @relation(fields: [transitionId], references: [id], onDelete: Cascade)

      @@map("validation_rules")
    }

    enum ValidationRuleType {
      FIELD_VALIDATION
      RESOURCE_VALIDATION
      PERMISSION_VALIDATION
      BUSINESS_VALIDATION
      TEMPORAL_VALIDATION
    }
    ```

- [ ] **Ejecutar Migraciones**
  - [ ] `npx prisma migrate dev --name add_workflow_engine`
  - [ ] Verificar que las tablas se crearon correctamente

**Estimación:** 1 semana

---

### 3.2 Backend - Workflow Engine Core

- [ ] **Domain Layer**
  - [ ] Crear entidades de dominio (WorkflowDefinition, WorkflowState, etc.)
  - [ ] Crear interfaces de repositorio
  - [ ] Crear excepciones de dominio:
    - [ ] `InvalidTransitionException`
    - [ ] `WorkflowNotFoundException`
    - [ ] `StateNotFoundException`
    - [ ] `ValidationFailedException`

- [ ] **Application Layer - Use Cases**
  - [ ] `CreateWorkflowUseCase`
  - [ ] `GetWorkflowByServiceTypeUseCase`
  - [ ] `ValidateTransitionUseCase`
  - [ ] `GetAvailableTransitionsUseCase`
  - [ ] `ExecuteTransitionUseCase`

- [ ] **Infrastructure Layer**
  - [ ] Implementar `WorkflowRepository`
  - [ ] Implementar `WorkflowStateRepository`
  - [ ] Implementar `WorkflowTransitionRepository`
  - [ ] Implementar `ValidationRuleRepository`
  - [ ] Implementar `WorkflowEngine` (motor de validación y ejecución)

- [ ] **Workflow Engine Logic**
  - [ ] Método `validateTransition(workflowId, fromState, toState, context)`
  - [ ] Método `getAvailableTransitions(workflowId, currentState, userId)`
  - [ ] Método `executeTransition(workflowId, fromState, toState, userId, data)`
  - [ ] Sistema de validación de reglas (evaluar JSON conditions)

**Estimación:** 2 semanas

---

### 3.3 Backend - Workflow API

- [ ] **HTTP Layer**
  - [ ] Crear `WorkflowController`
  - [ ] Implementar endpoints:
    - [ ] `GET /api/workflows` - Listar workflows
    - [ ] `GET /api/workflows/:id` - Obtener workflow completo
    - [ ] `GET /api/workflows/service-type/:serviceTypeId` - Workflow por tipo de servicio
    - [ ] `POST /api/workflows` - Crear workflow (Admin only)
    - [ ] `PUT /api/workflows/:id` - Actualizar workflow
    - [ ] `GET /api/workflows/:id/states` - Estados del workflow
    - [ ] `GET /api/workflows/:id/transitions` - Transiciones disponibles
    - [ ] `POST /api/workflows/:id/validate-transition` - Validar transición

- [ ] **Testing**
  - [ ] Unit tests para WorkflowEngine
  - [ ] Unit tests para Use Cases
  - [ ] Integration tests para endpoints
  - [ ] Tests de validación de reglas

**Estimación:** 1 semana

---

### 3.4 Seed Data - Workflows Predefinidos

- [ ] **Crear Seed Script**
  - [ ] Definir 7 tipos de servicio:
    - Inspección/Site Survey
    - Instalación
    - Desinstalación
    - Migración
    - Mantenimiento Preventivo
    - Mantenimiento Correctivo
    - Asistencia Técnica
  - [ ] Crear workflow para Inspección (11 estados)
  - [ ] Crear workflow para Instalación (13 estados)
  - [ ] Crear workflow para Desinstalación (12 estados)
  - [ ] Crear workflow para Mantenimiento Correctivo (9 estados)
  - [ ] Definir transiciones para cada workflow
  - [ ] Definir reglas de validación básicas

- [ ] **Ejecutar Seed**
  - [ ] `npx prisma db seed`
  - [ ] Verificar que los workflows se cargaron correctamente

**Estimación:** 1 semana

---

### 3.5 Frontend - Workflow Visualization (Admin)

- [ ] **UI de Administración de Workflows**
  - [ ] Página `/admin/workflows`
  - [ ] Listado de workflows por tipo de servicio
  - [ ] Visualización de diagrama de estados (Mermaid o React Flow)
  - [ ] Vista de transiciones permitidas
  - [ ] Vista de reglas de validación

- [ ] **Formularios de Configuración** (Opcional para MVP)
  - [ ] Crear/Editar workflow
  - [ ] Agregar/Editar estados
  - [ ] Configurar transiciones
  - [ ] Definir reglas de validación

**Estimación:** 1 semana

---

## 🔴 FASE 4: Módulo ODS Core (CRÍTICA)

**Objetivo:** Implementar el módulo central de Órdenes de Servicio  
**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 6-8 semanas  
**Dependencias:** Fase 2 (Clientes), Fase 3 (Workflow Engine)

### 4.1 Backend - Modelo de Datos ODS

- [ ] **Schema Prisma**
  - [ ] Crear modelo `ServiceOrder` (ODS):

    ```prisma
    model ServiceOrder {
      id                String   @id @default(uuid())
      internalNumber    String   @unique
      clientOrderNumber String
      serviceTypeId     Int
      customerId        String
      locationId        String?
      currentState      String
      description       String?
      initialDiagnosis  String?
      requestDate       DateTime @default(now())
      createdBy         Int
      createdAt         DateTime @default(now())
      updatedAt         DateTime @updatedAt

      serviceType       ServiceType @relation(fields: [serviceTypeId], references: [id])
      customer          Customer @relation(fields: [customerId], references: [id])
      location          CustomerLocation? @relation(fields: [locationId], references: [id])
      creator           User @relation(fields: [createdBy], references: [id])
      stateHistory      StateHistory[]
      modifications     OrderModification[]

      @@map("service_orders")
    }
    ```

  - [ ] Crear modelo `StateHistory`:

    ```prisma
    model StateHistory {
      id            Int       @id @default(autoincrement())
      orderId       String
      previousState String?
      newState      String
      changedBy     Int
      approvedBy    Int?
      observations  String?
      changedAt     DateTime  @default(now())

      order         ServiceOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
      user          User @relation("StateChangedBy", fields: [changedBy], references: [id])
      approver      User? @relation("StateApprovedBy", fields: [approvedBy], references: [id])

      @@map("state_history")
    }
    ```

  - [ ] Crear modelo `OrderModification`:

    ```prisma
    model OrderModification {
      id                Int       @id @default(autoincrement())
      orderId           String
      modificationType  ModificationType
      previousState     String?
      newState          String?
      justification     String
      requiresApproval  Boolean   @default(false)
      isApproved        Boolean?
      requestedBy       Int
      approvedBy        Int?
      requestedAt       DateTime  @default(now())
      approvedAt        DateTime?
      additionalData    Json?

      order             ServiceOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
      requester         User @relation("ModificationRequester", fields: [requestedBy], references: [id])
      approver          User? @relation("ModificationApprover", fields: [approvedBy], references: [id])

      @@map("order_modifications")
    }

    enum ModificationType {
      STATE_CHANGE
      SCOPE_CHANGE
      PAUSE
      RESCHEDULE
      CANCELLATION
      REACTIVATION
    }
    ```

- [ ] **Ejecutar Migraciones**

**Estimación:** 1 semana

---

### 4.2 Backend - ODS CRUD

- [ ] **Domain Layer**
  - [ ] Crear entidades de dominio
  - [ ] Crear interfaces de repositorio
  - [ ] Crear excepciones de dominio

- [ ] **Application Layer**
  - [ ] `CreateServiceOrderUseCase`
  - [ ] `GetServiceOrderByIdUseCase`
  - [ ] `ListServiceOrdersUseCase` (con filtros y paginación)
  - [ ] `UpdateServiceOrderUseCase`
  - [ ] `ChangeOrderStateUseCase` (integrado con Workflow Engine)
  - [ ] `RequestOrderModificationUseCase`
  - [ ] `ApproveOrderModificationUseCase`

- [ ] **Infrastructure Layer**
  - [ ] Implementar `ServiceOrderRepository`
  - [ ] Implementar `StateHistoryRepository`
  - [ ] Implementar `OrderModificationRepository`
  - [ ] Implementar `ServiceOrderService`

- [ ] **HTTP Layer**
  - [ ] Crear `ServiceOrderController`
  - [ ] Implementar endpoints:
    - [ ] `POST /api/orders` - Crear ODS
    - [ ] `GET /api/orders` - Listar ODS (con filtros)
    - [ ] `GET /api/orders/:id` - Obtener ODS
    - [ ] `PUT /api/orders/:id` - Actualizar ODS
    - [ ] `POST /api/orders/:id/change-state` - Cambiar estado
    - [ ] `GET /api/orders/:id/history` - Historial de estados
    - [ ] `POST /api/orders/:id/modifications` - Solicitar modificación
    - [ ] `PUT /api/modifications/:id/approve` - Aprobar modificación

- [ ] **Testing**
  - [ ] Unit tests completos
  - [ ] Integration tests
  - [ ] Tests de integración con Workflow Engine

**Estimación:** 3 semanas

---

### 4.3 Frontend - ODS UI

- [ ] **Listado de ODS**
  - [ ] Página `/operations/orders`
  - [ ] DataTable con columnas:
    - Número ODS, Cliente, Tipo Servicio, Estado, Fecha, Acciones
  - [ ] Filtros avanzados:
    - Por estado, cliente, tipo de servicio, rango de fechas
  - [ ] Paginación
  - [ ] Indicadores visuales de estado (badges con colores)

- [ ] **Formulario de Creación**
  - [ ] Modal o página `/operations/orders/new`
  - [ ] Selección de tipo de servicio
  - [ ] Selección de cliente y localidad
  - [ ] Campos dinámicos según tipo de servicio
  - [ ] Validación con Zod

- [ ] **Vista de Detalle**
  - [ ] Página `/operations/orders/[id]`
  - [ ] Información general de la ODS
  - [ ] Timeline de estados
  - [ ] Botones de acción según estado actual
  - [ ] Historial de modificaciones

- [ ] **Cambio de Estado**
  - [ ] Modal de cambio de estado
  - [ ] Mostrar solo transiciones permitidas (desde Workflow Engine)
  - [ ] Campo de observaciones
  - [ ] Validación de permisos

- [ ] **Testing**
  - [ ] Tests de componentes
  - [ ] Tests de Server Actions

**Estimación:** 2 semanas

---

### 4.4 Dashboard de ODS

- [ ] **Métricas y KPIs**
  - [ ] Card: Total de ODS activas
  - [ ] Card: ODS por estado
  - [ ] Card: ODS atrasadas
  - [ ] Card: ODS completadas este mes

- [ ] **Gráficos**
  - [ ] Gráfico de barras: ODS por tipo de servicio
  - [ ] Gráfico de línea: Tendencia de ODS por mes
  - [ ] Gráfico de dona: Distribución por estado

- [ ] **Tabla de ODS Recientes**
  - [ ] Últimas 10 ODS creadas/actualizadas
  - [ ] Link rápido a detalle

**Estimación:** 1 semana

---

## 🟠 FASE 5: Logística - Equipos

**Objetivo:** Implementar gestión de equipos del cliente  
**Prioridad:** 🟠 Alta  
**Estimación:** 3-4 semanas  
**Dependencias:** Fase 4 (ODS)

### 5.1 Backend - Modelo de Equipos

- [ ] **Schema Prisma**
  - [ ] Crear modelo `Equipment`:

    ```prisma
    model Equipment {
      id            String   @id @default(uuid())
      serial        String   @unique
      ownerId       String
      technologyId  Int?
      brand         String?
      model         String?
      lifecycleState EquipmentState
      locationId    String?
      warehouseLocation String?
      condition     EquipmentCondition
      receivedAt    DateTime
      observations  String?
      createdAt     DateTime @default(now())
      updatedAt     DateTime @updatedAt

      owner         Customer @relation(fields: [ownerId], references: [id])
      location      CustomerLocation? @relation(fields: [locationId], references: [id])
      movements     EquipmentMovement[]

      @@map("equipment")
    }

    enum EquipmentState {
      WAREHOUSE
      IN_TRANSIT
      INSTALLED
      PENDING_DELIVERY_NOTE
      DELIVERED
    }

    enum EquipmentCondition {
      NEW
      USED
      OPERATIONAL
      FAILED
    }
    ```

  - [ ] Crear modelo `EquipmentMovement`:

    ```prisma
    model EquipmentMovement {
      id            Int       @id @default(autoincrement())
      equipmentId   String
      orderId       String?
      previousState EquipmentState?
      newState      EquipmentState
      movedBy       Int
      observations  String?
      movedAt       DateTime  @default(now())

      equipment     Equipment @relation(fields: [equipmentId], references: [id], onDelete: Cascade)
      order         ServiceOrder? @relation(fields: [orderId], references: [id])
      user          User @relation(fields: [movedBy], references: [id])

      @@map("equipment_movements")
    }
    ```

  - [ ] Crear modelo `DeliveryNote`:

    ```prisma
    model DeliveryNote {
      id            String   @id @default(uuid())
      orderId       String
      noteNumber    String   @unique
      state         DeliveryNoteState
      carrier       String?
      trackingNumber String?
      dispatchedAt  DateTime?
      deliveredAt   DateTime?
      createdAt     DateTime @default(now())
      updatedAt     DateTime @updatedAt

      order         ServiceOrder @relation(fields: [orderId], references: [id])
      equipment     EquipmentDeliveryNote[]

      @@map("delivery_notes")
    }

    enum DeliveryNoteState {
      PENDING
      IN_TRANSIT
      DELIVERED
    }
    ```

- [ ] **Ejecutar Migraciones**

**Estimación:** 1 semana

---

### 5.2 Backend - Equipment CRUD y Tracking

- [ ] **Application Layer**
  - [ ] `ReceiveEquipmentUseCase`
  - [ ] `AssignEquipmentToOrderUseCase`
  - [ ] `ChangeEquipmentStateUseCase`
  - [ ] `ReturnEquipmentUseCase`
  - [ ] `CreateDeliveryNoteUseCase`
  - [ ] `GetEquipmentHistoryUseCase`
  - [ ] `ListEquipmentUseCase` (con filtros)

- [ ] **Infrastructure Layer**
  - [ ] Implementar repositorios
  - [ ] Implementar servicios

- [ ] **HTTP Layer**
  - [ ] Crear `EquipmentController`
  - [ ] Implementar endpoints completos

- [ ] **Testing**

**Estimación:** 2 semanas

---

### 5.3 Frontend - Equipment UI

- [ ] **Inventario de Equipos**
  - [ ] Página `/logistics/equipment`
  - [ ] Listado con filtros (estado, cliente, localidad)
  - [ ] Vista de timeline de movimientos

- [ ] **Recepción de Equipos**
  - [ ] Formulario de recepción masiva
  - [ ] Escaneo de seriales (opcional)

- [ ] **Asignación a ODS**
  - [ ] Selector de equipos disponibles
  - [ ] Cambio de estado a TRÁNSITO

- [ ] **Notas de Entrega**
  - [ ] Listado de notas pendientes
  - [ ] Generación de PDF
  - [ ] Tracking de estado

**Estimación:** 1 semana

---

## 🟡 FASE 6: Logística - Herramientas e Insumos

**Objetivo:** Gestión de herramientas e insumos  
**Prioridad:** 🟡 Media  
**Estimación:** 2-3 semanas  
**Dependencias:** Fase 4 (ODS)

### 6.1 Backend - Herramientas

- [ ] Modelo de datos (Tool, ToolRequest, ToolAssignment)
- [ ] CRUD de herramientas
- [ ] Sistema de solicitudes
- [ ] Tracking de asignaciones
- [ ] Alertas de herramientas no devueltas

**Estimación:** 1.5 semanas

---

### 6.2 Backend - Insumos

- [ ] Modelo de datos (Supply, SupplyAssignment)
- [ ] Catálogo de insumos
- [ ] Control de inventario
- [ ] Asignación a ODS

**Estimación:** 1.5 semanas

---

## 🛠️ Infraestructura y DevOps

- [x] Configuración de monorepo (pnpm workspaces)
- [x] Setup de CI/CD (GitHub Actions)
- [x] Dockerización de base de datos para tests
- [ ] Monitoreo y logs centralizados
- [ ] Backup automático de base de datos

---

## 📑 Notas Generales

- Todos los desarrollos deben seguir la arquitectura definida en `master.md`.
- El frontend debe utilizar Shadcn UI y ser responsive.
- El backend debe implementar DI con InversifyJS.
- La comunicación entre FE y BE se hace a través de DTOs compartidos.

**Versión:** 1.0  
**Creado:** 2026-01-25  
**Próxima Revisión:** Al completar Fase 2
