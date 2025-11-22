-- ============================================
-- SGCV2 - Seed Data (Datos Iniciales)
-- ============================================
-- Este script carga los datos maestros necesarios para iniciar el sistema
-- Ejecutar DESPUÉS de schema.sql

-- ============================================
-- 1. WORKFLOWS PARA CADA TIPO DE SERVICIO
-- ============================================

-- Workflow para Inspección (ID Tipo Servicio: 1)
INSERT INTO workflow_definicion (id_tipo_servicio, nombre, descripcion, version, activo)
VALUES (1, 'Workflow Inspección v1.0', 'Flujo estándar para servicios de inspección/site survey', 1, TRUE);

-- Estados para Inspección
INSERT INTO workflow_estado (id_workflow, codigo_estado, nombre_estado, descripcion, es_estado_inicial, es_estado_final, color, orden) VALUES
(1, 'NUEVO', 'Nuevo', 'ODS recién creada', TRUE, FALSE, '#3B82F6', 1),
(1, 'POR_COORDINAR', 'Por Coordinar', 'Pendiente de coordinación con cliente', FALSE, FALSE, '#F59E0B', 2),
(1, 'COORDINACION_RECHAZADA', 'Coordinación Rechazada', 'Cliente rechazó fecha propuesta', FALSE, FALSE, '#EF4444', 3),
(1, 'COORDINADO', 'Coordinado', 'Fecha confirmada con cliente', FALSE, FALSE, '#10B981', 4),
(1, 'REALIZANDO', 'Realizando', 'Inspección en curso', FALSE, FALSE, '#8B5CF6', 5),
(1, 'POR_INFORME', 'Por Informe', 'Pendiente de carga de informe', FALSE, FALSE, '#F59E0B', 6),
(1, 'CULMINADO', 'Culminado', 'Servicio completado', FALSE, FALSE, '#10B981', 7),
(1, 'PROFORMA', 'Proforma Generada', 'Proforma enviada al cliente', FALSE, FALSE, '#6366F1', 8),
(1, 'FACTURADO', 'Facturado', 'Factura emitida', FALSE, FALSE, '#8B5CF6', 9),
(1, 'PAGADO', 'Pagado', 'Pago recibido', FALSE, TRUE, '#059669', 10);

-- Transiciones para Inspección
INSERT INTO workflow_transicion (id_workflow, id_estado_origen, id_estado_destino, nombre_accion, requiere_aprobacion, requiere_justificacion) VALUES
-- Desde NUEVO
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='NUEVO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='POR_COORDINAR'), 
    'Iniciar Coordinación', FALSE, FALSE),
-- Desde POR_COORDINAR
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='POR_COORDINAR'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='COORDINADO'), 
    'Confirmar Coordinación', FALSE, FALSE),
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='POR_COORDINAR'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='COORDINACION_RECHAZADA'), 
    'Rechazar Fecha', FALSE, TRUE),
-- Desde COORDINACION_RECHAZADA
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='COORDINACION_RECHAZADA'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='POR_COORDINAR'), 
    'Reprogramar', FALSE, FALSE),
-- Desde COORDINADO
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='COORDINADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='REALIZANDO'), 
    'Iniciar Inspección', FALSE, FALSE),
-- Desde REALIZANDO
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='REALIZANDO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='POR_INFORME'), 
    'Completar Inspección', FALSE, FALSE),
-- Desde POR_INFORME
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='POR_INFORME'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='CULMINADO'), 
    'Cargar Informe', FALSE, FALSE),
-- Desde CULMINADO
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='CULMINADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='PROFORMA'), 
    'Generar Proforma', FALSE, FALSE),
-- Desde PROFORMA
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='PROFORMA'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='FACTURADO'), 
    'Facturar', FALSE, FALSE),
