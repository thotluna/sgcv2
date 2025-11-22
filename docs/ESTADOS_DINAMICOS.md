# Estados Dinámicos vs ENUM: Decisión de Diseño

## Problema Identificado

En la versión inicial del schema, los estados de ODS estaban definidos como un tipo ENUM:

```sql
CREATE TYPE estado_ods AS ENUM (
    'NUEVO',
    'PENDIENTE_ASIGNACIONES',
    'COORDINADO',
    'REALIZANDO',
    ...
);
```

## ¿Por qué esto es un problema?

### 1. **Inflexibilidad de PostgreSQL ENUMs**

- Agregar un valor requiere `ALTER TYPE ... ADD VALUE` (operación costosa)
- **NO se pueden eliminar valores** de un ENUM existente
- El orden de valores es inmutable
- Puede requerir reiniciar conexiones en algunos casos

### 2. **Contradice el Sistema de Workflow Flexible**

El sistema de workflow flexible permite:

- ✅ Definir estados personalizados por tipo de servicio
- ✅ Agregar nuevos estados sin modificar código
- ✅ Versionar workflows
- ✅ Evolucionar procesos de negocio

Pero con ENUM:

- ❌ Cada nuevo estado requiere ALTER TYPE
- ❌ No se pueden tener estados diferentes por tipo de servicio
- ❌ No se pueden eliminar estados obsoletos
- ❌ Requiere acceso de DBA para cambios

### 3. **Ejemplo del Problema**

**Escenario:** XTEL quiere agregar un estado "ESPERANDO_PERMISO_CLIENTE" solo para instalaciones.

**Con ENUM (❌ Problemático):**

```sql
-- Requiere ALTER TYPE (costoso)
ALTER TYPE estado_ods ADD VALUE 'ESPERANDO_PERMISO_CLIENTE';

-- Problema: Ahora TODOS los tipos de servicio tienen este estado
-- aunque solo aplica para instalaciones
```

**Con VARCHAR + Workflow (✅ Correcto):**

```sql
-- Solo agregar a la tabla workflow_estado para el workflow de Instalación
INSERT INTO workflow_estado (id_workflow, codigo_estado, nombre_estado)
VALUES (
    (SELECT id_workflow FROM workflow_definicion
     WHERE id_tipo_servicio = 2 AND activo = TRUE),
    'ESPERANDO_PERMISO_CLIENTE',
    'Esperando Permiso del Cliente'
);
```

## Solución Implementada

### Estados como VARCHAR(50)

```sql
CREATE TABLE ods (
    ...
    estado_actual VARCHAR(50) NOT NULL,
    ...
);
```

### Validación mediante Workflow

Los estados válidos se definen en `workflow_estado`:

```sql
CREATE TABLE workflow_estado (
    id_estado SERIAL PRIMARY KEY,
    id_workflow INTEGER NOT NULL,
    codigo_estado VARCHAR(50) NOT NULL,  -- El estado en sí
    nombre_estado VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_estado_inicial BOOLEAN DEFAULT FALSE,
    es_estado_final BOOLEAN DEFAULT FALSE,
    color VARCHAR(20),
    orden INTEGER,
    ...
);
```

### Validación Automática con Triggers

**Trigger 1: Validar que el estado existe**

```sql
CREATE TRIGGER trigger_validar_estado_ods
    BEFORE INSERT OR UPDATE OF estado_actual ON ods
    FOR EACH ROW
    EXECUTE FUNCTION validar_estado_ods();
```

Esta función verifica que el estado exista en el workflow activo del tipo de servicio.

**Trigger 2: Validar transiciones (opcional)**

```sql
-- Comentado por defecto, activar si se desea validación estricta
CREATE TRIGGER trigger_validar_transicion_estado
    BEFORE INSERT OR UPDATE OF estado_actual ON ods
    FOR EACH ROW
    EXECUTE FUNCTION validar_transicion_estado();
```

Esta función verifica que la transición de estado sea permitida según `workflow_transicion`.

## Ventajas de la Solución

### ✅ Flexibilidad Total

- Agregar estados: Solo INSERT en `workflow_estado`
- Quitar estados: Solo DELETE de `workflow_estado`
- Sin ALTER TYPE costosos
- Sin reinicio de conexiones

### ✅ Estados por Tipo de Servicio

```sql
-- Instalación puede tener:
'NUEVO' → 'PENDIENTE_EQUIPOS' → 'COORDINADO' → 'INSTALANDO' → 'CULMINADO'

-- Mantenimiento Correctivo puede tener:
'NUEVO' → 'DIAGNOSTICANDO' → 'REPARANDO' → 'PROBANDO' → 'CULMINADO'
```

### ✅ Versionamiento de Workflows

```sql
-- Workflow v1.0 de Instalación
INSERT INTO workflow_definicion (id_tipo_servicio, nombre, version)
VALUES (2, 'Workflow Instalación', 1);

-- Más tarde, crear v2.0 con nuevos estados
INSERT INTO workflow_definicion (id_tipo_servicio, nombre, version)
VALUES (2, 'Workflow Instalación Mejorado', 2);
```

### ✅ Validación Robusta

- Trigger valida que el estado exista en el workflow activo
- Función helper `obtener_estados_validos()` para UI
- Vista `v_estados_por_tipo_servicio` para consultas

## Comparación

