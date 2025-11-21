-- ============================================
-- Script de Validación de Estados de Workflow
-- ============================================

-- Esta función valida que un estado de ODS sea válido según el workflow activo del tipo de servicio
CREATE OR REPLACE FUNCTION validar_estado_ods()
RETURNS TRIGGER AS $$
DECLARE
    workflow_id INTEGER;
    estado_valido BOOLEAN;
BEGIN
    -- Obtener el workflow activo para el tipo de servicio de la ODS
    SELECT id_workflow INTO workflow_id
    FROM workflow_definicion
    WHERE id_tipo_servicio = NEW.id_tipo_servicio
    AND activo = TRUE
    LIMIT 1;
    
    IF workflow_id IS NULL THEN
        RAISE EXCEPTION 'No hay workflow activo definido para el tipo de servicio %', NEW.id_tipo_servicio;
    END IF;
    
    -- Verificar que el estado existe en el workflow
    SELECT EXISTS(
        SELECT 1
        FROM workflow_estado
        WHERE id_workflow = workflow_id
        AND codigo_estado = NEW.estado_actual
    ) INTO estado_valido;
    
    IF NOT estado_valido THEN
        RAISE EXCEPTION 'El estado "%" no es válido para el workflow del tipo de servicio', NEW.estado_actual;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar estados en INSERT y UPDATE
CREATE TRIGGER trigger_validar_estado_ods
    BEFORE INSERT OR UPDATE OF estado_actual ON ods
    FOR EACH ROW
    EXECUTE FUNCTION validar_estado_ods();

-- ============================================
-- Función para validar transiciones de estado
-- ============================================

CREATE OR REPLACE FUNCTION validar_transicion_estado()
RETURNS TRIGGER AS $$
DECLARE
    workflow_id INTEGER;
    transicion_valida BOOLEAN;
BEGIN
    -- Solo validar si el estado cambió
    IF TG_OP = 'UPDATE' AND OLD.estado_actual = NEW.estado_actual THEN
        RETURN NEW;
    END IF;
    
    -- Obtener el workflow activo
    SELECT id_workflow INTO workflow_id
    FROM workflow_definicion
    WHERE id_tipo_servicio = NEW.id_tipo_servicio
    AND activo = TRUE
    LIMIT 1;
    
    -- Si es INSERT, verificar que sea un estado inicial
    IF TG_OP = 'INSERT' THEN
        SELECT EXISTS(
            SELECT 1
            FROM workflow_estado
            WHERE id_workflow = workflow_id
            AND codigo_estado = NEW.estado_actual
            AND es_estado_inicial = TRUE
        ) INTO transicion_valida;
        
        IF NOT transicion_valida THEN
            RAISE EXCEPTION 'El estado "%" no es un estado inicial válido', NEW.estado_actual;
        END IF;
        
        RETURN NEW;
    END IF;
    
    -- Si es UPDATE, verificar que la transición exista
    SELECT EXISTS(
        SELECT 1
        FROM workflow_transicion wt
        JOIN workflow_estado eo ON wt.id_estado_origen = eo.id_estado
        JOIN workflow_estado ed ON wt.id_estado_destino = ed.id_estado
        WHERE wt.id_workflow = workflow_id
        AND eo.codigo_estado = OLD.estado_actual
        AND ed.codigo_estado = NEW.estado_actual
    ) INTO transicion_valida;
    
    IF NOT transicion_valida THEN
        RAISE EXCEPTION 'No existe una transición válida de "%" a "%"', OLD.estado_actual, NEW.estado_actual;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar transiciones (comentado por defecto, activar si se desea validación estricta)
-- CREATE TRIGGER trigger_validar_transicion_estado
--     BEFORE INSERT OR UPDATE OF estado_actual ON ods
--     FOR EACH ROW
--     EXECUTE FUNCTION validar_transicion_estado();

-- ============================================
-- Vista de Estados Disponibles por Tipo de Servicio
-- ============================================

CREATE OR REPLACE VIEW v_estados_por_tipo_servicio AS
SELECT 
    ts.id_tipo_servicio,
    ts.nombre AS tipo_servicio,
    wd.id_workflow,
    wd.version AS version_workflow,
    we.codigo_estado,
    we.nombre_estado,
    we.descripcion,
    we.es_estado_inicial,
    we.es_estado_final,
    we.color,
    we.orden
FROM tipo_servicio ts
JOIN workflow_definicion wd ON ts.id_tipo_servicio = wd.id_tipo_servicio
JOIN workflow_estado we ON wd.id_workflow = we.id_workflow
WHERE wd.activo = TRUE
ORDER BY ts.nombre, we.orden;

-- ============================================
-- Vista de Transiciones Disponibles
-- ============================================