-- Desde FACTURADO
(1, (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='FACTURADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=1 AND codigo_estado='PAGADO'), 
    'Registrar Pago', FALSE, FALSE);

-- ============================================
-- Workflow para Instalación (ID Tipo Servicio: 2)
-- ============================================

INSERT INTO workflow_definicion (id_tipo_servicio, nombre, descripcion, version, activo)
VALUES (2, 'Workflow Instalación v1.0', 'Flujo estándar para servicios de instalación', 1, TRUE);

-- Estados para Instalación
INSERT INTO workflow_estado (id_workflow, codigo_estado, nombre_estado, descripcion, es_estado_inicial, es_estado_final, color, orden) VALUES
(2, 'NUEVO', 'Nuevo', 'ODS recién creada', TRUE, FALSE, '#3B82F6', 1),
(2, 'PENDIENTE_EQUIPOS', 'Pendiente de Equipos', 'Esperando recepción de equipos', FALSE, FALSE, '#F59E0B', 2),
(2, 'PENDIENTE_ASIGNACIONES', 'Pendiente de Asignaciones', 'Esperando asignación de técnicos/recursos', FALSE, FALSE, '#F59E0B', 3),
(2, 'POR_COORDINAR', 'Por Coordinar', 'Pendiente de coordinación con cliente', FALSE, FALSE, '#F59E0B', 4),
(2, 'COORDINACION_RECHAZADA', 'Coordinación Rechazada', 'Cliente rechazó fecha propuesta', FALSE, FALSE, '#EF4444', 5),
(2, 'COORDINADO', 'Coordinado', 'Fecha confirmada con cliente', FALSE, FALSE, '#10B981', 6),
(2, 'REALIZANDO', 'Realizando', 'Instalación en curso', FALSE, FALSE, '#8B5CF6', 7),
(2, 'PAUSADA', 'Pausada', 'Instalación pausada temporalmente', FALSE, FALSE, '#F59E0B', 8),
(2, 'POR_INFORME', 'Por Informe', 'Pendiente de carga de informe', FALSE, FALSE, '#F59E0B', 9),
(2, 'CULMINADO', 'Culminado', 'Servicio completado', FALSE, FALSE, '#10B981', 10),
(2, 'PROFORMA', 'Proforma Generada', 'Proforma enviada al cliente', FALSE, FALSE, '#6366F1', 11),
(2, 'FACTURADO', 'Facturado', 'Factura emitida', FALSE, FALSE, '#8B5CF6', 12),
(2, 'PAGADO', 'Pagado', 'Pago recibido', FALSE, TRUE, '#059669', 13);

-- Transiciones para Instalación (simplificado - agregar más según necesidad)
INSERT INTO workflow_transicion (id_workflow, id_estado_origen, id_estado_destino, nombre_accion, requiere_aprobacion, requiere_justificacion) VALUES
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='NUEVO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PENDIENTE_EQUIPOS'), 
    'Solicitar Equipos', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PENDIENTE_EQUIPOS'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PENDIENTE_ASIGNACIONES'), 
    'Equipos Recibidos', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PENDIENTE_ASIGNACIONES'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='POR_COORDINAR'), 
    'Recursos Asignados', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='POR_COORDINAR'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='COORDINADO'), 
    'Confirmar Coordinación', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='COORDINADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='REALIZANDO'), 
    'Iniciar Instalación', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='REALIZANDO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PAUSADA'), 
    'Pausar', FALSE, TRUE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PAUSADA'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='REALIZANDO'), 
    'Reanudar', TRUE, TRUE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='REALIZANDO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='POR_INFORME'), 
    'Completar Instalación', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='POR_INFORME'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='CULMINADO'), 
    'Cargar Informe', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='CULMINADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PROFORMA'), 
    'Generar Proforma', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PROFORMA'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='FACTURADO'), 
    'Facturar', FALSE, FALSE),
