# AGENTS.md

This document serves as the **source of truth** for AI agents working on the SGCV2 project. Adhere strictly to these guidelines.

## 1. Project Overview & Architecture

**Project Context:** SGCV2 (Sistema de Gestión y Control v2) for XTEL Comunicaciones.
**Structure:** Monorepo using `pnpm workspaces`.

### Components

- **Backend (`/backend`)**:
  - **Framework**: Express v5 + TypeScript.
  - **Architecture**: **Clean Architecture** (Modular).
    - **Infrastructure**: Controllers, Routes, Prisma Repositories.
    - **Application**: Use Cases (Services).
    - **Domain**: Entities, Interfaces, DTOs.
  - **Dependency Injection**: InversifyJS (`@injectable`, `@inject`).
  - **ORM**: Prisma (PostgreSQL).
  - **Auth**: Passport (JWT, Local).

- **Frontend (`/frontend`)**:
  - **Framework**: Next.js (App Router).
  - **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`.
  - **UI Library**: Radix UI (Primitives), Lucide React (Icons).
  - **State**: Zustand.
  - **Forms**: React Hook Form + Zod.

- **Shared (`/packages/shared`)**:
  - **Package Name**: `@sgcv2/shared`.
  - **Description**: The **glue** between Backend and Frontend.
  - **Contents**:
    - `dtos/`: Data Transfer Objects (Zod schemas & Types) used for API validation and Form validation.
    - `types/`: Shared TypeScript interfaces/types (e.g., Domain Entities, API Responses).
    - `consts/`: Shared constants (e.g., UserRoles, AppRoutes, API_ENDPOINTS).
  - **Build**: Ensure the shared package is built/watched when developing.

## 2. Communication Rules (CRITICAL)

1.  **Agent → User Language:** **SPANISH (Español)**. Always respond to the user in Spanish.
2.  **Code Language:** **ENGLISH**. All variable names, function names, classes, files, and string literals (unless user-facing UI text) must be in English.
3.  **No Comments:** Write self-documenting code. Do **not** add comments explaining _what_ the code does. Only comment _why_ if the logic is complex or non-obvious.

## 3. Coding Standards

### General

- **No `any`**: Strict TypeScript usage. Define proper interfaces and types.
- **Async/Await**: Prefer `async/await` over raw Promises/callbacks.
- **Error Handling**: Use custom Error classes (e.g., `AppError`).
- **DRY via Shared**: **BEFORE** defining a Type, Interface, or DTO in the backend or frontend, verify if it should be in `@sgcv2/shared`.
  - If it's a domain entity used by both: **Move to Shared**.
  - If it's a DTO validated by API and used in Frontend Forms: **Move to Shared**.

### Backend Workflows

- **Dependency Injection**: All services, repositories, and controllers must be injected. Avoid `new Class()` outside of the composition root or factories.
- **Testing**:
  - Unit Tests: Jest. Mock dependencies using strict interfaces.
  - Test files co-located or in `__tests__` folders mimicking the source structure.

### Frontend Workflows

- **Components**: Functional components (`FC`).
- **Server vs Client**: Use `'use client'` explicitly only when hooks/interaction are needed. Default to Server Components.

## 4. Task Management

- **Single Source of Truth**: Never create new documentation/task files for tracking progress.
- **Update Existing**: Always read and update `TAREAS_FASE1.md` or `TAREAS_FASE2.md` in the root directory to reflect progress.
- **Final Check**: Do not report a task as "Done" until linting passes and related tests succeed.

## 5. Environment & Scripts

- **Root**: `pnpm` is the package manager.
- **Backend**: `npm run dev` (starts nodemon), `npm run test` (jest).
- **Frontend**: `npm run dev` (next dev), `npm test` (jest), `npm run test:e2e` (playwright).

## 6. Git Workflow & Version Control

**Strategy:** Simplified GitHub Flow. Reference: `docs/GIT_STRATEGY.md`.

### Branches

- **`main`**: Production ready state. **Tags only** (e.g., `v1.0.0`). NO direct commits.
- **`develop`**: Integration branch. Source of truth for active development. **NO DIRECT COMMITS OR MERGES PERMITTED**.
- **`feature/*`**: Create from `develop`. Merge back to `develop` **ONLY VIA PULL REQUEST**.
  - Naming: `feature/auth-login`, `feature/users-crud`.
- **`bugfix/*`**: Create from `develop`. Merge back to `develop` **ONLY VIA PULL REQUEST**.
  - Naming: `bugfix/fix-login-error`.

### Commit & PR Standards

- **Convention**: Conventional Commits (Semantic Versioning).
- **Language**: **ENGLISH**.
- **Pull Requests**:
  - Must have a descriptive title and description.
  - Must pass all status checks (linting, tests) before merging.
  - Squash and merge is preferred to keep history clean unless preservation of commit history is critical.
- **Structure**: `<type>(<scope>): <description>`
  - `feat(auth): add jwt strategy`
  - `fix(user): resolve null pointer in repository`
  - `chore: update dependencies`
  - `refactor(api): clean up routes`
  - `test: add unit tests for service`
