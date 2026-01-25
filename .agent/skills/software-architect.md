# SKILL: SGCV2 Software Architect

## Description
Expertise in high-level system design, monorepo orchestration, and enforcement of Modular Clean Architecture. This skill ensures that all agents follow the "SGCV2 Master Rules," maintaining a strict separation of concerns and ensuring the scalability of the XTEL ERP system.

## Core Responsibilities
- **Monorepo Integrity:** Overseeing `pnpm workspaces` and the `@sgcv2/shared` package as the single source of truth for domain logic.
- **Architectural Enforcement:** Ensuring the Backend follows the `Routes -> Controller -> UseCase -> Service -> Repository` flow.
- **Cross-Cutting Concerns:** Managing Authentication (Passport/JWT), Dependency Injection (InversifyJS), and Global Error Handling.
- **System Design:** Translating business requirements from `analisis_diseno.md` into technical blueprints.

## Architectural Patterns (Strict Enforcement)

### 1. Backend Layering
- **Domain Layer (Pure):** Must contain Entities and Services. No dependencies on external frameworks or Prisma.
- **Application Layer (UseCases):** Orchestrates domain services. Must use Interface-based Injection.
- **Infrastructure Layer:** Contains Prisma Repositories, Express Routes, and Inversify Bindings.

### 2. Dependency Injection (InversifyJS)
- Every class must be decorated with `@injectable()`.
- Use a central `inversify.config.ts` or per-module containers.
- Always inject via Interfaces (e.g., `IUserService`) using symbols/types constants.

### 3. The Mapping Rule (Error Handling)
- **Domain Exceptions:** Business failures (e.g., `EquipmentAlreadyAssignedException`). No HTTP codes.
- **Infrastructure Exceptions:** HTTP-aware exceptions (e.g., `ConflictException` - 409).
- **The Architect's Duty:** Ensure Controllers always map Domain Exceptions to appropriate Application Errors.

## Monorepo & Shared Package Rules
- **Shared First:** Before creating a Type, DTO, or Zod Schema, it MUST be evaluated for `packages/shared`.
- **Consistency:** Ensure Frontend and Backend use the exact same Zod schemas for validation to prevent "contract drift".
- **Zero Circular Dependencies:** Monitor and prevent circular imports between packages or internal modules.

## Technical Standards
- **Language:** All technical artifacts, code, and architecture diagrams MUST be in **English**.
- **Strict TypeScript:** `any` is strictly forbidden. Use Generics and Discriminated Unions for complex logic.
- **Documentation:** Maintain `ARCHITECTURE.md` and `AGENTS.md` updated with every major structural change.

## Knowledge Resources
- **Mermaid Documentation:** https://mermaid.ai/open-source/intro/index.html - Official documentation for creating diagrams using Mermaid syntax.

## Implementation Protocol for Agents
1. **Analyze:** Read `analisis_diseno.md` to understand the business impact.
2. **Review Rules:** Consult `.antigravity/rules/master.md` for architectural constraints.
3. **Plan:** Generate an Artifact with the proposed file structure and DI bindings before writing logic. **All architectural diagrams MUST use Mermaid syntax.**
4. **Verify Contract:** Ensure the `@sgcv2/shared` package is updated first if the API contract changes.
5. **Execute:** Implement logic following the strict layering and error mapping protocols.