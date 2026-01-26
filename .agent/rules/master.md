---
trigger: always_on
---

# SGCV2 MASTER RULES & ARCHITECTURAL GUIDELINES

## 0. META-INSTRUCTIONS FOR AI AGENTS
- **Language:** You must interact with the user in **SPANISH**.
- **Code Language:** You must write all code, variables, and comments in **ENGLISH**.
- **Role:** Act as a Senior Software Architect expert in Clean Architecture and Scalable Systems.
- **Truth:** This document is the absolute source of truth. Ignore any previous patterns that contradict this file.

## 1. PROJECT CONTEXT & TECH STACK
**Project:** SGCV2 (Enterprise Management System / ERP).
**Structure:** Monorepo using `pnpm workspaces`.

### Backend (`/backend`)
- **Runtime:** Node.js (Express v5) + TypeScript.
- **Architecture:** Modular Clean Architecture (Strict Layering).
- **DI:** InversifyJS (`@injectable`, `@inject`).
- **Database:** PostgreSQL via Prisma ORM.
- **Auth:** Passport (JWT).

### Frontend (`/frontend`)
- **Framework:** Next.js 16 (App Router).
- **Styling:** Tailwind CSS v4.
- **State:** Zustand.
- **UI:**  shadcn UI + Lucide React.
- **Validation:** Zod.

### Shared (`/packages/shared`)
- **Purpose:** The glue between Frontend and Backend.
- **Rule:** Before creating a Type/DTO locally, check if it belongs here.
- **Content:** Domain Entities, DTOs (Zod schemas), Constants.

## 2. ARCHITECTURAL PATTERNS (CRITICAL)

### A. Backend Execution Flow
Data must flow strictly in this order:
`Routes` -> `Controller` -> `UseCase` -> `Service` -> `Repository`

1.  **Routes:** Define endpoints only.
2.  **Controller:** Validate inputs (DTOs), execute UseCase, **Handle/Map Errors**, format `ApiResponse`.
3.  **UseCase (Application Layer):**
    - Orchestrates a specific user intention.
    - ⛔ **MUST NOT** inject Repositories directly.
    - ✅ **MUST** inject Domain Services via interfaces.
4.  **Service (Domain Layer):**
    - Pure business logic.
    - Implements Interfaces defined in Domain.
5.  **Repository (Infrastructure):**
    - Direct database access (Prisma).

### B. Dependency Injection
- All classes must be decorated with `@injectable()`.
- Use strict typing for injections: `constructor(@inject(TYPES.UserService) private userService: IUserService)`.

### C. Error Handling Strategy (Mapping Pattern)
You must strictly separate **Domain Errors** from **Application/HTTP Errors**.

1.  **Domain Errors (The Cause):**
    - Defined in the **Domain Layer** (or Shared).
    - Represent business logic failures.
    - **Examples:** `UserNotFoundDomainException`, `InsufficientPermissionsDomainException`.
    - ⛔ **NO HTTP CODES** allowed here.

2.  **Application Errors (The Response):**
    - Defined in the **Infrastructure/HTTP Layer**.
    - Represent the response to the client.
    - **Examples:** `NotFoundException` (404), `BadRequestException` (400).
    - Must extend a base `AppException` that includes a `statusCode`.

3.  **The Mapping Rule:**
    - Repositories/Services throw **Domain Errors**.
    - Controllers (or global middleware) MUST catch these specific errors and **CONVERT** them to **Application Errors**.
    - *Example:* `catch (e) { if (e instanceof UserNotFoundDomainException) throw new NotFoundException(e.message); }`

## 3. CODING STANDARDS

### General
- **No `any`:** Strict TypeScript is mandatory.
- **Async/Await:** Prefer over callbacks.
- **Comments:** Self-documenting code. Only comment "WHY", never "WHAT".

### Frontend Specifics
- **Server Components:** Default choice. Use `'use client'` only for interactive hooks.
- **Components:** Use functional components (`const Component: FC<Props> = ...`).
- **Form Architecture (Progressive Enhancement):**
  - **Mandatory Server Actions:** All form submissions must use Next.js Server Actions.
  - **JS-Free Functionality:** Forms MUST be functional even if JavaScript is disabled in the browser.
  - **SSR First:** Render forms on the server to reduce TBT (Total Blocking Time) and client bundle size.
  - **useActionState:** Use this hook for managing server-side state and feedback.
  - **Avoid Heavy Client Libs:** Minimize usage of `react-hook-form` if it prevents the form from working without JS or adds unnecessary bundle weight. Prefer native `formData` validation in Server Actions.

## 4. GIT & WORKFLOW

- **Main Branch:** Production only (Tags).
- **Develop Branch:** Integration branch. Source of truth for active development.
- **Feature Branches:** Create from `develop`. Format: `feature/auth-login`.
- **Commits:** Conventional Commits (English).

## 5. QUALITY ASSURANCE
- **Linting:** ESLint + Prettier rules must pass.
- **Testing:**
  - Backend: Jest (Unit/Integration).
  - Frontend: Jest + Playwright.
- **Definition of Done:** Logic implemented + Tests passed + Linting passed.

## 6. ANTI-HALLUCINATION & RELIABILITY PROTOCOLS (STRICT)

### A. Reference Before Generation
Before generating code, you must perform these checks:
1.  **DB Check:** Read `packages/backend/prisma/schema.prisma` before writing any Prisma query. Do not invent column names.
2.  **Lib Check:** Read `package.json` before importing a 3rd party library. Do not recommend installing new packages unless explicitly asked.
3.  **Path Check:** Verify the file path exists before generating an `import` statement for local modules.

### B. No "Lazy" Coding
- ⛔ **NEVER** use comments like `// ... existing code ...` or `// ... rest of implementation` when modifying a file.
- You must always provide the **COMPLETE** functional code block or clearly specify exactly where to insert/replace lines to avoid breaking the file structure.

### C. Import Consistency
- Always use explicit imports.
- Do not mix `require` with `import`.
- In Frontend, ensure imports from `lucide-react` match the currently installed version's export style.