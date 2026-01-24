# Entity Relationship Diagram (ERD): Customer Hierarchy

This document describes the data structure for the hierarchical relationship between Carriers, their Sub-Clients, and Physical Locations.

## Diagram

```mermaid
erDiagram
    CUSTOMER ||--o{ SUB_CUSTOMER : "manages"
    CUSTOMER ||--o{ CUSTOMER_LOCATION : "owns (Network Nodes/Branches)"
    SUB_CUSTOMER |o--o{ CUSTOMER_LOCATION : "operates at (Branches)"

    CUSTOMER {
        uuid id PK
        string code UK "5 chars"
        string businessName UK "Optional"
        string legalName "Billing name"
        string taxId UK "Fiscal ID"
        string address
        string phone
        enum state "ACTIVE, INACTIVE, SUSPENDED"
        datetime createdAt
        datetime updatedAt
    }

    SUB_CUSTOMER {
        uuid id PK
        uuid customerId FK "Relation to Carrier"
        string businessName "Operational name"
        string externalCode "Up to 10 chars, unique per Customer"
        datetime createdAt
        datetime updatedAt
    }

    CUSTOMER_LOCATION {
        uuid id PK
        uuid customerId FK "Relation to Carrier"
        uuid subCustomerId FK "Optional: Relation to Sub-Client"
        string name "Unique or composite name"
        string address "Physical address"
        string city
        string zipCode
        boolean isMain "Default headquarter mark"
        datetime createdAt
        datetime updatedAt
    }
```

## Relationship Rules

1. **Carrier (Customer)**: 
   - Acts as the root entity. 
   - Owns all data underneath. 
   - Always has full billing data (`taxId`, `legalName`).

2. **Sub-Client (SubCustomer)**:
   - Linked to a single Carrier.
   - **Data Isolation**: If the same physical company is served by two different Carriers, it exists as two distinct `SubCustomer` records.
   - Identified by an `externalCode` (max 10 chars) which is unique within the context of its parent `Customer`.

3. **Locations**:
   - **Network Nodes**: When `subCustomerId` is NULL. These are physical points belonging directly to the Carrier (e.g., repetition nodes).
   - **Branches**: When `subCustomerId` is NOT NULL. These are points where a specific sub-client operates.
   - A `SubCustomer` should have at least one branch (enforced via business logic).

## Architectural Note: Data Flattening

The presence of `customerId` in the `CUSTOMER_LOCATION` table, even when a `subCustomerId` is present, is a deliberate design choice for **Data Flattening** and **Performance**:

1.  **Isolation (Multi-tenancy)**: It allows for immediate filtering of all locations belonging to a Carrier (nodes + all branches of all their sub-clients) without performing JOINs.
2.  **Universal Ownership**: A location always has a legal owner (`Customer`). For "Network Nodes", this is the only link.
3.  **Cross-Check Validation**: In the application layer, we must ensure that `subCustomer.customerId == location.customerId` during creation to maintain integrity.
