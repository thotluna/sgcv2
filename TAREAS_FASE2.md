# Tareas - Segunda Iteración (Fase 2: Gestión de Clientes)

## 🎯 Objetivo de la Iteración

Implementar el módulo completo de Gestión de Clientes, permitiendo administrar empresas (Carriers), sus localidades y contactos. Esto servirá como base fundamental para las Órdenes de Servicio (ODS).

**Prioridad:** Alta (Bloqueante para módulo de ODS)

---

## 📋 Lista de Tareas

### 1. Backend - Gestión de Clientes

#### 1.1 Modelo de Datos y Migraciones

- [x] Definir schema Prisma para `Client` (Empresa)
  - Razón Social, RIF/NIT, Dirección Fiscal, Teléfono, Email, Estado (Activo/Inactivo)
- [ ] Definir schema Prisma para `ClientLocation` (Localidades/Sedes)
  - Nombre, Dirección, Coordenadas (opcional), Ciudad, Estado/Provincia
- [ ] Definir schema Prisma para `ClientContact` (Contactos)
  - Nombre, Cargo, Teléfono, Email
- [ ] Ejecutar migraciones

### URGENTE

- [ ] sistema de respuesta unica del api, ApiResponse<T>
- [ ] Sistema de manejo de errores

#### 1.2 Módulo de Clientes (CRUD)

- [ ] Crear módulo `clients/`:
  - [ ] `clients.controller.ts`
  - [x] `clients.service.ts`
  - [ ] `clients.routes.ts`
  - [ ] DTOs (`create-client.dto.ts`, `update-client.dto.ts`)
- [ ] Implementar endpoints:
  - [x] `GET /api/clients` (Listado con paginación y filtros)
  - [x] `GET /api/clients/:id` (Detalle con localidades)
  - [x] `POST /api/clients` (Crear)
  - [x] `PUT /api/clients/:id` (Actualizar)
  - [x] `DELETE /api/clients/:id` (Soft delete o desactivación)

#### 1.3 Sub-recursos (Localidades y Contactos)

- [ ] Implementar gestión de localidades:
  - `POST /api/clients/:id/locations`
  - `PUT /api/locations/:id`
  - `DELETE /api/locations/:id`
- [ ] Implementar gestión de contactos:
  - `POST /api/clients/:id/contacts`
  - `PUT /api/contacts/:id`
  - `DELETE /api/contacts/:id`

#### 1.4 Testing Backend

- [x] Unit tests para `ClientsService`
- [x] Integration tests para endpoints de Clientes

---

### 2. Frontend - Gestión de Clientes

#### 2.1 Servicios y Tipos

- [ ] Definir interfaces TypeScript (`Client`, `Location`, `Contact`)
- [ ] Crear servicio `client.service.ts` en frontend (Axios)
- [ ] Crear hooks (React Query o useEffect custom) para fetching de datos

#### 2.2 Listado de Clientes

- [ ] Crear página `app/(dashboard)/operations/clients/page.tsx`
- [ ] Implementar tabla de datos (DataTable de shadcn/ui):
  - Columnas: Razón Social, RIF, Contacto Principal, Estado, Acciones
  - Paginación
  - Buscador/Filtros
- [ ] Header de sección con botón "Nuevo Cliente"

#### 2.3 Formulario de Cliente (Crear/Editar)

- [ ] Crear formulario con `react-hook-form` + `zod`:
  - Datos básicos de la empresa
  - Validación de campos requeridos
- [ ] Implementar vista de creación (Modal o Página dedicada)
- [ ] Implementar vista de edición

#### 2.4 Gestión de Detalles (Localidades y Contactos)

- [ ] Crear vista de detalle de cliente `app/(dashboard)/operations/clients/[id]/page.tsx`
- [ ] Tab/Sección para Localidades:
  - Lista de localidades
  - Formulario para agregar/editar localidad
- [ ] Tab/Sección para Contactos:
  - Lista de contactos
  - Formulario para agregar/editar contacto

#### 2.5 Testing Frontend

- [ ] Tests de renderizado de tabla
- [ ] Tests de formulario (validaciones)

---

## 📊 Criterios de Aceptación

- [ ] Se pueden crear, leer, actualizar y "eliminar" (desactivar) Clientes.
- [ ] Un Cliente puede tener múltiples Localidades.
- [ ] Un Cliente puede tener múltiples Contactos.
- [ ] Las validaciones de backend y frontend funcionan correctamente.
- [ ] El código pasa los tests unitarios y de integración.
