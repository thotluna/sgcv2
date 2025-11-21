# Plan de Branching - SGCV2

## 🎯 Estrategia Acordada

### **Fase Actual: Setup (Fase 1)**
- ✅ Trabajar directamente en `develop`
- ✅ Commits frecuentes en `develop`
- ✅ **Merge a `main` al finalizar Fase 1 completa** → `v0.1.0`

### **Fases Siguientes: Features (Fase 2+)**
- ✅ Crear rama `feature/*` para cada módulo/funcionalidad
- ✅ Trabajar en la feature
- ✅ Mergear feature a `develop` al terminar
- ✅ **Merge a `main` al completar la fase** → `v0.2.0`, `v0.3.0`, etc.

---

## 📋 Plan de Trabajo por Fases

### **FASE 1: Setup y Autenticación** (Actual)

**Rama:** `develop` (trabajo directo)

**Tareas:**
- [x] 1.1 Configuración de Repositorio
- [x] 1.2 Setup de Backend
- [x] 1.3 Setup de Frontend
- [x] 1.4 Docker Setup
- [x] 1.5 Setup de Base de Datos
- [ ] 1.6 Configurar Prisma ← Siguiente
- [ ] 2.1-2.3 Backend - Autenticación
- [ ] 3.1-3.3 Frontend - Autenticación
- [ ] 4.1-4.2 Dashboard Base
- [ ] 5.1-5.3 Testing
- [ ] 6.1 Documentación

**Al finalizar:**
```bash
git checkout main
git merge develop --no-ff -m "chore: merge Phase 1 - Setup & Authentication"
git tag -a v0.1.0 -m "Release v0.1.0: Phase 1 Complete

- Backend: Node.js + Express + TypeScript + Prisma
- Frontend: Next.js 14 + Tailwind + shadcn/ui
- Database: PostgreSQL 15 with Docker
- Authentication: JWT + RBAC
- Dashboard: Base layout and navigation
- Tests: Basic coverage"

git push origin main
git push origin develop
git push origin v0.1.0
git checkout develop
```

---

### **FASE 2: Módulo de ODS Core**

**Estrategia:** Feature branches

#### **Feature 2.1: CRUD de Clientes**
```bash
git checkout develop
git checkout -b feature/clientes-crud

# Trabajar en la feature
git commit -m "feat(clientes): add Cliente model and API"
git commit -m "feat(clientes): add ClienteFinal CRUD"
git commit -m "feat(clientes): add Localidad management"
git commit -m "test(clientes): add integration tests"

# Al terminar
git checkout develop
git merge feature/clientes-crud --no-ff
git branch -d feature/clientes-crud
```

#### **Feature 2.2: Workflow Engine**
```bash
git checkout -b feature/workflow-engine

# Trabajar en la feature
git commit -m "feat(workflow): implement workflow state machine"
git commit -m "feat(workflow): add transition validation"
git commit -m "feat(workflow): add approval system"

# Al terminar
git checkout develop
git merge feature/workflow-engine --no-ff
git branch -d feature/workflow-engine
```

#### **Feature 2.3: Gestión de ODS**
```bash
git checkout -b feature/ods-management

# Trabajar en la feature
git commit -m "feat(ods): add ODS CRUD"
git commit -m "feat(ods): integrate workflow"
git commit -m "feat(ods): add modification tracking"

# Al terminar
git checkout develop
git merge feature/ods-management --no-ff
git branch -d feature/ods-management
```

**Al finalizar Fase 2:**
```bash
git checkout main
git merge develop --no-ff -m "chore: merge Phase 2 - ODS Core Module"
git tag -a v0.2.0 -m "Release v0.2.0: Phase 2 Complete - ODS Core"
git push origin main develop v0.2.0
git checkout develop
```

---

### **FASE 3: Logística**

**Features:**
- `feature/equipos-management`
- `feature/herramientas-management`
- `feature/insumos-management`
- `feature/vehiculos-management`

**Al finalizar:**
```bash
git tag -a v0.3.0 -m "Release v0.3.0: Phase 3 Complete - Logistics"
```

---

### **FASE 4: Finanzas**

**Features:**
- `feature/proformas`
- `feature/facturas`
- `feature/pagos`
- `feature/financial-reports`

**Al finalizar:**
```bash
git tag -a v0.4.0 -m "Release v0.4.0: Phase 4 Complete - Finance"
```

---

## 🔄 Flujo de Trabajo Visual

### **Fase 1 (Actual): Trabajo Directo en Develop**
```
main:     A
           \
develop:    B---C---D---E---F---G  ← commits directos
                                 ↑
                            trabajamos aquí
```

### **Fase 2+: Trabajo con Features**
```
main:     A-----------------------M (v0.1.0)
           \                     /
develop:    B---C---D---E---F---G---H---I---J
                 \         /     \     /
feature/clientes: 1---2---3       \   /
feature/workflow:                  4-5-6
```

---

## 📊 Timeline de Releases

| Versión | Contenido | Estimación |
|---------|-----------|------------|
| `v0.1.0` | Fase 1: Setup + Auth | Semana 3 |
| `v0.2.0` | Fase 2: ODS Core | Semana 6 |
| `v0.3.0` | Fase 3: Logística | Semana 9 |
| `v0.4.0` | Fase 4: Finanzas | Semana 12 |
| `v0.5.0` | Fase 5: Reportes | Semana 15 |
| `v1.0.0` | MVP Completo | Semana 24 |

---

## ✅ Checklist Antes de Mergear a Main

Antes de cada merge a `main`, verificar:

- [ ] Todos los tests pasan
- [ ] No hay errores de lint
- [ ] Backend levanta sin errores
- [ ] Frontend levanta sin errores
- [ ] Base de datos migra correctamente
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] README.md actualizado si es necesario

---

## 📝 Convención de Nombres de Features

```
feature/nombre-descriptivo

Ejemplos:
- feature/clientes-crud
- feature/workflow-engine
- feature/ods-management
- feature/equipos-tracking
- feature/financial-reports
- feature/user-notifications
```

---

## 🚀 Estado Actual

```
Rama actual: develop
Progreso Fase 1: 31% (5/16 secciones)
Próximo merge a main: Al completar Fase 1 → v0.1.0
Próxima feature branch: Fase 2 (ODS Core)
```

---

## 📚 Comandos de Referencia Rápida

```bash
# Ver en qué rama estás
git branch

# Ver estado del proyecto
git status

# Ver historial gráfico
git log --oneline --graph --all -20

# Crear feature branch
git checkout -b feature/nombre

# Mergear feature a develop
git checkout develop
git merge feature/nombre --no-ff
git branch -d feature/nombre

# Mergear develop a main (fin de fase)
git checkout main
git merge develop --no-ff
git tag -a v0.X.0 -m "Release vX.X.X: Description"
git checkout develop
```

---

**Estrategia aprobada:** ✅  
**Fecha:** 2025-11-21  
**Próximo milestone:** v0.1.0 (Fase 1 completa)