(2, (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='FACTURADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=2 AND codigo_estado='PAGADO'), 
    'Registrar Pago', FALSE, FALSE);

-- ============================================
-- Workflow para Mantenimiento Correctivo (ID Tipo Servicio: 6)
-- ============================================

INSERT INTO workflow_definicion (id_tipo_servicio, nombre, descripcion, version, activo)
VALUES (6, 'Workflow Mantenimiento Correctivo v1.0', 'Flujo para atención de fallas', 1, TRUE);

-- Estados para Mantenimiento Correctivo
INSERT INTO workflow_estado (id_workflow, codigo_estado, nombre_estado, descripcion, es_estado_inicial, es_estado_final, color, orden) VALUES
(3, 'NUEVO', 'Nuevo', 'Reporte de falla recibido', TRUE, FALSE, '#EF4444', 1),
(3, 'DIAGNOSTICANDO', 'Diagnosticando', 'Diagnóstico en curso', FALSE, FALSE, '#F59E0B', 2),
(3, 'PENDIENTE_EQUIPOS', 'Pendiente de Equipos', 'Esperando equipos de repuesto', FALSE, FALSE, '#F59E0B', 3),
(3, 'REPARANDO', 'Reparando', 'Reparación en curso', FALSE, FALSE, '#8B5CF6', 4),
(3, 'PROBANDO', 'Probando', 'Pruebas post-reparación', FALSE, FALSE, '#3B82F6', 5),
(3, 'POR_NOTA_ENTREGA', 'Por Nota de Entrega', 'Pendiente de devolución de equipos', FALSE, FALSE, '#F59E0B', 6),
(3, 'CULMINADO', 'Culminado', 'Servicio completado', FALSE, FALSE, '#10B981', 7),
(3, 'PROFORMA', 'Proforma Generada', 'Proforma enviada', FALSE, FALSE, '#6366F1', 8),
(3, 'FACTURADO', 'Facturado', 'Factura emitida', FALSE, FALSE, '#8B5CF6', 9),
(3, 'PAGADO', 'Pagado', 'Pago recibido', FALSE, TRUE, '#059669', 10);

-- Transiciones para Mantenimiento Correctivo
INSERT INTO workflow_transicion (id_workflow, id_estado_origen, id_estado_destino, nombre_accion, requiere_aprobacion, requiere_justificacion) VALUES
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='NUEVO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='DIAGNOSTICANDO'), 
    'Iniciar Diagnóstico', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='DIAGNOSTICANDO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='PENDIENTE_EQUIPOS'), 
    'Solicitar Equipos', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='DIAGNOSTICANDO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='REPARANDO'), 
    'Iniciar Reparación', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='PENDIENTE_EQUIPOS'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='REPARANDO'), 
    'Equipos Recibidos', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='REPARANDO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='PROBANDO'), 
    'Iniciar Pruebas', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='PROBANDO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='POR_NOTA_ENTREGA'), 
    'Pruebas OK', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='POR_NOTA_ENTREGA'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='CULMINADO'), 
    'Equipos Devueltos', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='CULMINADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='PROFORMA'), 
    'Generar Proforma', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='PROFORMA'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='FACTURADO'), 
    'Facturar', FALSE, FALSE),
(3, (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='FACTURADO'), 
    (SELECT id_estado FROM workflow_estado WHERE id_workflow=3 AND codigo_estado='PAGADO'), 
    'Registrar Pago', FALSE, FALSE);

-- ============================================
-- 2. PERMISOS POR MÓDULO
-- ============================================

-- Módulo: ODS
INSERT INTO permiso (modulo, funcionalidad, accion, descripcion) VALUES
('ODS', 'Gestión', 'CREAR', 'Crear nuevas ODS'),
('ODS', 'Gestión', 'LEER', 'Ver ODS'),
('ODS', 'Gestión', 'ACTUALIZAR', 'Modificar ODS'),
('ODS', 'Gestión', 'ELIMINAR', 'Eliminar ODS'),
('ODS', 'Estado', 'ACTUALIZAR', 'Cambiar estado de ODS'),
('ODS', 'Modificación', 'CREAR', 'Solicitar modificación de ODS'),
('ODS', 'Modificación', 'EJECUTAR', 'Aprobar modificación de ODS');

-- Módulo: Equipos
INSERT INTO permiso (modulo, funcionalidad, accion, descripcion) VALUES
('EQUIPOS', 'Gestión', 'CREAR', 'Registrar equipos'),
('EQUIPOS', 'Gestión', 'LEER', 'Ver equipos'),
('EQUIPOS', 'Gestión', 'ACTUALIZAR', 'Modificar equipos'),
('EQUIPOS', 'Movimiento', 'CREAR', 'Registrar movimientos'),
('EQUIPOS', 'NotaEntrega', 'CREAR', 'Crear notas de entrega');

-- Módulo: Herramientas
INSERT INTO permiso (modulo, funcionalidad, accion, descripcion) VALUES
('HERRAMIENTAS', 'Gestión', 'CREAR', 'Registrar herramientas'),
('HERRAMIENTAS', 'Gestión', 'LEER', 'Ver herramientas'),
('HERRAMIENTAS', 'Solicitud', 'CREAR', 'Solicitar herramientas'),
('HERRAMIENTAS', 'Solicitud', 'EJECUTAR', 'Aprobar solicitudes');

-- Módulo: Finanzas
INSERT INTO permiso (modulo, funcionalidad, accion, descripcion) VALUES
('FINANZAS', 'Proforma', 'CREAR', 'Crear proformas'),
('FINANZAS', 'Proforma', 'LEER', 'Ver proformas'),
('FINANZAS', 'Factura', 'CREAR', 'Crear facturas'),
('FINANZAS', 'Factura', 'LEER', 'Ver facturas'),
('FINANZAS', 'Pago', 'CREAR', 'Registrar pagos');

