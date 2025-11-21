-- ============================================
-- SGCV2 - Sistema de Gestión y Control para XTEL Comunicaciones
-- Schema PostgreSQL
-- Versión: 1.0
-- Fecha: 2025-11-21
-- ============================================

-- ============================================
-- EXTENSIONES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TIPOS ENUMERADOS
-- ============================================

-- Estados de Cliente
CREATE TYPE estado_cliente AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO');

-- NOTA: Los estados de ODS NO son ENUM porque son dinámicos y configurables
-- por tipo de servicio a través de workflow_estado. Usar VARCHAR(50).

-- Prioridad de ODS
CREATE TYPE prioridad_ods AS ENUM ('NORMAL', 'ALTA', 'URGENTE');

-- Estados de Equipo
CREATE TYPE estado_equipo AS ENUM (
    'ALMACEN',
    'TRANSITO',
    'INSTALADO',
    'PENDIENTE_NOTA_ENTREGA',
    'ENTREGADO',
    'BAJA'
);

-- Condición de Equipo
CREATE TYPE condicion_equipo AS ENUM ('NUEVO', 'USADO_BUENO', 'USADO_REGULAR', 'DEFECTUOSO');

-- Tipo de Movimiento de Equipo
CREATE TYPE tipo_movimiento_equipo AS ENUM (
    'RECEPCION',
    'ASIGNACION_ODS',
    'INSTALACION',
    'DESINSTALACION',
    'DEVOLUCION',
    'BAJA'
);

-- Estados de Herramienta
CREATE TYPE estado_herramienta AS ENUM ('ALMACEN', 'TRASLADO', 'MANTENIMIENTO', 'BAJA');

-- Estados de Solicitud
CREATE TYPE estado_solicitud AS ENUM (
    'PENDIENTE',
    'APROBADA',
    'ENTREGADA',
    'DEVUELTA',
    'PARCIALMENTE_DEVUELTA',
    'RECHAZADA',
    'CANCELADA'
);

-- Estados de Nota de Entrega
CREATE TYPE estado_nota_entrega AS ENUM (
    'PENDIENTE',
    'EN_TRANSITO',
    'ENTREGADA',
    'RECHAZADA',
    'CANCELADA'
);

-- Tipo de Nota de Entrega
CREATE TYPE tipo_nota_entrega AS ENUM ('ENTREGA_CLIENTE', 'DEVOLUCION_CLIENTE');

-- Estados de Configuración
CREATE TYPE estado_configuracion AS ENUM ('PENDIENTE', 'CARGADA', 'APLICADA', 'RECHAZADA');

-- Nivel de Técnico
CREATE TYPE nivel_tecnico AS ENUM ('JUNIOR', 'SEMI_SENIOR', 'SENIOR', 'ESPECIALISTA');

-- Rol en ODS
CREATE TYPE rol_ods AS ENUM ('PRINCIPAL', 'ASISTENTE', 'SUPERVISOR');

-- Tipo de Informe Técnico
CREATE TYPE tipo_informe_tecnico AS ENUM (
    'INSPECCION',
    'POST_INSTALACION',
    'POST_MANTENIMIENTO',
    'CORRECTIVO'
);

-- Estados de Proforma
CREATE TYPE estado_proforma AS ENUM (
    'BORRADOR',
    'ENVIADA',
    'APROBADA',
    'RECHAZADA',
    'VENCIDA'
);

-- Estados de Factura
CREATE TYPE estado_factura AS ENUM (
    'EMITIDA',
    'ENVIADA',
    'PAGADA_PARCIAL',
    'PAGADA_TOTAL',
    'VENCIDA',
    'ANULADA'
);

-- Estados de Usuario
CREATE TYPE estado_usuario AS ENUM ('ACTIVO', 'INACTIVO', 'BLOQUEADO');

-- Acciones de Permiso
CREATE TYPE accion_permiso AS ENUM ('CREAR', 'LEER', 'ACTUALIZAR', 'ELIMINAR', 'EJECUTAR');

