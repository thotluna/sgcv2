# Estrategia de Branching - SGCV2

## 📋 Estrategia Elegida: **GitHub Flow Simplificado**

Hemos optado por una versión simplificada de GitHub Flow, que es más ágil que Git Flow pero mantiene orden y control.

---

## 🌳 Estructura de Ramas

### **Ramas Principales**

#### 1. `main` (Producción)
- **Propósito:** Código en producción o listo para producción
- **Protección:** Solo se actualiza mediante Pull Requests desde `develop`
- **Estado:** Siempre debe estar estable y deployable
- **Tags:** Aquí se crean los tags de versión (v1.0.0, v1.1.0, etc.)

#### 2. `develop` (Desarrollo)
- **Propósito:** Rama de integración para desarrollo activo
- **Estado actual:** ✅ Estamos aquí ahora
- **Uso:** Aquí se integran todas las features antes de ir a producción
- **Commits directos:** Permitidos para cambios pequeños
- **Features grandes:** Se crean ramas feature/* que luego se mergean aquí

---

### **Ramas Temporales** (se crean según necesidad)

#### 3. `feature/*` (Características nuevas)
- **Naming:** `feature/nombre-descriptivo`
- **Ejemplos:**
  - `feature/auth-module`
  - `feature/ods-crud`
  - `feature/workflow-engine`
- **Origen:** Se crean desde `develop`
- **Destino:** Se mergean de vuelta a `develop`
- **Ciclo de vida:** Se eliminan después del merge

#### 4. `bugfix/*` (Corrección de bugs)
- **Naming:** `bugfix/descripcion-del-bug`
- **Ejemplos:**
  - `bugfix/login-validation`
  - `bugfix/workflow-transition`
- **Origen:** Se crean desde `develop`
- **Destino:** Se mergean a `develop`

#### 5. `hotfix/*` (Correcciones urgentes en producción)
- **Naming:** `hotfix/descripcion-urgente`
- **Ejemplos:**
  - `hotfix/security-patch`
  - `hotfix/critical-bug`
- **Origen:** Se crean desde `main` (¡único caso!)
- **Destino:** Se mergean a `main` Y `develop`
- **Uso:** Solo para emergencias en producción

---

## 🔄 Flujo de Trabajo

### **Escenario 1: Feature Nueva (Desarrollo Normal)**

```bash
# 1. Asegurarte de estar en develop actualizado
git checkout develop
git pull origin develop

# 2. Crear rama de feature
git checkout -b feature/auth-module

# 3. Trabajar en la feature (múltiples commits)
git add .
git commit -m "feat(auth): add login endpoint"
git commit -m "feat(auth): add JWT validation"
git commit -m "test(auth): add login tests"

# 4. Actualizar con develop (si pasó tiempo)
git checkout develop
git pull origin develop
git checkout feature/auth-module
git merge develop

# 5. Mergear a develop cuando esté lista
git checkout develop
git merge feature/auth-module --no-ff  # --no-ff crea commit de merge

# 6. Eliminar rama de feature
git branch -d feature/auth-module

# 7. Push a remoto
git push origin develop
```

### **Escenario 2: Cambio Pequeño (Commit Directo)**

```bash
# Para cambios pequeños (docs, configs, fixes menores)
git checkout develop
git add .
git commit -m "docs: update README with Docker instructions"
git push origin develop
```

### **Escenario 3: Release a Producción**

```bash
# 1. Asegurarte de que develop está estable
# 2. Mergear develop a main
git checkout main
git pull origin main
git merge develop --no-ff

# 3. Crear tag de versión
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. Push
git push origin main
git push origin v1.0.0
```

### **Escenario 4: Hotfix Urgente**

```bash
# 1. Crear hotfix desde main
git checkout main
git checkout -b hotfix/critical-security-patch

# 2. Hacer el fix
git commit -m "fix: patch critical security vulnerability"

# 3. Mergear a main
git checkout main
git merge hotfix/critical-security-patch --no-ff
git tag -a v1.0.1 -m "Hotfix: security patch"

# 4. Mergear también a develop (importante!)
git checkout develop
git merge hotfix/critical-security-patch --no-ff

# 5. Eliminar rama de hotfix
git branch -d hotfix/critical-security-patch

# 6. Push
git push origin main
git push origin develop
git push origin v1.0.1
```

---

## 📝 Convenciones de Commits

Usamos **Conventional Commits** para mensajes claros y consistentes:

### **Formato**
```
<tipo>(<scope>): <descripción corta>

[cuerpo opcional]

[footer opcional]
```

### **Tipos Principales**

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva característica | `feat(auth): add JWT authentication` |
| `fix` | Corrección de bug | `fix(ods): resolve workflow transition error` |
| `docs` | Documentación | `docs: update API documentation` |
| `style` | Formato, no afecta código | `style: format code with prettier` |
| `refactor` | Refactorización | `refactor(auth): simplify login logic` |
| `test` | Tests | `test(ods): add unit tests for CRUD` |
| `chore` | Tareas de mantenimiento | `chore: update dependencies` |
| `perf` | Mejora de performance | `perf(db): optimize query performance` |
| `ci` | CI/CD | `ci: add GitHub Actions workflow` |
| `build` | Build system | `build: configure webpack` |

### **Scopes Comunes**

- `auth` - Autenticación
- `ods` - Órdenes de Servicio
- `workflow` - Sistema de Workflow
- `equipos` - Gestión de Equipos
- `logistica` - Módulo de Logística
- `finanzas` - Módulo Financiero
- `frontend` - Frontend general
- `backend` - Backend general
- `db` - Base de datos
- `docker` - Docker/Infraestructura

### **Ejemplos Completos**

```bash
# Feature nueva
git commit -m "feat(ods): implement ODS creation with workflow validation"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Breaking change (importante!)
git commit -m "feat(api)!: change authentication endpoint structure

BREAKING CHANGE: /api/login moved to /api/auth/login"

# Múltiples cambios
git commit -m "chore: update dependencies and fix linting issues

- Update Next.js to 16.0.3
- Fix ESLint warnings in auth module
- Update TypeScript to 5.9.3"
```

---

## 🎯 Estado Actual del Proyecto

```
main (producción)
  └─ v0.0.0 (inicial)

develop (desarrollo) ← ESTAMOS AQUÍ ✅
  └─ 5 commits:
      1. Initial project setup
      2. Create folder structure
      3. Backend setup
      4. Frontend setup
      5. Docker + PostgreSQL setup
```

---

## 🚀 Próximos Pasos

### **Opción A: Continuar en develop (Recomendado para ahora)**
```bash
# Ya estamos aquí, seguir trabajando
git status  # Verificar rama actual
```

### **Opción B: Crear feature branch para Prisma**
```bash
git checkout -b feature/prisma-orm
# Trabajar en Prisma
# Luego mergear a develop
```

---

## 📊 Comandos Útiles

```bash
# Ver ramas
git branch -a                    # Todas las ramas
git branch -vv                   # Con info de tracking

# Ver historial
git log --oneline --graph --all  # Gráfico de commits
git log --oneline -10            # Últimos 10 commits

# Comparar ramas
git diff develop..main           # Diferencias entre ramas

# Limpiar ramas eliminadas
git fetch --prune                # Limpiar referencias remotas
git branch -d nombre-rama        # Eliminar rama local
```

---

## ⚠️ Reglas Importantes

1. **NUNCA hacer commit directo a `main`**
   - Siempre usar Pull Request o merge desde `develop`

2. **`develop` debe estar siempre funcional**
   - No mergear features rotas
   - Correr tests antes de mergear

3. **Features grandes → rama separada**
   - Si toma más de 1 día, crear `feature/*`

4. **Commits pequeños y frecuentes**
   - Mejor 5 commits pequeños que 1 gigante

5. **Mensajes descriptivos**
   - Usar Conventional Commits
   - Explicar el "por qué", no solo el "qué"

6. **Sincronizar frecuentemente**
   - Pull de `develop` regularmente
   - Evitar conflictos grandes

---

## 🔧 Configuración Recomendada

```bash
# Configurar nombre y email (si no lo hiciste)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Configurar editor
git config --global core.editor "code --wait"  # VS Code

# Aliases útiles
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --oneline --graph --all"
```

---

## 📚 Recursos

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)

---

**Versión:** 1.0  
**Última actualización:** 2025-11-21  
**Rama actual:** `develop` ✅