-- Módulo: Workflow
INSERT INTO permiso (modulo, funcionalidad, accion, descripcion) VALUES
('WORKFLOW', 'Configuración', 'CREAR', 'Crear workflows'),
('WORKFLOW', 'Configuración', 'ACTUALIZAR', 'Modificar workflows'),
('WORKFLOW', 'Configuración', 'LEER', 'Ver configuración de workflows');

-- ============================================
-- 3. ASIGNACIÓN DE PERMISOS A ROLES
-- ============================================

-- Administrador del Sistema: TODOS los permisos
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 1, id_permiso FROM permiso;

-- Gerente de Operaciones: Gestión completa de ODS
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 3, id_permiso FROM permiso 
WHERE modulo IN ('ODS', 'EQUIPOS', 'HERRAMIENTAS');

-- Coordinador: Gestión de ODS y aprobaciones
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 4, id_permiso FROM permiso 
WHERE modulo = 'ODS';

-- Técnico: Lectura de ODS y solicitudes
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 6, id_permiso FROM permiso 
WHERE (modulo = 'ODS' AND accion = 'LEER')
   OR (modulo = 'ODS' AND funcionalidad = 'Estado' AND accion = 'ACTUALIZAR')
   OR (modulo = 'HERRAMIENTAS' AND funcionalidad = 'Solicitud' AND accion = 'CREAR');

-- Gerente de Administración: Finanzas
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 9, id_permiso FROM permiso 
WHERE modulo = 'FINANZAS';

-- ============================================
-- 4. DATOS DE EJEMPLO (OPCIONAL - COMENTADO)
-- ============================================

-- Descomentar para cargar datos de prueba

/*
-- Cliente de ejemplo
INSERT INTO cliente (nombre_comercial, razon_social, rif, telefono, email) VALUES
('Movistar Venezuela', 'Telefónica Venezolana C.A.', 'J-00123456-7', '+58-212-1234567', 'contacto@movistar.com.ve');

-- Cliente Final de ejemplo
INSERT INTO cliente_final (nombre, sector_industria) VALUES
('Traki', 'Retail'),
('Banesco', 'Banca');

-- Localidades de ejemplo
INSERT INTO localidad (id_cliente_final, nombre_sitio, direccion_completa, coordenadas_gps, persona_contacto, telefono_contacto) VALUES
(1, 'Traki Maracay', 'Av. Bolívar, Maracay, Aragua', '10.2469,-67.5958', 'Juan Pérez', '+58-414-1234567'),
(2, 'Banesco Torre', 'Av. Universidad, Caracas', '10.5000,-66.9167', 'María González', '+58-424-7654321');

-- Tecnologías de ejemplo
INSERT INTO tecnologia (categoria, subcategoria, marca, modelo) VALUES
('Microondas Terrestre', 'Punto a Punto', 'Harris', 'StarMAX 6000'),
('Satelital', 'VSAT', 'Gilat', 'SkyEdge II-c'),
('Multiplexación', 'SDH', 'Huawei', 'OptiX OSN 1500'),
('Networking', 'Router', 'Cisco', 'ISR 4000');

-- Usuario administrador de ejemplo (password: admin123)
INSERT INTO empleado (cedula, nombre, apellido, fecha_ingreso, cargo, departamento) VALUES
('12345678', 'Admin', 'Sistema', '2024-01-01', 'Administrador', 'TI');

INSERT INTO usuario (id_empleado, username, password_hash, email) VALUES
(1, 'admin', '$2b$10$rBV2kHYW5dF5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5', 'admin@xtel.com');

INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (1, 1);
*/

-- ============================================
-- FIN DEL SEED DATA
-- ============================================

-- Verificar datos cargados
SELECT 'Workflows creados:' as info, COUNT(*) as cantidad FROM workflow_definicion
UNION ALL
SELECT 'Estados de workflow:', COUNT(*) FROM workflow_estado
UNION ALL
SELECT 'Transiciones:', COUNT(*) FROM workflow_transicion
UNION ALL
SELECT 'Permisos creados:', COUNT(*) FROM permiso
UNION ALL
SELECT 'Roles con permisos:', COUNT(DISTINCT id_rol) FROM rol_permiso;