-- Tipo de Regla de Transición
CREATE TYPE tipo_regla_transicion AS ENUM (
    'VALIDACION_CAMPO',
    'VALIDACION_RECURSO',
    'VALIDACION_PERMISO',
    'VALIDACION_NEGOCIO',
    'VALIDACION_TEMPORAL'
);

-- Tipo de Modificación ODS
CREATE TYPE tipo_modificacion_ods AS ENUM (
    'CAMBIO_ESTADO',
    'CAMBIO_ALCANCE',
    'PAUSA',
    'REPROGRAMACION',
    'CANCELACION',
    'REACTIVACION'
);

-- Estado de Empleado
CREATE TYPE estado_empleado AS ENUM ('ACTIVO', 'VACACIONES', 'REPOSO', 'SUSPENDIDO', 'RETIRADO');

-- ============================================
-- MÓDULO DE CLIENTES Y LOCALIDADES
-- ============================================

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre_comercial VARCHAR(200) NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    rif VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    email VARCHAR(100),
    estado estado_cliente DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cliente_final (
    id_cliente_final SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    sector_industria VARCHAR(100),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE localidad (
    id_localidad SERIAL PRIMARY KEY,
    id_cliente_final INTEGER NOT NULL REFERENCES cliente_final(id_cliente_final),
    nombre_sitio VARCHAR(200) NOT NULL,
    direccion_completa TEXT NOT NULL,
    coordenadas_gps VARCHAR(100),
    persona_contacto VARCHAR(200),
    telefono_contacto VARCHAR(50),
    horario_acceso TEXT,
    restricciones_permisos TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO DE TECNOLOGÍAS
-- ============================================

CREATE TABLE tecnologia (
    id_tecnologia SERIAL PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    especificaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO DE SEGURIDAD Y USUARIOS
-- ============================================

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(50),
    email VARCHAR(100),
    direccion TEXT,
    fecha_ingreso DATE NOT NULL,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    tipo_contrato VARCHAR(50),
    salario_base DECIMAL(12,2),
    estado estado_empleado DEFAULT 'ACTIVO',
    datos_bancarios TEXT,
    contacto_emergencia TEXT,
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_empleado INTEGER UNIQUE REFERENCES empleado(id_empleado),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    estado estado_usuario DEFAULT 'ACTIVO',
    fecha_ultimo_acceso TIMESTAMP,
    intentos_fallidos INTEGER DEFAULT 0,
    foto_perfil VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario_rol (
    id_usuario INTEGER REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_rol INTEGER REFERENCES rol(id_rol) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_rol)
);

CREATE TABLE permiso (
    id_permiso SERIAL PRIMARY KEY,
    modulo VARCHAR(100) NOT NULL,
    funcionalidad VARCHAR(100) NOT NULL,
    accion accion_permiso NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(modulo, funcionalidad, accion)
);

CREATE TABLE rol_permiso (
    id_rol INTEGER REFERENCES rol(id_rol) ON DELETE CASCADE,
    id_permiso INTEGER REFERENCES permiso(id_permiso) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol, id_permiso)
);

CREATE TABLE auditoria (
    id_auditoria BIGSERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuario(id_usuario),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    registro_afectado VARCHAR(255),
    valores_anteriores JSONB,
    valores_nuevos JSONB,
    ip_origen VARCHAR(45)
);

-- ============================================
-- MÓDULO DE TÉCNICOS
-- ============================================

CREATE TABLE tecnico (
    id_tecnico SERIAL PRIMARY KEY,
    id_empleado INTEGER UNIQUE NOT NULL REFERENCES empleado(id_empleado),
    especialidades JSONB,
    disponible BOOLEAN DEFAULT TRUE,
    nivel nivel_tecnico DEFAULT 'JUNIOR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO DE WORKFLOW FLEXIBLE
-- ============================================

CREATE TABLE tipo_servicio (
    id_tipo_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    requiere_informe_post BOOLEAN DEFAULT FALSE,
    sla_dias INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflow_definicion (
    id_workflow SERIAL PRIMARY KEY,
    id_tipo_servicio INTEGER NOT NULL REFERENCES tipo_servicio(id_tipo_servicio),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    version INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_tipo_servicio, version)
);

CREATE TABLE workflow_estado (
    id_estado SERIAL PRIMARY KEY,
    id_workflow INTEGER NOT NULL REFERENCES workflow_definicion(id_workflow) ON DELETE CASCADE,
    codigo_estado VARCHAR(50) NOT NULL,
    nombre_estado VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_estado_inicial BOOLEAN DEFAULT FALSE,
    es_estado_final BOOLEAN DEFAULT FALSE,
    color VARCHAR(20),
    orden INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_workflow, codigo_estado)
);

CREATE TABLE workflow_transicion (
    id_transicion SERIAL PRIMARY KEY,
    id_workflow INTEGER NOT NULL REFERENCES workflow_definicion(id_workflow) ON DELETE CASCADE,
    id_estado_origen INTEGER NOT NULL REFERENCES workflow_estado(id_estado),
    id_estado_destino INTEGER NOT NULL REFERENCES workflow_estado(id_estado),
    nombre_accion VARCHAR(100) NOT NULL,
    requiere_aprobacion BOOLEAN DEFAULT FALSE,
    requiere_justificacion BOOLEAN DEFAULT FALSE,
    validaciones JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_workflow, id_estado_origen, id_estado_destino)
);

