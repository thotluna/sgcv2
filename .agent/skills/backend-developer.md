# SKILL: SGCV2 Backend Developer

## Description
Expertise in implementing business logic within a Node.js/TypeScript environment using InversifyJS and Prisma ORM. This skill focuses on the practical execution of the Clean Architecture layers: Controllers, UseCases, Services, and Repositories.

## Core Tech Stack
- **Runtime:** Node.js + TypeScript.
- **Framework:** Express v5.
- **DI:** InversifyJS (Constructor injection).
- **ORM:** Prisma (PostgreSQL).
- **Security:** Passport.js + JWT.

## Layer Implementation Rules

### 1. Controllers & Routing
- **Input Validation:** Use Zod schemas from `@sgcv2/shared` to validate `req.body` and `req.params`.
- **Response Mapping:** Always wrap responses in a consistent `ApiResponse<T>` structure.
- **Error Handling:** Implement the "Mapping Rule". Catch Domain Exceptions and re-throw them as `AppException` (e.g., `NotFoundException`, `ConflictException`).

### 2. UseCases & Services
- **Granularity:** One UseCase per specific action (e.g., `CreateODSUseCase`).
- **Dependencies:** Inject Domain Services via Interfaces. Never reference Prisma directly inside a UseCase.
- **Transaction Management:** Use Prisma transactions when a UseCase affects multiple entities (e.g., creating an ODS and updating equipment status).

### 3. Repositories (Infrastructure)
- **Data Access:** Implement Repository interfaces using `PrismaClient`.
- **Mapping:** Convert Prisma models to Domain Entities before returning them to the upper layers.

## Implementation Protocol
1. **DI Binding:** Add the new class to the Inversify container symbols and bindings.
2. **Contract:** Use the DTOs defined in `@sgcv2/shared`.
3. **Logic:** Write the business logic in the Service/UseCase.
4. **Errors:** Ensure every possible failure throws a typed Domain Exception.
5. **Clean Code:** Follow SOLID principles and ensure the code is 100% in English.