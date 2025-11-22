# Guía del Esquema de Base de Datos - SGCV2

## Información General

**Motor de Base de Datos:** PostgreSQL 12+  
**Archivo Schema:** `schema.sql`  
**Codificación:** UTF-8  
**Timezone:** UTC

## Resumen del Schema

### Estadísticas

- **Tablas:** 45
- **Tipos Enumerados:** 15
- **Índices:** 20+
- **Triggers:** 8
- **Funciones:** 3
- **Vistas:** 4
- **Constraints:** 60+

## Módulos del Sistema

### 1. Módulo de Clientes y Localidades

**Tablas:**

- `cliente` - Empresas carrier que contratan a XTEL
- `cliente_final` - Clientes finales del carrier
- `localidad` - Sitios físicos donde se ejecutan servicios

**Relaciones:**

- Un cliente final puede tener múltiples localidades
- Una ODS se asocia a un cliente, un cliente final y una localidad

### 2. Módulo de Seguridad y Usuarios

**Tablas:**

- `empleado` - Personal de XTEL
- `usuario` - Cuentas de acceso al sistema
- `rol` - Roles del sistema
- `usuario_rol` - Asignación de roles a usuarios
- `permiso` - Permisos granulares
- `rol_permiso` - Permisos por rol
- `auditoria` - Log de todas las acciones

**Características:**

- Sistema RBAC (Role-Based Access Control)
- Auditoría automática de todas las acciones
- Bloqueo de cuenta por intentos fallidos
- Tracking de último acceso

### 3. Módulo de Workflow Flexible

**Tablas:**

- `tipo_servicio` - Tipos de servicio ofrecidos
- `workflow_definicion` - Workflows por tipo de servicio
- `workflow_estado` - Estados configurables
- `workflow_transicion` - Transiciones permitidas
- `regla_transicion` - Validaciones por transición
- `modificacion_ods` - Historial de modificaciones con aprobación

**Características:**

- Workflows versionados
- Estados personalizables por tipo de servicio
- Sistema de aprobaciones configurable
- Validaciones automáticas
- Auditoría completa de cambios

### 4. Módulo de Órdenes de Servicio (ODS)

**Tablas:**

- `ods` - Orden de servicio principal
- `ods_tecnologia` - Tecnologías involucradas
- `ods_estado_historial` - Historial de cambios de estado
- `ods_tecnico` - Técnicos asignados
- `ods_insumo` - Insumos asignados
- `configuracion` - Configuraciones técnicas

**Características:**

- Número de ODS autogenerado (ODS-YYYY-NNNNN)
- Historial inmutable de estados
- Múltiples técnicos por ODS con roles
- Tracking de insumos usados vs. devueltos

### 5. Módulo de Equipos

**Tablas:**

- `equipo` - Equipos del cliente
- `equipo_movimiento` - Historial de movimientos
- `nota_entrega` - Notas de entrega/devolución
- `nota_entrega_detalle` - Detalle de equipos por nota

**Características:**

- Tracking individual por serial
- Ciclo de vida completo (almacén → tránsito → instalado)
- Historial de movimientos
- Asociación a localidad cuando está instalado

### 6. Módulo de Herramientas

**Tablas:**

- `herramienta` - Inventario de herramientas
- `solicitud_herramienta` - Solicitudes de préstamo
- `solicitud_herramienta_detalle` - Detalle de herramientas
- `solicitud_herramienta_ods` - Asociación con ODS

**Características:**

- Control de préstamos a técnicos
- Tracking de devoluciones
- Estados: ALMACEN, TRASLADO, MANTENIMIENTO, BAJA

### 7. Módulo de Insumos

**Tablas:**

- `insumo` - Inventario de insumos consumibles
- `ods_insumo` - Asignación a ODS

**Características:**

- Control de stock con mínimos y máximos
- Actualización automática de stock con triggers
- Constraint para evitar stock negativo
- Tracking de cantidades: asignada, usada, devuelta

### 8. Módulo de Técnicos

**Tablas:**

- `tecnico` - Extensión de empleado para técnicos

**Características:**

- Especialidades en formato JSON
- Niveles: JUNIOR, SEMI_SENIOR, SENIOR, ESPECIALISTA
- Flag de disponibilidad

### 9. Módulo de Informes

**Tablas:**

- `informe_servicio` - Informe firmado por cliente
- `informe_tecnico` - Informes técnicos detallados
- `informe_imagen` - Fotografías de los informes

**Características:**

- Firma digital del cliente (BYTEA)
- Múltiples imágenes por informe
- Tipos: INSPECCION, POST_INSTALACION, POST_MANTENIMIENTO, CORRECTIVO

### 10. Módulo de Finanzas

**Tablas:**

- `proforma` - Proformas enviadas a clientes
- `proforma_detalle` - ODS incluidas en proforma
- `factura` - Facturas emitidas
- `pago` - Pagos recibidos

**Características:**

- Número de factura autogenerado (FAC-YYYYMM-NNNN)
- Actualización automática de saldo con triggers
- Tracking de estado de pago
- Relación proforma → factura → pagos

## Tipos Enumerados Principales

### estado_ods

Estados base que pueden ser extendidos por workflow:

```sql
'NUEVO', 'PENDIENTE_ASIGNACIONES', 'PENDIENTE_EQUIPOS',
'POR_COORDINAR', 'COORDINADO', 'REALIZANDO', 'PAUSADA',
'MATERIALES_PENDIENTES', 'REPROGRAMADA', 'CULMINADO',
'PROFORMA', 'FACTURADO', 'PAGADO', 'CANCELADA'
```