CREATE TABLE regla_transicion (
    id_regla SERIAL PRIMARY KEY,
    id_transicion INTEGER NOT NULL REFERENCES workflow_transicion(id_transicion) ON DELETE CASCADE,
    tipo_regla tipo_regla_transicion NOT NULL,
    condicion JSONB NOT NULL,
    mensaje_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO DE ÓRDENES DE SERVICIO (ODS)
-- ============================================

CREATE TABLE ods (
    id_ods SERIAL PRIMARY KEY,
    numero_ods VARCHAR(50) UNIQUE NOT NULL,
    numero_orden_cliente VARCHAR(100) NOT NULL,
    id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
    id_cliente_final INTEGER NOT NULL REFERENCES cliente_final(id_cliente_final),
    id_localidad INTEGER NOT NULL REFERENCES localidad(id_localidad),
    id_tipo_servicio INTEGER NOT NULL REFERENCES tipo_servicio(id_tipo_servicio),
    estado_actual VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada TIMESTAMP,
    fecha_ejecucion TIMESTAMP,
    fecha_culminacion TIMESTAMP,
    descripcion TEXT,
    diagnostico_inicial TEXT,
    observaciones TEXT,
    usuario_creador INTEGER NOT NULL REFERENCES usuario(id_usuario),
    prioridad prioridad_ods DEFAULT 'NORMAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ods_tecnologia (
    id_ods INTEGER REFERENCES ods(id_ods) ON DELETE CASCADE,
    id_tecnologia INTEGER REFERENCES tecnologia(id_tecnologia),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_ods, id_tecnologia)
);

CREATE TABLE ods_estado_historial (
    id_historial BIGSERIAL PRIMARY KEY,
    id_ods INTEGER NOT NULL REFERENCES ods(id_ods) ON DELETE CASCADE,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_responsable INTEGER NOT NULL REFERENCES usuario(id_usuario),
    observaciones TEXT
);

