# SGCV2 - Sistema de Gestión y Control para XTEL Comunicaciones

Sistema integral de gestión y control para empresa de telecomunicaciones, con workflow flexible, gestión de equipos, logística y facturación.

## 📋 Índice

- [Descripción General](#descripción-general)
- [Documentación](#documentación)
- [Stack Tecnológico](#stack-tecnológico)
- [Características Principales](#características-principales)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Roadmap](#roadmap)

---

## 🎯 Descripción General

SGCV2 es un sistema de gestión empresarial diseñado específicamente para XTEL Comunicaciones, empresa contratista de telecomunicaciones que presta servicios a carriers (Movistar, Digitel, Movilnet).

El sistema gestiona el ciclo completo de:

- **Órdenes de Servicio (ODS)** con workflow flexible
- **Logística** de equipos, herramientas e insumos
- **Personal técnico** y asignaciones
- **Facturación** y finanzas
- **Reportes** y analytics

---

## 📚 Documentación

### Documentos de Análisis

| Documento                                              | Descripción                                                                | Tamaño |
| ------------------------------------------------------ | -------------------------------------------------------------------------- | ------ |
| **[docs/SGCV2.md](docs/SGCV2.md)**                     | Requerimientos iniciales y procesos de negocio                             | 24 KB  |
| **[docs/analisis_diseno.md](docs/analisis_diseno.md)** | Análisis completo, requerimientos funcionales/no funcionales, casos de uso | 86 KB  |

### Modelado y Diseño

| Documento                                                      | Descripción                                      | Tamaño  |
| -------------------------------------------------------------- | ------------------------------------------------ | ------- |
| **[docs/diagrama_dominio.md](docs/diagrama_dominio.md)**       | Modelo de dominio completo con diagramas Mermaid | 26.5 KB |
| **[docs/PLAN_IMPLEMENTACION.md](docs/PLAN_IMPLEMENTACION.md)** | Plan de implementación tecnológico (24 semanas)  | 18.8 KB |

### Base de Datos

| Archivo                                                                  | Descripción                           | Tamaño  |
| ------------------------------------------------------------------------ | ------------------------------------- | ------- |
| **[database/schema.sql](database/schema.sql)**                           | DDL PostgreSQL completo (45 tablas)   | 34 KB   |
| **[database/workflow_validation.sql](database/workflow_validation.sql)** | Funciones de validación de workflow   | 8.5 KB  |
| **[database/seed_data.sql](database/seed_data.sql)**                     | Datos iniciales (workflows, permisos) | 18.5 KB |
| **[docs/DATABASE_GUIDE.md](docs/DATABASE_GUIDE.md)**                     | Guía completa del esquema de BD       | 9.5 KB  |
| **[docs/ESTADOS_DINAMICOS.md](docs/ESTADOS_DINAMICOS.md)**               | Decisión de diseño: VARCHAR vs ENUM   | 9.2 KB  |

### Tareas

| Archivo                                | Descripción                                            |
| -------------------------------------- | ------------------------------------------------------ |
| **[TAREAS_FASE1.md](TAREAS_FASE1.md)** | ⭐ Lista detallada de tareas para la primera iteración |

---

## 🛠️ Stack Tecnológico

### Backend

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js + TypeScript
- **ORM**: Prisma
- **Autenticación**: Passport.js + JWT
- **Validación**: Zod

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: Zustand + React Query
- **Formularios**: React Hook Form + Zod
- **Tablas**: TanStack Table

### Base de Datos

- **Motor**: PostgreSQL 15+
- **Extensiones**: uuid-ossp, pgcrypto

### DevOps

- **Containerización**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: VPS / AWS / Vercel + Railway

---

## ✨ Características Principales

### 🔄 Sistema de Workflow Flexible

- ✅ Workflows personalizados por tipo de servicio
- ✅ Estados dinámicos (no hardcoded)
- ✅ Transiciones configurables con validaciones
- ✅ Sistema de aprobaciones
- ✅ Auditoría completa de cambios
- ✅ Versionamiento de workflows

### 📦 Gestión de Logística

- ✅ Tracking individual de equipos por serial
- ✅ Control de herramientas con préstamos
- ✅ Gestión de stock de insumos
- ✅ Notas de entrega/devolución
- ✅ Alertas de stock mínimo

### 👥 Gestión de Personal

- ✅ Técnicos con especialidades
- ✅ Asignación a ODS
- ✅ Calendario de técnicos
- ✅ Control de disponibilidad

### 💰 Módulo Financiero

- ✅ Generación de proformas
- ✅ Facturación automática
- ✅ Control de pagos
- ✅ Cuentas por cobrar
- ✅ Dashboard financiero

### 🔐 Seguridad

- ✅ RBAC (Role-Based Access Control)
- ✅ 11 roles predefinidos
- ✅ Permisos granulares
- ✅ Auditoría de acciones
- ✅ Autenticación JWT

### 📊 Reportes

- ✅ Dashboard ejecutivo
- ✅ Métricas en tiempo real
- ✅ Exportación a Excel/PDF
- ✅ Gráficos y analytics

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 20+
- PostgreSQL 15+
- Docker (opcional)

### Setup con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd sgcv2

# 2. Copiar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Levantar servicios
docker-compose up -d

# 4. Ejecutar migraciones
docker-compose exec backend npm run migrate

# 5. Cargar datos iniciales
docker-compose exec db psql -U postgres -d sgcv2 -f /sql/seed_data.sql
```

### Setup Manual

```bash
# 1. Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# 2. Crear base de datos
createdb sgcv2

# 3. Ejecutar schema
psql -d sgcv2 -f schema.sql
psql -d sgcv2 -f workflow_validation.sql
psql -d sgcv2 -f seed_data.sql

# 4. Configurar Prisma
cd backend
npx prisma generate
npx prisma migrate dev

# 5. Iniciar servicios
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Acceder a:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api-docs

---

## 📁 Estructura del Proyecto

```
sgcv2/
├── docs/                       # Documentación
│   ├── SGCV2.md
│   ├── analisis_diseno.md
│   ├── diagrama_dominio.md
│   ├── PLAN_IMPLEMENTACION.md
│   ├── DATABASE_GUIDE.md
│   └── ESTADOS_DINAMICOS.md
├── database/                   # Scripts SQL
│   ├── schema.sql
│   ├── workflow_validation.sql
│   └── seed_data.sql
├── backend/                    # API Node.js (por crear)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── ods/
│   │   │   ├── workflow/
│   │   │   ├── equipos/
│   │   │   ├── logistica/
│   │   │   └── finanzas/
│   │   ├── shared/
│   │   ├── prisma/
│   │   └── config/
│   ├── tests/
│   └── package.json
├── frontend/                   # Next.js App (por crear)
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   └── hooks/
├── docker-compose.yml
├── TAREAS_FASE1.md
└── README.md
```

---

## 🗺️ Roadmap

### ✅ Fase 0: Análisis y Diseño (Completado)

- [x] Análisis de requerimientos
- [x] Modelado de dominio
- [x] Diseño de base de datos
- [x] Plan de implementación
- [x] Workflows iniciales

### 🔄 Fase 1: Setup y Autenticación (En Progreso)

- [ ] Configuración de proyecto
- [ ] Sistema de autenticación
- [ ] RBAC
- [ ] Dashboard base

### ⏳ Fase 2: Módulo ODS Core (Próximo)

- [ ] CRUD de clientes y localidades
- [ ] Workflow engine
- [ ] Gestión de ODS
- [ ] Sistema de modificaciones

### ⏳ Fase 3-10: Implementación Completa

Ver [PLAN_IMPLEMENTACION.md](PLAN_IMPLEMENTACION.md) para detalles completos.

**Tiempo estimado total**: 24 semanas (~6 meses)

---

## 📊 Estadísticas del Proyecto

### Documentación

- **7 documentos** técnicos
- **~200 KB** de documentación
- **72 requerimientos** funcionales
- **10 categorías** de req. no funcionales

### Base de Datos

- **45 tablas**
- **15 tipos enumerados**
- **20+ índices**
- **8 triggers** automáticos
- **7 funciones/vistas**

### Funcionalidades

- **7 tipos** de servicio
- **3 workflows** iniciales configurados
- **11 roles** de usuario
- **20+ permisos** granulares
- **10 módulos** principales

---

## 👥 Equipo Recomendado

- **1 Full-Stack Developer Senior** (Lead)
- **1-2 Full-Stack Developers**
- **1 UI/UX Designer** (part-time)
- **1 QA Tester** (últimas fases)

---

## 📝 Licencia

Propietario - XTEL Comunicaciones

---

## 📞 Contacto

Para más información sobre el proyecto, consultar la documentación técnica o contactar al equipo de desarrollo.

---

## 🔗 Enlaces Rápidos

- [Documentación de API](http://localhost:4000/api-docs) (cuando esté corriendo)
- [Guía de Base de Datos](DATABASE_GUIDE.md)
- [Plan de Implementación](PLAN_IMPLEMENTACION.md)
- [Modelo de Dominio](diagrama_dominio.md)

---

**Versión**: 1.0  
**Última actualización**: 2025-11-21  
**Estado**: Fase de Diseño Completada ✅
