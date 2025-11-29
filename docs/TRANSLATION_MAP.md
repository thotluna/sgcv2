# Translation Map: Spanish → English

This document maps all database table and column names from Spanish to English.

## Tables

| Spanish                       | English                      | Description                           |
| ----------------------------- | ---------------------------- | ------------------------------------- |
| auditoria                     | audit_log                    | Audit trail                           |
| cliente                       | client                       | Carrier/Client (Telefónica, Ericsson) |
| cliente_contacto              | client_contact               | Client contact persons                |
| cliente_final                 | end_customer                 | Final customer (Carrefour)            |
| configuracion                 | configuration                | Equipment configuration               |
| empleado                      | employee                     | Employee                              |
| equipo                        | equipment                    | Equipment/Device                      |
| equipo_movimiento             | equipment_movement           | Equipment movement log                |
| factura                       | invoice                      | Invoice                               |
| herramienta                   | tool                         | Tool                                  |
| informe_imagen                | report_image                 | Report image attachment               |
| informe_servicio              | service_report               | Service report                        |
| informe_tecnico               | technical_report             | Technical report                      |
| insumo                        | supply                       | Supply/Material                       |
| localidad                     | location                     | Site/Location                         |
| localidad_contacto            | location_contact             | Location contact persons              |
| modificacion_ods              | service_order_modification   | Service order modification            |
| nota_entrega                  | delivery_note                | Delivery note                         |
| nota_entrega_detalle          | delivery_note_detail         | Delivery note detail                  |
| ods                           | service_order                | Service order (Orden de Servicio)     |
| ods_estado_historial          | service_order_status_history | Service order status history          |
| ods_insumo                    | service_order_supply         | Service order supply assignment       |
| ods_tecnico                   | service_order_technician     | Service order technician assignment   |
| ods_tecnologia                | service_order_technology     | Service order technology              |
| pago                          | payment                      | Payment                               |
| permiso                       | permission                   | Permission                            |
| proforma                      | quote                        | Quote/Proforma                        |
| proforma_detalle              | quote_detail                 | Quote detail                          |
| regla_transicion              | transition_rule              | Workflow transition rule              |
| rol                           | role                         | Role                                  |
| rol_permiso                   | role_permission              | Role permission                       |
| solicitud_herramienta         | tool_request                 | Tool request                          |
| solicitud_herramienta_detalle | tool_request_detail          | Tool request detail                   |
| solicitud_herramienta_ods     | tool_request_service_order   | Tool request service order            |
| tecnico                       | technician                   | Technician                            |
| tecnologia                    | technology                   | Technology                            |
| tipo_servicio                 | service_type                 | Service type                          |
| usuario                       | user                         | User                                  |
| usuario_rol                   | user_role                    | User role                             |
| workflow_definicion           | workflow_definition          | Workflow definition                   |
| workflow_estado               | workflow_state               | Workflow state                        |
| workflow_transicion           | workflow_transition          | Workflow transition                   |

## Common Column Patterns

| Spanish Pattern | English Pattern  | Examples                    |
| --------------- | ---------------- | --------------------------- |
| id\_\*          | \*\_id           | id_cliente → client_id      |
| nombre          | name             | nombre → name               |
| descripcion     | description      | descripcion → description   |
| fecha\_\*       | _\_date / _\_at  | fecha_creacion → created_at |
| estado          | status / state   | estado → status             |
| observaciones   | notes / comments | observaciones → notes       |
| created_at      | created_at       | ✓ (already English)         |
| updated_at      | updated_at       | ✓ (already English)         |

## Enums

| Spanish                | English                         |
| ---------------------- | ------------------------------- |
| accion_permiso         | permission_action               |
| condicion_equipo       | equipment_condition             |
| estado_cliente         | client_status                   |
| estado_configuracion   | configuration_status            |
| estado_empleado        | employee_status                 |
| estado_equipo          | equipment_status                |
| estado_factura         | invoice_status                  |
| estado_herramienta     | tool_status                     |
| estado_nota_entrega    | delivery_note_status            |
| estado_proforma        | quote_status                    |
| estado_solicitud       | request_status                  |
| estado_usuario         | user_status                     |
| nivel_tecnico          | technician_level                |
| prioridad_ods          | service_order_priority          |
| rol_ods                | service_order_role              |
| tipo_informe_tecnico   | technical_report_type           |
| tipo_modificacion_ods  | service_order_modification_type |
| tipo_movimiento_equipo | equipment_movement_type         |
| tipo_nota_entrega      | delivery_note_type              |
| tipo_regla_transicion  | transition_rule_type            |

## Notes

- **User-facing labels** (in frontend) will remain in Spanish
- **Data content** (values in tables) will remain in Spanish
- **Code** (table names, column names, variables, functions) will be in English