CREATE TABLE modificacion_ods (
    id_modificacion BIGSERIAL PRIMARY KEY,
    id_ods INTEGER NOT NULL REFERENCES ods(id_ods) ON DELETE CASCADE,
    id_transicion INTEGER REFERENCES workflow_transicion(id_transicion),
    tipo_modificacion tipo_modificacion_ods NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    justificacion TEXT NOT NULL,
    requiere_aprobacion BOOLEAN DEFAULT FALSE,
    aprobada BOOLEAN,
    usuario_solicita INTEGER NOT NULL REFERENCES usuario(id_usuario),
    usuario_aprueba INTEGER REFERENCES usuario(id_usuario),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP,
    datos_adicionales JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE configuracion (
    id_configuracion SERIAL PRIMARY KEY,
    id_ods INTEGER NOT NULL REFERENCES ods(id_ods) ON DELETE CASCADE,
    parametros_tecnicos JSONB,
    archivo_config VARCHAR(255),
    estado estado_configuracion DEFAULT 'PENDIENTE',
    fecha_carga TIMESTAMP,
    usuario_cargo INTEGER REFERENCES usuario(id_usuario),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ods_tecnico (
    id_asignacion SERIAL PRIMARY KEY,
    id_ods INTEGER NOT NULL REFERENCES ods(id_ods) ON DELETE CASCADE,
    id_tecnico INTEGER NOT NULL REFERENCES tecnico(id_tecnico),
    rol rol_ods DEFAULT 'ASISTENTE',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_ods, id_tecnico)
);

-- ============================================
-- MÓDULO DE EQUIPOS
-- ============================================

CREATE TABLE equipo (
    id_equipo SERIAL PRIMARY KEY,
    serial VARCHAR(100) UNIQUE NOT NULL,
    id_cliente_propietario INTEGER NOT NULL REFERENCES cliente(id_cliente),
    id_tecnologia INTEGER REFERENCES tecnologia(id_tecnologia),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    estado_ciclo_vida estado_equipo DEFAULT 'ALMACEN',
    id_localidad_instalado INTEGER REFERENCES localidad(id_localidad),
    ubicacion_almacen VARCHAR(100),
    condicion condicion_equipo DEFAULT 'NUEVO',
    fecha_recepcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipo_movimiento (
    id_movimiento BIGSERIAL PRIMARY KEY,
    id_equipo INTEGER NOT NULL REFERENCES equipo(id_equipo) ON DELETE CASCADE,
    id_ods INTEGER REFERENCES ods(id_ods),
    tipo_movimiento tipo_movimiento_equipo NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_responsable INTEGER NOT NULL REFERENCES usuario(id_usuario),
    observaciones TEXT
);

CREATE TABLE nota_entrega (
    id_nota_entrega SERIAL PRIMARY KEY,
    numero_nota VARCHAR(50) UNIQUE NOT NULL,
    id_ods INTEGER REFERENCES ods(id_ods),
    tipo tipo_nota_entrega NOT NULL,
    estado estado_nota_entrega DEFAULT 'PENDIENTE',
    transportista VARCHAR(200),
    numero_guia VARCHAR(100),
    fecha_despacho TIMESTAMP,
    fecha_entrega TIMESTAMP,
    firma_cliente BYTEA,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nota_entrega_detalle (
    id_detalle SERIAL PRIMARY KEY,
    id_nota_entrega INTEGER NOT NULL REFERENCES nota_entrega(id_nota_entrega) ON DELETE CASCADE,
    id_equipo INTEGER NOT NULL REFERENCES equipo(id_equipo),
    condicion VARCHAR(50),
    observaciones TEXT
);

-- ============================================
-- MÓDULO DE HERRAMIENTAS
-- ============================================

CREATE TABLE herramienta (
    id_herramienta SERIAL PRIMARY KEY,
    codigo_herramienta VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    estado estado_herramienta DEFAULT 'ALMACEN',
    condicion condicion_equipo DEFAULT 'NUEVO',
    valor DECIMAL(12,2),
    fecha_adquisicion DATE,
    proveedor VARCHAR(200),
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solicitud_herramienta (
    id_solicitud_herramienta SERIAL PRIMARY KEY,
    id_tecnico INTEGER NOT NULL REFERENCES tecnico(id_tecnico),
    estado estado_solicitud DEFAULT 'PENDIENTE',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_requerida TIMESTAMP,
    fecha_entrega TIMESTAMP,
    fecha_devolucion TIMESTAMP,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solicitud_herramienta_detalle (
    id_detalle SERIAL PRIMARY KEY,
    id_solicitud_herramienta INTEGER NOT NULL REFERENCES solicitud_herramienta(id_solicitud_herramienta) ON DELETE CASCADE,
    id_herramienta INTEGER NOT NULL REFERENCES herramienta(id_herramienta),
    cantidad INTEGER NOT NULL DEFAULT 1,
    UNIQUE(id_solicitud_herramienta, id_herramienta)
);

CREATE TABLE solicitud_herramienta_ods (
    id_solicitud_herramienta INTEGER REFERENCES solicitud_herramienta(id_solicitud_herramienta) ON DELETE CASCADE,
    id_ods INTEGER REFERENCES ods(id_ods) ON DELETE CASCADE,
    PRIMARY KEY (id_solicitud_herramienta, id_ods)
);

-- ============================================
-- MÓDULO DE INSUMOS
-- ============================================

CREATE TABLE insumo (
    id_insumo SERIAL PRIMARY KEY,
    codigo_insumo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    unidad_medida VARCHAR(50),
    stock_actual DECIMAL(12,3) DEFAULT 0,
    stock_minimo DECIMAL(12,3) DEFAULT 0,
    stock_maximo DECIMAL(12,3),
    costo_unitario DECIMAL(12,2),
    proveedor_principal VARCHAR(200),
    ubicacion_almacen VARCHAR(100),
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_stock_no_negativo CHECK (stock_actual >= 0)
);

CREATE TABLE ods_insumo (
    id_asignacion SERIAL PRIMARY KEY,
    id_ods INTEGER NOT NULL REFERENCES ods(id_ods) ON DELETE CASCADE,
    id_insumo INTEGER NOT NULL REFERENCES insumo(id_insumo),
    cantidad_asignada DECIMAL(12,3) NOT NULL,
    cantidad_devuelta DECIMAL(12,3) DEFAULT 0,
    cantidad_usada DECIMAL(12,3) DEFAULT 0,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion TIMESTAMP,
    estado estado_solicitud DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_ods, id_insumo)
);

-- ============================================
-- MÓDULO DE INFORMES
-- ============================================

CREATE TABLE informe_servicio (
    id_informe_servicio SERIAL PRIMARY KEY,
    id_ods INTEGER UNIQUE NOT NULL REFERENCES ods(id_ods) ON DELETE CASCADE,
    hora_inicio TIME,
    hora_fin TIME,
    trabajo_realizado TEXT,
    observaciones TEXT,
    firma_cliente BYTEA,
    archivo_escaneado VARCHAR(255),
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE informe_tecnico (
    id_informe_tecnico SERIAL PRIMARY KEY,
    id_ods INTEGER NOT NULL REFERENCES ods(id_ods) ON DELETE CASCADE,
    tipo_informe tipo_informe_tecnico NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_creador INTEGER NOT NULL REFERENCES usuario(id_usuario),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE informe_imagen (
    id_imagen SERIAL PRIMARY KEY,
    id_informe_tecnico INTEGER NOT NULL REFERENCES informe_tecnico(id_informe_tecnico) ON DELETE CASCADE,
    archivo_imagen VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO DE FINANZAS
-- ============================================

CREATE TABLE proforma (
    id_proforma SERIAL PRIMARY KEY,
    numero_proforma VARCHAR(50) UNIQUE NOT NULL,
    id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
    fecha_emision DATE DEFAULT CURRENT_DATE,
    fecha_envio DATE,
    fecha_aprobacion DATE,
    estado estado_proforma DEFAULT 'BORRADOR',
    subtotal DECIMAL(12,2) DEFAULT 0,
    impuestos DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    observaciones_cliente TEXT,
    archivo_pdf VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proforma_detalle (
    id_detalle SERIAL PRIMARY KEY,
    id_proforma INTEGER NOT NULL REFERENCES proforma(id_proforma) ON DELETE CASCADE,
    id_ods INTEGER NOT NULL REFERENCES ods(id_ods),
    descripcion TEXT,
    monto DECIMAL(12,2) NOT NULL,
    UNIQUE(id_proforma, id_ods)
);

CREATE TABLE factura (
    id_factura SERIAL PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    id_proforma INTEGER REFERENCES proforma(id_proforma),
    id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
    fecha_emision DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    estado estado_factura DEFAULT 'EMITIDA',
    base_imponible DECIMAL(12,2) NOT NULL,
    impuestos DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    saldo_pendiente DECIMAL(12,2),
    archivo_pdf VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    id_factura INTEGER NOT NULL REFERENCES factura(id_factura) ON DELETE CASCADE,
    numero_referencia VARCHAR(100) UNIQUE NOT NULL,
    fecha_pago DATE NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    metodo_pago VARCHAR(50),
    banco VARCHAR(100),
    comprobante VARCHAR(255),
    usuario_registro INTEGER NOT NULL REFERENCES usuario(id_usuario),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices de búsqueda frecuente
CREATE INDEX idx_ods_estado ON ods(estado_actual);
CREATE INDEX idx_ods_cliente ON ods(id_cliente);
CREATE INDEX idx_ods_fecha_programada ON ods(fecha_programada);
CREATE INDEX idx_ods_numero_orden_cliente ON ods(numero_orden_cliente);

CREATE INDEX idx_equipo_serial ON equipo(serial);
CREATE INDEX idx_equipo_estado ON equipo(estado_ciclo_vida);
CREATE INDEX idx_equipo_localidad ON equipo(id_localidad_instalado);

CREATE INDEX idx_localidad_cliente_final ON localidad(id_cliente_final);

CREATE INDEX idx_historial_ods ON ods_estado_historial(id_ods);
CREATE INDEX idx_historial_fecha ON ods_estado_historial(fecha_cambio DESC);

CREATE INDEX idx_modificacion_ods ON modificacion_ods(id_ods);
CREATE INDEX idx_modificacion_aprobacion ON modificacion_ods(aprobada) WHERE requiere_aprobacion = TRUE;

CREATE INDEX idx_auditoria_usuario ON auditoria(id_usuario);
CREATE INDEX idx_auditoria_fecha ON auditoria(fecha_hora DESC);
CREATE INDEX idx_auditoria_modulo ON auditoria(modulo);

CREATE INDEX idx_factura_cliente ON factura(id_cliente);
CREATE INDEX idx_factura_estado ON factura(estado);
CREATE INDEX idx_factura_vencimiento ON factura(fecha_vencimiento);

CREATE INDEX idx_insumo_stock ON insumo(stock_actual) WHERE stock_actual <= stock_minimo;

-- Índices para búsqueda de texto
CREATE INDEX idx_cliente_nombre ON cliente USING gin(to_tsvector('spanish', nombre_comercial));
CREATE INDEX idx_localidad_nombre ON localidad USING gin(to_tsvector('spanish', nombre_sitio));

-- ============================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- ============================================

-- Función genérica para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_cliente_updated_at BEFORE UPDATE ON cliente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_localidad_updated_at BEFORE UPDATE ON localidad
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ods_updated_at BEFORE UPDATE ON ods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipo_updated_at BEFORE UPDATE ON equipo
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuario_updated_at BEFORE UPDATE ON usuario
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para registrar cambios de estado de ODS
CREATE OR REPLACE FUNCTION registrar_cambio_estado_ods()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado_actual IS DISTINCT FROM NEW.estado_actual THEN
        INSERT INTO ods_estado_historial (
            id_ods,
            estado_anterior,
            estado_nuevo,
            usuario_responsable,
            observaciones
        ) VALUES (
            NEW.id_ods,
            OLD.estado_actual,
            NEW.estado_actual,
            NEW.usuario_creador, -- En producción, esto vendría del contexto de sesión
            'Cambio automático de estado'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cambio_estado_ods
    AFTER UPDATE ON ods
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_estado_ods();

-- Función para actualizar stock de insumos
CREATE OR REPLACE FUNCTION actualizar_stock_insumo()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE insumo
        SET stock_actual = stock_actual - NEW.cantidad_asignada
        WHERE id_insumo = NEW.id_insumo;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.cantidad_devuelta IS DISTINCT FROM NEW.cantidad_devuelta THEN
            UPDATE insumo
            SET stock_actual = stock_actual + (NEW.cantidad_devuelta - OLD.cantidad_devuelta)
            WHERE id_insumo = NEW.id_insumo;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stock_insumo
    AFTER INSERT OR UPDATE ON ods_insumo
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_stock_insumo();

-- Función para actualizar saldo de factura
CREATE OR REPLACE FUNCTION actualizar_saldo_factura()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE factura
    SET saldo_pendiente = total - (
        SELECT COALESCE(SUM(monto), 0)
        FROM pago
        WHERE id_factura = NEW.id_factura
    )
    WHERE id_factura = NEW.id_factura;
    
    -- Actualizar estado si está pagada totalmente
    UPDATE factura
    SET estado = 'PAGADA_TOTAL'
    WHERE id_factura = NEW.id_factura
    AND saldo_pendiente <= 0;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_saldo
    AFTER INSERT ON pago
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_saldo_factura();

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Generar número de ODS automático
CREATE OR REPLACE FUNCTION generar_numero_ods()
RETURNS VARCHAR AS $$
DECLARE
    nuevo_numero VARCHAR;
    anio VARCHAR;
    secuencia INTEGER;
BEGIN
    anio := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_ods FROM 9) AS INTEGER)), 0) + 1
    INTO secuencia
    FROM ods
    WHERE numero_ods LIKE 'ODS-' || anio || '-%';
    
    nuevo_numero := 'ODS-' || anio || '-' || LPAD(secuencia::TEXT, 5, '0');
    
    RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- Generar número de factura automático
CREATE OR REPLACE FUNCTION generar_numero_factura()
RETURNS VARCHAR AS $$
DECLARE
    nuevo_numero VARCHAR;
    anio VARCHAR;
    mes VARCHAR;
    secuencia INTEGER;
BEGIN
    anio := TO_CHAR(CURRENT_DATE, 'YYYY');
    mes := TO_CHAR(CURRENT_DATE, 'MM');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM 13) AS INTEGER)), 0) + 1
    INTO secuencia
    FROM factura
    WHERE numero_factura LIKE 'FAC-' || anio || mes || '-%';
    
    nuevo_numero := 'FAC-' || anio || mes || '-' || LPAD(secuencia::TEXT, 4, '0');
    
    RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de ODS con información completa
CREATE OR REPLACE VIEW v_ods_completa AS
SELECT 
    o.id_ods,
    o.numero_ods,
    o.numero_orden_cliente,
    c.nombre_comercial AS cliente,
    cf.nombre AS cliente_final,
    l.nombre_sitio AS localidad,
    ts.nombre AS tipo_servicio,
    o.estado_actual,
    o.prioridad,
    o.fecha_programada,
    o.fecha_culminacion,
    u.username AS usuario_creador,
    STRING_AGG(DISTINCT t.categoria || ' ' || t.marca || ' ' || t.modelo, ', ') AS tecnologias,
    COUNT(DISTINCT ot.id_tecnico) AS cantidad_tecnicos
FROM ods o
JOIN cliente c ON o.id_cliente = c.id_cliente
JOIN cliente_final cf ON o.id_cliente_final = cf.id_cliente_final
JOIN localidad l ON o.id_localidad = l.id_localidad
JOIN tipo_servicio ts ON o.id_tipo_servicio = ts.id_tipo_servicio
JOIN usuario u ON o.usuario_creador = u.id_usuario
LEFT JOIN ods_tecnologia otech ON o.id_ods = otech.id_ods
LEFT JOIN tecnologia t ON otech.id_tecnologia = t.id_tecnologia
LEFT JOIN ods_tecnico ot ON o.id_ods = ot.id_ods
GROUP BY o.id_ods, c.nombre_comercial, cf.nombre, l.nombre_sitio, ts.nombre, u.username;

-- Vista de equipos con ubicación actual
CREATE OR REPLACE VIEW v_equipos_ubicacion AS
SELECT 
    e.id_equipo,
    e.serial,
    c.nombre_comercial AS propietario,
    t.categoria || ' ' || t.marca || ' ' || t.modelo AS tipo_equipo,
    e.estado_ciclo_vida,
    e.condicion,
    CASE 
        WHEN e.estado_ciclo_vida = 'INSTALADO' THEN l.nombre_sitio
        WHEN e.estado_ciclo_vida = 'ALMACEN' THEN e.ubicacion_almacen
        ELSE 'En tránsito'
    END AS ubicacion_actual,
    e.fecha_recepcion
FROM equipo e
JOIN cliente c ON e.id_cliente_propietario = c.id_cliente
LEFT JOIN tecnologia t ON e.id_tecnologia = t.id_tecnologia
LEFT JOIN localidad l ON e.id_localidad_instalado = l.id_localidad;

-- Vista de facturas pendientes
CREATE OR REPLACE VIEW v_facturas_pendientes AS
SELECT 
    f.id_factura,
    f.numero_factura,
    c.nombre_comercial AS cliente,
    f.fecha_emision,
    f.fecha_vencimiento,
    f.total,
    f.saldo_pendiente,
    CASE 
        WHEN f.fecha_vencimiento < CURRENT_DATE THEN 'VENCIDA'
        WHEN f.fecha_vencimiento <= CURRENT_DATE + INTERVAL '7 days' THEN 'POR_VENCER'
        ELSE 'VIGENTE'
    END AS estado_vencimiento,
    CURRENT_DATE - f.fecha_vencimiento AS dias_vencidos
FROM factura f
JOIN cliente c ON f.id_cliente = c.id_cliente
WHERE f.estado NOT IN ('PAGADA_TOTAL', 'ANULADA')
ORDER BY f.fecha_vencimiento;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Roles básicos
INSERT INTO rol (nombre_rol, descripcion) VALUES
('Administrador del Sistema', 'Acceso total al sistema'),
('Gerente General', 'Gestión general de la empresa'),
('Gerente de Operaciones', 'Gestión de operaciones y ODS'),
('Coordinador', 'Coordinación de servicios'),
('Asistente de Operaciones', 'Asistencia en operaciones'),
('Técnico', 'Ejecución de servicios técnicos'),
('Gerente de Logística', 'Gestión de equipos y recursos'),
('Almacenista', 'Control de almacén'),
('Gerente de Administración', 'Gestión administrativa y financiera'),
('Contador', 'Gestión contable y financiera'),
('Analista de RRHH', 'Gestión de recursos humanos');

-- Tipos de servicio
INSERT INTO tipo_servicio (nombre, descripcion, requiere_informe_post, sla_dias) VALUES
('Inspección', 'Site Survey / Inspección técnica', TRUE, 5),
('Instalación', 'Instalación de equipos', TRUE, 10),
('Desinstalación', 'Desinstalación de equipos', TRUE, 7),
('Migración', 'Migración de tecnología', TRUE, 15),
('Mantenimiento Preventivo', 'Mantenimiento programado', TRUE, 7),
('Mantenimiento Correctivo', 'Reparación de fallas', TRUE, 3),
('Asistencia Técnica', 'Soporte técnico', FALSE, 2);

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

COMMENT ON TABLE ods IS 'Órdenes de Servicio - Núcleo del sistema';
COMMENT ON TABLE workflow_definicion IS 'Define workflows personalizados por tipo de servicio';
COMMENT ON TABLE workflow_transicion IS 'Transiciones permitidas entre estados con validaciones';
COMMENT ON TABLE modificacion_ods IS 'Registro de modificaciones de ODS con sistema de aprobación';
COMMENT ON TABLE auditoria IS 'Registro de auditoría de todas las acciones del sistema';

COMMENT ON COLUMN ods.numero_ods IS 'Número único autogenerado formato: ODS-YYYY-NNNNN';
COMMENT ON COLUMN modificacion_ods.datos_adicionales IS 'Datos adicionales en JSON para flexibilidad';
COMMENT ON COLUMN workflow_transicion.validaciones IS 'Reglas de validación en formato JSON';

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