| Aspecto                   | ENUM                 | VARCHAR + Workflow       |
| ------------------------- | -------------------- | ------------------------ |
| Agregar estado            | ALTER TYPE (costoso) | INSERT (rápido)          |
| Eliminar estado           | ❌ Imposible         | DELETE (fácil)           |
| Estados por tipo servicio | ❌ No soportado      | ✅ Soportado             |
| Versionamiento            | ❌ Difícil           | ✅ Nativo                |
| Validación                | ✅ Nativa            | ✅ Via triggers          |
| Rendimiento               | ✅ Ligeramente mejor | ✅ Muy bueno con índices |
| Flexibilidad              | ❌ Muy rígido        | ✅ Totalmente flexible   |
| Mantenimiento             | ❌ Requiere DBA      | ✅ Via aplicación        |

## Funciones Helper Disponibles

### 1. obtener_estados_validos(id_ods)

Retorna todos los estados válidos para una ODS específica, indicando cuáles son alcanzables desde el estado actual.

```sql
SELECT * FROM obtener_estados_validos(123);

-- Resultado:
codigo_estado          | nombre_estado           | puede_transicionar
-----------------------|-------------------------|-------------------
NUEVO                  | Nuevo                   | false
COORDINADO             | Coordinado              | true
REALIZANDO             | Realizando              | true
PAUSADA                | Pausada                 | true
CULMINADO              | Culminado               | false
```

### 2. requiere_aprobacion_transicion(tipo_servicio, origen, destino)

Verifica si una transición específica requiere aprobación.

```sql
SELECT requiere_aprobacion_transicion(2, 'REALIZANDO', 'PAUSADA');
-- Retorna: false

SELECT requiere_aprobacion_transicion(2, 'COORDINADO', 'CANCELADA');
-- Retorna: true
```

### 3. Vista v_estados_por_tipo_servicio

Muestra todos los estados disponibles por tipo de servicio.

```sql
SELECT * FROM v_estados_por_tipo_servicio
WHERE tipo_servicio = 'Instalación';
```

### 4. Vista v_transiciones_disponibles

Muestra todas las transiciones permitidas.

```sql
SELECT * FROM v_transiciones_disponibles
WHERE tipo_servicio = 'Instalación';
```

## Uso en Aplicación

### Al Crear una ODS

```javascript
// 1. Obtener estados iniciales válidos
const estadosIniciales = await db.query(`
    SELECT codigo_estado, nombre_estado
    FROM workflow_estado we
    JOIN workflow_definicion wd ON we.id_workflow = wd.id_workflow
    WHERE wd.id_tipo_servicio = $1
    AND wd.activo = TRUE
    AND we.es_estado_inicial = TRUE
`, [tipoServicioId]);

// 2. Crear ODS con estado inicial
await db.query(`
    INSERT INTO ods (numero_ods, id_tipo_servicio, estado_actual, ...)
    VALUES ($1, $2, $3, ...)
`, [numeroOds, tipoServicioId, estadosIniciales[0].codigo_estado, ...]);
```

### Al Cambiar Estado

```javascript
// 1. Obtener estados alcanzables
const estadosDisponibles = await db.query(
  `
    SELECT * FROM obtener_estados_validos($1)
    WHERE puede_transicionar = TRUE
`,
  [odsId]
);

// 2. Mostrar en UI para que usuario seleccione

// 3. Verificar si requiere aprobación
const requiereAprobacion = await db.query(
  `
    SELECT requiere_aprobacion_transicion($1, $2, $3)
`,
  [tipoServicioId, estadoActual, estadoNuevo]
);

// 4. Si requiere aprobación, crear ModificacionODS
if (requiereAprobacion) {
  await db.query(
    `
        INSERT INTO modificacion_ods (
            id_ods, tipo_modificacion, estado_anterior, estado_nuevo,
            justificacion, requiere_aprobacion, usuario_solicita
        ) VALUES ($1, 'CAMBIO_ESTADO', $2, $3, $4, TRUE, $5)
    `,
    [odsId, estadoActual, estadoNuevo, justificacion, usuarioId]
  );
} else {
  // 5. Cambiar estado directamente
  await db.query(
    `
        UPDATE ods SET estado_actual = $1 WHERE id_ods = $2
    `,
    [estadoNuevo, odsId]
  );
}
```

## Migración de Datos Existentes

Si ya tienes datos con ENUMs, migrar es sencillo:

```sql
-- 1. Agregar columna temporal
ALTER TABLE ods ADD COLUMN estado_actual_new VARCHAR(50);

-- 2. Copiar datos
UPDATE ods SET estado_actual_new = estado_actual::TEXT;

-- 3. Eliminar columna vieja
ALTER TABLE ods DROP COLUMN estado_actual;

-- 4. Renombrar columna nueva
ALTER TABLE ods RENAME COLUMN estado_actual_new TO estado_actual;

-- 5. Agregar NOT NULL
ALTER TABLE ods ALTER COLUMN estado_actual SET NOT NULL;

-- 6. Eliminar tipo ENUM (opcional)
DROP TYPE estado_ods;
```

## Conclusión

La decisión de usar **VARCHAR + Workflow** en lugar de **ENUM** para estados de ODS es fundamental para:

1. ✅ Mantener la promesa de **workflow flexible**
2. ✅ Permitir **evolución sin downtime**
3. ✅ Soportar **estados personalizados por tipo de servicio**
4. ✅ Facilitar **mantenimiento sin DBA**
5. ✅ Habilitar **versionamiento de procesos**

El pequeño costo en rendimiento (VARCHAR vs ENUM) es **insignificante** comparado con los beneficios de flexibilidad y mantenibilidad.

---

**Archivos Relacionados:**

- `schema.sql` - Schema principal (corregido)
- `workflow_validation.sql` - Funciones de validación
- `DATABASE_GUIDE.md` - Guía de base de datos

**Versión:** 1.1  
**Fecha:** 2025-11-21  
**Autor:** Sistema SGCV2
