# SKILL: SGCV2 Frontend Architect

## Description
Expertise in building high-performance, accessible, and maintainable enterprise UIs for the XTEL Management System (SGCV2). This skill enforces Next.js 15+ (App Router) patterns, Tailwind CSS v4 styling, and strict adherence to the project's Clean Architecture.

## Core Tech Stack
- **Framework:** Next.js 16+ (App Router).
- **Styling:** Tailwind CSS v4 (Native CSS-first approach).
- **State Management:** Zustand (Store-per-module pattern).
- **Components:** shadcn/ui + Lucide React (Icons).
- **Validation:** Zod.

## Architectural Instructions

### 1. Component Strategy
- **Server Components by Default:** Use Server Components for data fetching and layout.
- **Client Boundaries:** Use `'use client'` strictly for leaf components requiring interactivity or browser APIs.
- **Directory Structure:**
  - `components/ui`: Atomic primitives (Radix-based).
  - `components/shared`: Cross-module business components.
  - `components/features/[module]`: Domain-specific components (e.g., `logistics`, `ods`, `admin`).

### 2. State & Data Flow
- **Zustand Stores:** Define small, focused stores in `features/[module]/store`. Avoid global monolithic stores.
- **Server Actions:** All mutations (POST/PATCH/DELETE) must be handled via Next.js Server Actions.
- **Shared Types:** Always import DTOs and Zod schemas from `@sgcv2/shared`.

### 3. Styling Standards (Tailwind v4)
- **Theme First:** Use `@theme` variables in `globals.css` instead of arbitrary values.
- **Utility Composition:** Use the `cn()` utility (tailwind-merge + clsx) for conditional classes.
- **Layout:** Prioritize Flexbox and Grid for complex ERP dashboards.

## Domain-Specific UI Rules (XTEL)
- **ODS Status Colors:**
  - `PENDING`: `text-amber-600` / `bg-amber-50`
  - `IN_PROGRESS`: `text-blue-600` / `bg-blue-50`
  - `COMPLETED`: `text-green-600` / `bg-green-50`
  - `CANCELLED`: `text-red-600` / `bg-red-50`
- **Data Density:** Use condensed tables and minimal padding to maximize information visibility for logistics operators.
- **Iconography:** Consistent use of `lucide-react` (e.g., `HardHat` for technicians, `Package` for equipment).

## Requirements & Constraints
- **Language:** Code, variables, and comments MUST be in **English**.
- **No `any`:** Strict TypeScript is mandatory.
- **Accessibility:** Ensure WCAG 2.1 AA compliance using Radix UI primitives.
- **Error Handling:** Catch backend `AppException` and display via toast notifications or inline field errors.

## Implementation Protocol
1. **Reference:** Check `packages/shared` for existing Zod schemas.
2. **Scaffold:** Create the functional component in English.
3. **Logic:** Implement Server Actions for data persistence.
4. **UI:** Apply Tailwind v4 classes following the ERP design tokens.
5. **Verify:** Ensure the component is responsive and accessible.