CREATE OR REPLACE VIEW v_transiciones_disponibles AS
SELECT 
    ts.nombre AS tipo_servicio,
    wd.version AS version_workflow,
    eo.codigo_estado AS estado_origen,
    eo.nombre_estado AS nombre_origen,
    ed.codigo_estado AS estado_destino,
    ed.nombre_estado AS nombre_destino,
    wt.nombre_accion,
    wt.requiere_aprobacion,
    wt.requiere_justificacion
FROM workflow_transicion wt
JOIN workflow_definicion wd ON wt.id_workflow = wd.id_workflow
JOIN tipo_servicio ts ON wd.id_tipo_servicio = ts.id_tipo_servicio
JOIN workflow_estado eo ON wt.id_estado_origen = eo.id_estado
JOIN workflow_estado ed ON wt.id_estado_destino = ed.id_estado
WHERE wd.activo = TRUE
ORDER BY ts.nombre, eo.orden, ed.orden;

-- ============================================
-- Función Helper: Obtener Estados Válidos para una ODS
-- ============================================

CREATE OR REPLACE FUNCTION obtener_estados_validos(p_id_ods INTEGER)
RETURNS TABLE(
    codigo_estado VARCHAR,
    nombre_estado VARCHAR,
    puede_transicionar BOOLEAN
) AS $$
DECLARE
    v_tipo_servicio INTEGER;
    v_estado_actual VARCHAR;
    v_workflow_id INTEGER;
BEGIN
    -- Obtener tipo de servicio y estado actual de la ODS
    SELECT id_tipo_servicio, ods.estado_actual 
    INTO v_tipo_servicio, v_estado_actual
    FROM ods
    WHERE id_ods = p_id_ods;
    
    -- Obtener workflow activo
    SELECT id_workflow INTO v_workflow_id
    FROM workflow_definicion
    WHERE id_tipo_servicio = v_tipo_servicio
    AND activo = TRUE
    LIMIT 1;
    
    -- Retornar estados con indicador de si se puede transicionar
    RETURN QUERY
    SELECT 
        we.codigo_estado,
        we.nombre_estado,
        EXISTS(
            SELECT 1
            FROM workflow_transicion wt
            JOIN workflow_estado eo ON wt.id_estado_origen = eo.id_estado
            WHERE wt.id_workflow = v_workflow_id
            AND eo.codigo_estado = v_estado_actual
            AND wt.id_estado_destino = we.id_estado
        ) AS puede_transicionar
    FROM workflow_estado we
    WHERE we.id_workflow = v_workflow_id
    ORDER BY we.orden;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Función Helper: Verificar si Transición Requiere Aprobación
-- ============================================

CREATE OR REPLACE FUNCTION requiere_aprobacion_transicion(
    p_id_tipo_servicio INTEGER,
    p_estado_origen VARCHAR,
    p_estado_destino VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_requiere BOOLEAN;
    v_workflow_id INTEGER;
BEGIN
    -- Obtener workflow activo
    SELECT id_workflow INTO v_workflow_id
    FROM workflow_definicion
    WHERE id_tipo_servicio = p_id_tipo_servicio
    AND activo = TRUE
    LIMIT 1;
    
    -- Verificar si requiere aprobación
    SELECT wt.requiere_aprobacion INTO v_requiere
    FROM workflow_transicion wt
    JOIN workflow_estado eo ON wt.id_estado_origen = eo.id_estado
    JOIN workflow_estado ed ON wt.id_estado_destino = ed.id_estado
    WHERE wt.id_workflow = v_workflow_id
    AND eo.codigo_estado = p_estado_origen
    AND ed.codigo_estado = p_estado_destino;
    
    RETURN COALESCE(v_requiere, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Comentarios de Documentación
-- ============================================

COMMENT ON FUNCTION validar_estado_ods() IS 'Valida que el estado de una ODS exista en el workflow activo del tipo de servicio';
COMMENT ON FUNCTION validar_transicion_estado() IS 'Valida que la transición de estado sea permitida según el workflow (desactivado por defecto)';
COMMENT ON FUNCTION obtener_estados_validos(INTEGER) IS 'Retorna todos los estados válidos para una ODS con indicador de si se puede transicionar desde el estado actual';
COMMENT ON FUNCTION requiere_aprobacion_transicion(INTEGER, VARCHAR, VARCHAR) IS 'Verifica si una transición específica requiere aprobación';
COMMENT ON VIEW v_estados_por_tipo_servicio IS 'Vista de todos los estados disponibles por tipo de servicio';
COMMENT ON VIEW v_transiciones_disponibles IS 'Vista de todas las transiciones permitidas por tipo de servicio';
