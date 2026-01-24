# SKILL: SGCV2 Database & Domain Specialist

## Description
Expertise in data modeling, Prisma schema management, and the complex business workflows of XTEL Comunicaciones. This skill ensures data integrity and the correct implementation of the ODS (Orden de Servicio) state machine and logistics tracking.

## Core Tech Stack
- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Modeling:** Entity-Relationship diagrams and Zod Schema synchronization.

## Domain Knowledge (XTEL Context)
- **ODS Workflows:** Deep understanding of the specific states for Inspección, Instalación, Desinstalación, and Mantenimiento (as defined in `analisis_diseno.md`).
- **Equipment Tracking:** Managing the lifecycle of customer equipment (Almacén -> Tránsito -> Instalado -> Fallado -> Entregado).
- **Logistics Logic:** Rules for tool assignments, consumable stock (Insumos), and vehicle mileage tracking.

## Database Rules
- **Prisma Schema:** Maintain a clean `schema.prisma`. Use meaningful relation names and enums for all states.
- **Migrations:** Ensure every schema change has a descriptive migration name in English.
- **Performance:** Identify where to add indexes (e.g., `numero_ods`, `serial_equipo`, `id_cliente`).
- **Shared Schemas:** Ensure Zod schemas in `packages/shared` are perfectly synced with the database types.

## Responsibilities
1. **Schema Evolution:** Modify `schema.prisma` based on new requirements.
2. **State Machine Integrity:** Ensure that transitions between ODS states follow the business rules (e.g., cannot move to 'Realizando' without assigned technicians).
3. **Data Seeding:** Maintain seed scripts for technologies, service types, and initial roles.
4. **Validation:** Implement complex business validations that go beyond simple types (Cross-entity validation).

## Constraints
- **Naming:** Database tables and columns must be in `snake_case` (PostgreSQL standard) but mapped to `camelCase` in Prisma.
- **Documentation:** All complex triggers or logic must be explained in the code in English.