### tipo_modificacion_ods

```sql
'CAMBIO_ESTADO', 'CAMBIO_ALCANCE', 'PAUSA',
'REPROGRAMACION', 'CANCELACION', 'REACTIVACION'
```

### tipo_regla_transicion

```sql
'VALIDACION_CAMPO', 'VALIDACION_RECURSO',
'VALIDACION_PERMISO', 'VALIDACION_NEGOCIO',
'VALIDACION_TEMPORAL'
```

## Índices Importantes

### Índices de Búsqueda Frecuente

```sql
idx_ods_estado          -- Búsqueda por estado
idx_ods_cliente         -- ODS por cliente
idx_ods_fecha_programada -- ODS por fecha
idx_equipo_serial       -- Búsqueda de equipos
idx_factura_vencimiento -- Facturas por vencer
```

### Índices de Texto Completo

```sql
idx_cliente_nombre      -- Búsqueda de clientes
idx_localidad_nombre    -- Búsqueda de localidades
```

## Triggers Automáticos

### 1. update_updated_at_column

**Tablas afectadas:** Todas las que tienen `updated_at`  
**Función:** Actualiza automáticamente el timestamp de modificación

### 2. registrar_cambio_estado_ods

**Tabla:** `ods`  
**Función:** Registra automáticamente en `ods_estado_historial` cada cambio de estado

### 3. actualizar_stock_insumo

**Tabla:** `ods_insumo`  
**Función:** Actualiza el stock de insumos al asignar o devolver

### 4. actualizar_saldo_factura

**Tabla:** `pago`  
**Función:** Actualiza el saldo pendiente de la factura y su estado

## Funciones Útiles

### generar_numero_ods()

Genera número único de ODS en formato: `ODS-YYYY-NNNNN`

**Uso:**

```sql
INSERT INTO ods (numero_ods, ...)
VALUES (generar_numero_ods(), ...);
```

### generar_numero_factura()

Genera número único de factura en formato: `FAC-YYYYMM-NNNN`

**Uso:**

```sql
INSERT INTO factura (numero_factura, ...)
VALUES (generar_numero_factura(), ...);
```

## Vistas Útiles

### v_ods_completa

Muestra ODS con toda la información relacionada (cliente, localidad, técnicos, tecnologías)

### v_equipos_ubicacion

Muestra equipos con su ubicación actual (almacén, localidad instalada, o en tránsito)

### v_facturas_pendientes

Muestra facturas no pagadas con días de vencimiento y estado

## Datos Iniciales

### Roles Precargados (11)

- Administrador del Sistema
- Gerente General
- Gerente de Operaciones
- Coordinador
- Asistente de Operaciones
- Técnico
- Gerente de Logística
- Almacenista
- Gerente de Administración
- Contador
- Analista de RRHH

### Tipos de Servicio Precargados (7)

- Inspección (SLA: 5 días)
- Instalación (SLA: 10 días)
- Desinstalación (SLA: 7 días)
- Migración (SLA: 15 días)
- Mantenimiento Preventivo (SLA: 7 días)
- Mantenimiento Correctivo (SLA: 3 días)
- Asistencia Técnica (SLA: 2 días)

## Instalación

### Requisitos

- PostgreSQL 12 o superior
- Extensiones: `uuid-ossp`, `pgcrypto`

### Pasos de Instalación

1. **Crear la base de datos:**

```bash
createdb sgcv2
```

2. **Ejecutar el schema:**

```bash
psql -d sgcv2 -f schema.sql
```

3. **Verificar instalación:**

```sql
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';
-- Debe retornar 45
```

## Consideraciones de Seguridad

### Passwords

- Los passwords se almacenan hasheados con `pgcrypto`
- Usar `crypt()` para hashear y `crypt(password, hash) = hash` para verificar

### Auditoría

- Todas las acciones críticas deben registrarse en `auditoria`
- El trigger de `updated_at` mantiene tracking de modificaciones
- El historial de ODS es inmutable (solo INSERT)

### Permisos

- Implementar Row-Level Security (RLS) según necesidad
- Usar roles de PostgreSQL alineados con roles de aplicación
- Restringir acceso directo a tablas sensibles

## Mantenimiento

### Limpieza de Auditoría

```sql
-- Archivar auditoría mayor a 1 año
DELETE FROM auditoria
WHERE fecha_hora < CURRENT_DATE - INTERVAL '1 year';
```

### Análisis de Rendimiento

```sql
-- Verificar índices no utilizados
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;
```

### Vacuum Regular

```sql
-- Ejecutar semanalmente
VACUUM ANALYZE;
```

## Próximos Pasos

1. **Configurar Workflows Iniciales:** Crear workflows específicos para cada tipo de servicio
2. **Configurar Permisos:** Asignar permisos a cada rol
3. **Crear Usuario Admin:** Primer usuario del sistema
4. **Migrar Datos:** Si existe sistema anterior
5. **Configurar Backups:** Estrategia de respaldo automático

## Notas Técnicas

- **JSONB vs JSON:** Se usa JSONB para mejor rendimiento en consultas
- **Timestamps:** Todos en UTC, conversión a timezone local en aplicación
- **Soft Delete:** No implementado, usar campo `estado` para inactivar
- **Cascadas:** Configuradas en FKs críticas para mantener integridad

---

**Versión:** 1.0  
**Fecha:** 2025-11-21  
**Autor:** Sistema SGCV2
