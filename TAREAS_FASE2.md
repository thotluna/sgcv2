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

- [x] sistema de respuesta unica del api, ApiResponse<T>
- [x] Sistema de manejo de errores

#### 1.2 Módulo de Clientes (CRUD)

- [x] Crear módulo `clients/`:
  - [x] `clients.controller.ts`
  - [x] `clients.service.ts`
  - [x] `clients.routes.ts`
  - [x] DTOs (`create-client.dto.ts`, `update-client.dto.ts`)
- [x] Implementar endpoints:
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

- [x] Definir interfaces TypeScript (`Client`, `Location`, `Contact`)
- [x] Crear servicio `client.service.ts` en frontend (Axios)
- [x] Crear hooks (React Query o useEffect custom) para fetching de datos

#### 2.2 Listado de Clientes

- [x] Crear página `app/(main)/operations/customers/page.tsx`
- [x] Implementar tabla de datos (DataTable de shadcn/ui):
  - Columnas: Razón Social, RIF, Contacto Principal, Estado, Acciones
  - Paginación
  - [x] Buscador/Filtros
- [x] Header de sección con botón "Nuevo Cliente"

#### 2.3 Formulario de Cliente (Crear/Editar)

- [x] Crear formulario con `react-hook-form` + `zod`:
  - Datos básicos de la empresa
  - Validación de campos requeridos
- [x] Implementar vista de creación (Modal o Página dedicada)
- [x] Implementar vista de edición

#### 2.4 Gestión de Detalles (Localidades y Contactos)

- [x] Crear vista de detalle de cliente `app/(main)/operations/customers/[id]/page.tsx`
- [ ] Tab/Sección para Localidades:
  - Lista de localidades
  - Formulario para agregar/editar localidad
- [ ] Tab/Sección para Contactos:
  - Lista de contactos
  - Formulario para agregar/editar contacto

#### 2.5 Testing Frontend

- [x] Tests de renderizado de tabla
- [x] Tests de formulario (validaciones)

### 3. Backend - Gestión de Roles y Permisos

- [x] Definir capa de dominio (Entidades, Repositorios, Inputs, Excepciones)
- [x] Implementar Casos de Uso (Create, Update, List, Get, Delete, Add/Remove Permissions)
- [x] Implementar Servicios con Interface Segregation
- [x] Implementar Repositorios Prisma (Roles y Permisos)
- [x] Implementar Controladores y Rutas (CRUD completo de Roles y Listado de Permisos)
- [x] Implementar Tests del módulo Roles (Unitarios e Integración)

### 4. Frontend - Gestión de Roles y Permisos

- [x] Implementar listado de Roles con filtros y paginación
- [x] Implementar creación y edición de Roles con asignación de permisos
- [x] Implementar vista de solo lectura para todos los Permisos del sistema (Nuevo)
- [x] Tests unitarios y de integración para Roles y Permisos

---

## 📊 Criterios de Aceptación

- [x] Se pueden crear, leer, actualizar y "eliminar" (desactivar) Clientes.
- [ ] Un Cliente puede tener múltiples Localidades.
- [ ] Un Cliente puede tener múltiples Contactos.
- [x] Se pueden gestionar Roles (CRUD) y sus permisos asociados.
- [x] Existe una vista de solo lectura para todos los permisos del sistema.
- [x] Las validaciones de backend y frontend funcionan correctamente.
- [x] El código pasa los tests unitarios y de integración.
