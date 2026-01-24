# SKILL: SGCV2 QA & Test Engineer

## Description
Expertise in ensuring the reliability, security, and correctness of the SGCV2 ecosystem. This skill focuses on Test-Driven Development (TDD), automated testing strategies, and validating complex business workflows for XTEL Comunicaciones across the entire monorepo.

## Core Tech Stack
- **Unit & Integration (General):** Vitest (preferred) or Jest.
- **Backend Testing:** Supertest (API testing), Prisma Mocking.
- **Frontend Testing:** React Testing Library, MSW (Mock Service Worker).
- **E2E Testing:** Playwright (Critical for ODS workflows).
- **Validation:** Zod schema validation testing.

## Testing Strategy by Layer

### 1. Backend (Logic & API)
- **Unit Tests:** Focus on Domain Services and UseCases. Ensure business logic is isolated from Prisma.
- **Integration Tests:** Validate API endpoints using a test database. Check that `AppException` returns the correct HTTP status codes.
- **Contract Testing:** Verify that API responses strictly match the Zod DTOs defined in `@sgcv2/shared`.

### 2. Frontend (UI & Interaction)
- **Component Tests:** Validate UI states (Loading, Error, Empty) using React Testing Library.
- **Store Testing:** Ensure Zustand stores update correctly based on actions.
- **Mocking:** Use MSW to intercept network requests and simulate backend responses.

### 3. E2E (Critical User Flows)
- **The XTEL Happy Path:** Automate the complete ODS lifecycle: `Creation -> Assignment -> Execution -> Completion -> Invoicing`.
- **Role-Based Access:** Test that a user with the 'Technician' role cannot access 'Admin' financial reports.
- **Regression:** Ensure that bug fixes include a regression test to prevent recurrence.

## QA Rules & Constraints
- **Language:** All test descriptions, variables, and comments MUST be in **English**.
- **Coverage:** Aim for 70%+ coverage in Domain and Application layers.
- **Clean Tests:** Follow the "Arrange-Act-Assert" (AAA) pattern.
- **No Flakiness:** E2E tests must be stable. Use proper Playwright locators (Role, Label) instead of CSS selectors.

## Implementation Protocol for Agents
1. **Red-Green-Refactor:** When asked for a new feature, generate the test suite first (TDD).
2. **Edge Cases:** Always include tests for "unhappy paths" (e.g., database down, unauthorized access, invalid ODS state transitions).
3. **Data Cleanup:** Ensure tests are idempotent and do not leave "garbage" data in the database.
4. **Shared Logic:** Utilize factory patterns to generate test data (e.g., `createMockODS()`).

## Specific XTEL Scenarios to Test
- **ODS State Machine:** Test that an ODS cannot skip mandatory states (e.g., cannot go from 'New' to 'Finished' without 'Coordinated').
- **Logistics Integrity:** Test that equipment status updates automatically when assigned to a technician.
- **Financial Accuracy:** Validate that Proforma totals correctly sum all associated ODS amounts.