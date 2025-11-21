# **Documento de Análisis y Diseño del Sistema de Gestión y Control para XTEL Comunicaciones**

## **1\. RESUMEN EJECUTIVO**

XTEL Comunicaciones es una empresa contratista de telecomunicaciones que requiere un sistema integral para gestionar sus operaciones, logística y administración. El sistema debe coordinar múltiples flujos de trabajo complejos que involucran equipos, personal, clientes y recursos a través de tres unidades principales: Administración, Logística y Operaciones.

---

## **2\. ANÁLISIS DEL DOMINIO DEL NEGOCIO**

### **2.1 Contexto de Negocio**

**Industria:** Servicios de telecomunicaciones (contratista B2B)

**Clientes:** Empresas carrier de telecomunicación con infraestructura propia

**Modelo de Negocio:** Prestación de servicios técnicos especializados por orden de trabajo

**Complejidad Principal:** Coordinación de múltiples recursos (equipos, personal, herramientas, insumos) a través de flujos de trabajo con estados múltiples y dependencias complejas.

### **2.2 Mapa del Dominio**

DOMINIO: Gestión de Servicios de Telecomunicaciones

├── CLIENTES  
│   ├── Empresa Cliente (Carrier)  
│   ├── Contacto en Localidad  
│   └── Órdenes del Cliente  
│  
├── SERVICIOS  
│   ├── Inspección/Site Survey  
│   ├── Instalación  
│   ├── Desinstalación  
│   ├── Migración  
│   ├── Mantenimiento Preventivo  
│   ├── Mantenimiento Correctivo  
│   └── Asistencia Técnica  
│  
├── RECURSOS  
│   ├── Equipos (del cliente)  
│   │   ├── En Almacén  
│   │   ├── En Tránsito  
│   │   ├── Instalados  
│   │   └── Por Devolver  
│   ├── Herramientas (de XTEL)  
│   ├── Insumos (consumibles)  
│   └── Vehículos  
│  
├── PERSONAL  
│   ├── Técnicos  
│   ├── Coordinadores  
│   ├── Asistentes de Operación  
│   └── Personal Administrativo  
│  
├── ÓRDENES DE SERVICIO (ODS)  
│   ├── Estados del Workflow  
│   ├── Asignaciones  
│   └── Documentación  
│  
└── FINANZAS  
    ├── Proformas  
    ├── Facturas

    └── Pagos

---

## **3\. PROBLEMAS IDENTIFICADOS**

### **3.1 Problemas Operacionales**

**P1: Gestión Compleja de Estados de ODS**

* Cada tipo de servicio tiene su propio workflow con 10-15 estados diferentes  
* Estados dependen de múltiples factores: equipos, coordinación, personal, informes  
* Alto riesgo de pérdida de seguimiento manual  
* Dificultad para identificar cuellos de botella

**P2: Coordinación Multi-Departamental**

* Operaciones, Logística y Administración deben trabajar sobre las mismas ODS  
* Dependencias cruzadas: no se puede instalar sin equipos, coordinación, técnicos  
* Falta de visibilidad en tiempo real del estado de recursos

**P3: Trazabilidad de Equipos**

* Equipos del cliente pasan por múltiples estados: recepción → almacén → tránsito → instalado → fallado → devolución  
* Necesidad de tracking individual de cada equipo  
* Equipos asociados a múltiples ODS a lo largo de su ciclo de vida

**P4: Gestión de Asignaciones Temporales**

* Herramientas asignadas a técnicos por día/actividad  
* Insumos asignados a ODS específicas con cantidades  
* Equipos de repuesto asignados temporalmente en correctivos  
* Control de devoluciones y faltantes

### **3.2 Problemas de Información**

**P5: Generación de Informes**

* Múltiples tipos de informes: servicio, inspección, post-instalación, post-mantenimiento  
* Informes con fotografías y documentación técnica  
* Firma digital/física del cliente  
* Distribución a stakeholders

**P6: Falta de Histórico Estructurado**

* Necesidad de consultar actividades previas en una localidad  
* Histórico de equipos (dónde estuvieron, fallas, reemplazos)  
* Histórico de técnicos y su desempeño

### **3.3 Problemas Administrativos/Financieros**

**P7: Ciclo de Facturación Complejo**

* Agrupación de ODS por período para proformas  
* Múltiples estados: culminado → proforma → facturado → pagado  
* Seguimiento de aprobaciones del cliente  
* Relación entre ODS y documentos financieros

**P8: Gestión de RRHH**

* Nómina  
* Deducciones (SSO, PF, Política Habitacional)  
* Guardias  
* Proceso de incorporación de personal

### **3.4 Problemas de Comunicación**

**P9: Coordinación con Clientes**

* Múltiples intentos de coordinación (aprobación/rechazo)  
* Comunicación por múltiples canales (teléfono, correo, sistema del cliente)  
* Falta de registro unificado de comunicaciones

**P10: Notificaciones Internas**

* Personal de diferentes departamentos necesita saber cuándo actuar  
* Alertas de ODS bloqueadas o atrasadas  
* Notificación de equipos no devueltos o en mal estado

---

## **4\. REQUERIMIENTOS FUNCIONALES**

### **4.1 Módulo de Gestión de Clientes**

**RF-CL-001:** Registro y administración de empresas cliente

* Datos de contacto corporativo  
* RIF/identificación fiscal  
* Múltiples contactos por localidad  
* Historial de servicios prestados  
* Estado del cliente (activo/inactivo)

**RF-CL-002:** Gestión de localidades

* Direcciones de sitios de clientes  
* Contactos específicos por localidad  
* Historial de actividades en la localidad  
* Información de permisos y restricciones  
* Horarios permitidos para trabajos  
* Notas sobre accesos y particularidades

**RF-CL-003:** Gestión de tecnologías por localidad

* Registro de equipos instalados actualmente  
* Tecnología implementada  
* Nodos o repetidoras con línea de vista  
* Configuraciones específicas

---

### **4.2 Módulo de Órdenes de Servicio (ODS)**

**RF-ODS-001:** Creación de ODS

* Número único interno (autogenerado)  
* Número de orden del cliente (obligatorio)  
* Tipo de servicio (ENUM: inspección, instalación, desinstalación, migración, mantenimiento preventivo, correctivo, asistencia técnica)  
* Cliente y localidad  
* Tecnología involucrada  
* Descripción inicial  
* Diagnóstico inicial (en caso de correctivos)  
* Fecha de solicitud (automática)  
* Usuario creador

**RF-ODS-002:** Sistema de Workflow Flexible por Tipo de Servicio

* **Definición de Workflows Personalizados:**
  * Cada tipo de servicio tiene su propio workflow configurable
  * Versionamiento de workflows para evolución sin pérdida de historial
  * Estados base obligatorios: PENDIENTE, EN_PROGRESO, COMPLETADA, CERRADA
  * Estados personalizables según necesidades del tipo de servicio
  * Propiedades visuales por estado (color, icono)
  * Marcadores de estado inicial y estados finales

* **Gestión de Transiciones:**
  * Definición de transiciones permitidas entre estados
  * Nombre descriptivo de cada acción de transición
  * Configuración de requisitos previos para cada transición
  * Validaciones automáticas antes de permitir transición
  * Opción de requerir aprobación para transiciones críticas
  * Opción de requerir justificación obligatoria

* **Tipos de Reglas de Validación:**
  * VALIDACION_CAMPO: Verificar campos obligatorios completados
  * VALIDACION_RECURSO: Verificar disponibilidad de recursos (equipos, técnicos, herramientas)
  * VALIDACION_PERMISO: Verificar permisos del usuario según rol
  * VALIDACION_NEGOCIO: Lógica de negocio personalizada
  * VALIDACION_TEMPORAL: Restricciones de tiempo (SLA, horarios)
  * Mensajes de error personalizados por regla

* **Sistema de Modificaciones con Aprobación:**
  * Registro de todas las modificaciones de ODS
  * Tipos de modificación: CAMBIO_ESTADO, CAMBIO_ALCANCE, PAUSA, REPROGRAMACION, CANCELACION, REACTIVACION
  * Flujo de aprobación configurable por tipo de modificación
  * Notificaciones automáticas a aprobadores
  * Estados de modificación: PENDIENTE, APROBADA, RECHAZADA
  * Justificación obligatoria para modificaciones críticas
  * Datos adicionales en formato JSON para flexibilidad

* **Matriz de Permisos por Rol:**
  * Definición de qué roles pueden ejecutar qué transiciones
  * Permisos diferenciados: Técnico, Supervisor, Coordinador, Gerente Operaciones
  * Acciones básicas vs. acciones que requieren aprobación
  * Configuración de aprobadores por tipo de modificación

* **Auditoría y Trazabilidad:**
  * Registro inmutable de cada cambio de estado
  * Timestamp automático en cada transición
  * Usuario responsable de cada transición
  * Usuario aprobador (si aplica)
  * Observaciones y justificaciones
  * Historial completo consultable
  * Datos adicionales específicos por tipo de modificación

* **Estados Especiales:**
  * PAUSADA: Requiere fecha estimada de reanudación y justificación
  * REPROGRAMADA: Requiere nueva fecha y motivo
  * CANCELADA: Requiere aprobación de Coordinador o superior
  * MATERIALES_PENDIENTES: Requiere especificar materiales faltantes
  * REQUIERE_APROBACION: Bloquea hasta obtener aprobación externa

**RF-ODS-003:** Gestión de pendientes automáticos

* Generación automática de pendientes según tipo de servicio:  
  * Pendiente por equipos  
  * Pendiente por configuración  
  * Pendiente por insumos  
  * Pendiente por técnicos  
* Notificaciones automáticas a departamentos responsables  
* Dashboard de pendientes por ODS  
* Resolución de pendientes con registro de fecha/hora/usuario  
* Bloqueo de avance de estado hasta resolución de pendientes críticos

**RF-ODS-004:** Asignación de recursos a ODS

* Asignación de técnicos (1 o más según servicio)  
* Rol del técnico (principal/asistente)  
* Asignación de equipos con tracking individual  
* Asignación de herramientas mediante solicitud  
* Asignación de insumos con cantidades específicas  
* Asignación de vehículos  
* Historial completo de asignaciones

**RF-ODS-005:** Gestión de coordinación con cliente

* Agendamiento de fechas propuestas  
* Recordatorio automático 24-72 horas antes (según tipo de servicio)  
* Plantilla de comunicación con cliente  
* Registro de aprobación/rechazo  
* Motivo de rechazo  
* Re-agendamiento automático en caso de rechazo  
* Historial completo de coordinaciones  
* Estado de coordinación visible en ODS

**RF-ODS-006:** Gestión de documentación

* Carga de informe de servicio (escaneado o digital)  
* Firma del cliente capturada (digital o imagen)  
* Hora de inicio y fin de actividad  
* Carga de informes técnicos:  
  * Informe de inspección  
  * Informe post-instalación  
  * Informe post-mantenimiento  
* Almacenamiento de fotografías con descripción  
* Carga de archivos de configuración  
* Carga de croquis y planos  
* Generación automática de correos con informes adjuntos  
* Control de versiones de documentos

**RF-ODS-007:** Cronograma de actividades

* Vista de calendario con ODS programadas  
* Filtrado por técnico, cliente, tipo de servicio  
* Vista diaria, semanal, mensual  
* Identificación visual de ODS según estado  
* Alertas de ODS sin coordinar próximas a fecha programada  
* Arrastrar y soltar para re-programar  
* Detección de conflictos (mismo técnico, múltiples actividades)

**RF-ODS-008:** Consultas y reportes de ODS

* Filtrado avanzado por:  
  * Estado  
  * Cliente  
  * Técnico  
  * Fecha (rango)  
  * Tipo de servicio  
  * Localidad  
  * Número de orden (interno o del cliente)  
* Dashboard de estados (cantidad de ODS por estado)  
* Alertas de ODS atrasadas  
* Alertas de ODS bloqueadas por pendientes  
* Reporte de productividad por técnico/período  
* Tiempo promedio por tipo de servicio  
* Tiempo promedio en cada estado  
* Exportación de reportes (PDF, Excel)

**RF-ODS-009:** Estados específicos por tipo de servicio

**Inspección:**

1. NUEVO  
2. POR COORDINAR  
3. COORDINACIÓN RECHAZADA (bucle a POR COORDINAR)  
4. COORDINADO  
5. POR REALIZAR  
6. REALIZANDO  
7. POR INFORME  
8. CULMINADO  
9. PROFORMA  
10. FACTURADO  
11. PAGADO

**Instalación:**

1. NUEVO  
2. PENDIENTE POR ASIGNACIONES  
3. PENDIENTE POR EQUIPOS  
4. POR COORDINAR  
5. COORDINACIÓN RECHAZADA (bucle a POR COORDINAR)  
6. COORDINADO  
7. POR REALIZAR  
8. REALIZANDO  
9. POR INFORME  
10. CULMINADO  
11. PROFORMA  
12. FACTURADO  
13. PAGADO

**Desinstalación:**

1. NUEVO  
2. POR COORDINAR  
3. COORDINACIÓN RECHAZADA (bucle a POR COORDINAR)  
4. COORDINADO  
5. POR REALIZAR  
6. REALIZANDO  
7. POR NOTA DE ENTREGA  
8. EQUIPOS POR ENTREGAR  
9. CULMINADO  
10. PROFORMA  
11. FACTURADO  
12. PAGADO

**Mantenimiento Correctivo:**

1. NUEVO  
2. PENDIENTE ASIGNACIÓN  
3. REALIZANDO  
4. POR NOTA DE ENTREGA  
5. EQUIPOS POR ENTREGAR  
6. CULMINADO  
7. PROFORMA  
8. FACTURADO  
9. PAGADO

---

### **4.3 Módulo de Logística \- Equipos**

**RF-LOG-EQ-001:** Recepción de equipos del cliente

* Registro de aviso de llegada de equipos  
* Número de orden de entrega del cliente  
* Registro individual de cada equipo:  
  * Serial/ID único  
  * Marca  
  * Modelo  
  * Tipo de tecnología  
  * Condición al recibir (nuevo/usado/operativo)  
  * Fotografías del equipo  
* Asociación a ODS específica o a stock de repuestos  
* Estado inicial: ALMACÉN  
* Ubicación física en almacén (pasillo, estante, posición)  
* Fecha y hora de recepción  
* Usuario que recibió

**RF-LOG-EQ-002:** Tracking de estados de equipos

* Estados posibles:  
  * ALMACÉN: En bodega de XTEL  
  * TRÁNSITO: En poder de técnico o en camino  
  * INSTALADO: Instalado en localidad del cliente  
  * PENDIENTE NOTA ENTREGA: Equipo fallado esperando devolución  
  * ENTREGADO: Devuelto al cliente  
* Historial completo de cambios de estado:  
  * Fecha/hora  
  * Estado anterior → Estado nuevo  
  * Usuario responsable  
  * ODS asociada  
  * Observaciones  
* Visualización de línea de tiempo del equipo  
* Asociación del equipo a ODS actual

**RF-LOG-EQ-003:** Asignación de equipos para actividades

* Búsqueda de equipos por ODS  
* Identificación visual de equipos en almacén  
* Cambio de estado a TRÁNSITO al entregar a técnico  
* Asociación a técnico responsable  
* Registro de fecha/hora de entrega  
* Lista de verificación de equipos entregados  
* Firma/confirmación de técnico

**RF-LOG-EQ-004:** Gestión de devoluciones de equipos

* Registro de equipos devueltos por técnico  
* Clasificación de devolución:  
  * No usado: regreso a ALMACÉN (asociado a la misma ODS si es instalación, o al stock si es correctivo)  
  * Fallado: creación automática de Nota de Entrega con estado PENDIENTE  
  * Instalado: cambio a INSTALADO (no regresa físicamente)  
* Verificación de condición del equipo  
* Actualización de ubicación en almacén  
* Registro de observaciones

**RF-LOG-EQ-005:** Gestión de Notas de Entrega

* Generación automática o manual de nota de entrega  
* Asociación a ODS de origen  
* Agrupación de múltiples equipos en una nota  
* Estados de nota: PENDIENTE, EN TRÁNSITO, ENTREGADO  
* Información de transporte:  
  * Transportista  
  * Número de guía  
  * Fecha de despacho  
  * Fecha de entrega  
* Coordinación con cliente para recepción  
* Confirmación de recepción por cliente  
* Generación de documento PDF de nota de entrega  
* Firma digital o escaneada del cliente  
* Cambio automático de estado de equipos a ENTREGADO

**RF-LOG-EQ-006:** Inventario y stock

* Vista de inventario completo de equipos  
* Filtros por:  
  * Estado  
  * Cliente propietario  
  * Tecnología  
  * Ubicación en almacén  
  * ODS asociada  
* Stock de equipos de repuesto  
* Alertas de stock mínimo por tecnología  
* Reporte de equipos por estado  
* Reporte de antigüedad de equipos en almacén  
* Equipos pendientes de devolución al cliente  
* Valor del inventario (si aplica)

**RF-LOG-EQ-007:** Equipos temporales en mantenimientos

* Marcación especial de equipos asignados como "temporales"  
* Seguimiento de equipos que deben regresar obligatoriamente  
* Alertas de equipos temporales no devueltos  
* Reporte de utilización de equipos de repuesto

---

### **4.4 Módulo de Logística \- Herramientas**

**RF-LOG-HER-001:** Catálogo de herramientas

* Registro de herramientas de XTEL  
* Código único de herramienta  
* Nombre/descripción  
* Categoría (eléctrica, medición, mano, seguridad, etc.)  
* Estado: ALMACÉN, TRÁSLADO, MANTENIMIENTO, BAJA  
* Condición: OPERATIVA, REQUIERE MANTENIMIENTO, DAÑADA  
* Fotografía de la herramienta  
* Valor de la herramienta  
* Fecha de adquisición  
* Proveedor

**RF-LOG-HER-002:** Solicitud de herramientas

* Creación de solicitud por técnico  
* Asociación a una o varias ODS  
* Lista de herramientas requeridas  
* Cantidad por herramienta (si aplica)  
* Estados de solicitud:  
  * PENDIENTE: Creada por técnico  
  * APROBADA: Revisada por logística  
  * EN PREPARACIÓN: Logística preparando las herramientas  
  * ENTREGADA: Técnico recibió herramientas  
  * DEVUELTA: Técnico devolvió herramientas  
* Fecha requerida  
* Observaciones del técnico

**RF-LOG-HER-003:** Asignación y devolución de herramientas

* Preparación de "kit" de herramientas  
* Verificación de disponibilidad  
* Registro de entrega individual por herramienta  
* Cambio de estado a TRÁSLADO  
* Técnico responsable  
* Fecha/hora de entrega  
* Firma/confirmación de técnico  
* Registro de devolución con verificación de:  
  * Existencia de la herramienta  
  * Condición de la herramienta  
* Alerta automática si herramienta no es devuelta en tiempo esperado  
* Alerta si herramienta está dañada  
* Notificación inmediata al gerente de operaciones  
* Proceso de reemplazo de herramienta

**RF-LOG-HER-004:** Mantenimiento de herramientas

* Registro de mantenimiento preventivo de herramientas  
* Calendario de mantenimientos  
* Herramientas en estado MANTENIMIENTO no disponibles  
* Registro de reparaciones  
* Historial de mantenimientos por herramienta

**RF-LOG-HER-005:** Reporte de herramientas

* Herramientas disponibles en almacén  
* Herramientas en poder de cada técnico  
* Herramientas no devueltas con detalle de ODS  
* Herramientas que requieren mantenimiento  
* Historial de uso por herramienta  
* Técnico que más utiliza cada herramienta  
* Rotación de herramientas

---

### **4.5 Módulo de Logística \- Insumos**

**RF-LOG-INS-001:** Catálogo de insumos

* Registro de insumos consumibles:  
  * Cables (por tipo y calibre)  
  * Tuberías (por tipo y diámetro)  
  * Conectores  
  * Tornillería  
  * Material eléctrico  
  * Otros consumibles  
* Código único de insumo  
* Descripción detallada  
* Unidad de medida (metros, unidades, cajas, etc.)  
* Stock actual  
* Stock mínimo para alertas  
* Stock máximo recomendado  
* Costo unitario  
* Proveedor principal  
* Ubicación en almacén  
* Fotografía del insumo

**RF-LOG-INS-002:** Asignación de insumos a ODS

* Solicitud de insumos por ODS  
* Cantidades estimadas por tipo de insumo  
* Aprobación de logística  
* Asignación registrada en la ODS  
* Descuento automático del stock al asignar  
* Estado: ASIGNADO, ENTREGADO, PARCIALMENTE DEVUELTO, TOTALMENTE DEVUELTO  
* Fecha de asignación  
* Usuario que asignó

**RF-LOG-INS-003:** Recepción de sobrantes

* Registro de cantidades devueltas por tipo de insumo  
* Cálculo automático de cantidad usada:  
  * Cantidad usada \= Cantidad asignada \- Cantidad devuelta  
* Ajuste en la asignación de la ODS  
* Regreso del sobrante al stock  
* Registro de fecha/hora de devolución  
* Observaciones sobre estado del material devuelto

**RF-LOG-INS-004:** Control de inventario

* Reporte de stock actual por insumo  
* Alertas automáticas de stock mínimo  
* Gráfico de tendencia de consumo  
* Historial de consumo por período  
* Consumo por tipo de servicio  
* Consumo por técnico  
* Proyección de necesidades basada en ODS programadas  
* Reporte de insumos más utilizados

**RF-LOG-INS-005:** Gestión de compras de insumos

* Solicitudes de compra basadas en stock mínimo  
* Registro de órdenes de compra  
* Recepción de insumos comprados  
* Actualización automática de stock  
* Costos de compra  
* Proveedor

**RF-LOG-INS-006:** Valorización de consumo

* Cálculo de costo de insumos por ODS  
* Costo de insumos por tipo de servicio  
* Reporte de costos operacionales

---

### **4.6 Módulo de Logística \- Vehículos**

**RF-LOG-VEH-001:** Catálogo de vehículos

* Registro de vehículos de XTEL  
* Placa  
* Marca/modelo  
* Año  
* Tipo (camioneta, camión, automóvil, moto)  
* Estado: DISPONIBLE, EN USO, MANTENIMIENTO, TALLER, BAJA  
* Kilometraje actual  
* Fotografía del vehículo

**RF-LOG-VEH-002:** Asignación de vehículos

* Asignación a técnico para ODS específicas  
* Fecha/hora de salida  
* Kilometraje de salida  
* Fecha/hora de regreso  
* Kilometraje de regreso  
* Cálculo de kilómetros recorridos  
* Consumo de combustible  
* Observaciones del técnico

**RF-LOG-VEH-003:** Mantenimiento de vehículos

* Calendario de mantenimientos preventivos  
* Registro de servicios realizados  
* Costos de mantenimiento  
* Historial de reparaciones  
* Alertas de mantenimiento próximo  
* Vehículo no disponible durante mantenimiento

---

### **4.7 Módulo de Administración \- Finanzas**

**RF-ADM-FIN-001:** Generación de proformas

* Selección de período (fecha inicio \- fecha fin)  
* Filtrado de ODS en estado CULMINADO dentro del período  
* Selección de cliente  
* Agrupación de ODS seleccionadas  
* Número de proforma autogenerado  
* Detalle por ODS:  
  * Número de ODS  
  * Número de orden del cliente  
  * Tipo de servicio  
  * Descripción  
  * Monto  
* Subtotales y totales  
* Impuestos (si aplican)  
* Generación de documento PDF profesional  
* Envío automático por correo al cliente  
* Cambio automático de estado de ODS a PROFORMA  
* Registro de fecha de envío  
* Estado de proforma: BORRADOR, ENVIADA, APROBADA, RECHAZADA

**RF-ADM-FIN-002:** Gestión de aprobación de proformas

* Registro de respuesta del cliente  
* Fecha de aprobación/rechazo  
* Observaciones del cliente  
* Si APROBADA:  
  * Generación automática de factura  
  * Cambio de estado de ODS a FACTURADO  
* Si RECHAZADA:  
  * Motivo de rechazo  
  * Posibilidad de ajustar y re-enviar  
  * ODS regresan a CULMINADO

**RF-ADM-FIN-003:** Gestión de facturas

* Generación de factura basada en proforma aprobada  
* Número de factura (correlativo legal)  
* Datos fiscales de XTEL  
* Datos fiscales del cliente  
* Detalle de servicios facturados  
* Base imponible  
* Impuestos desglosados  
* Total a pagar  
* Fecha de emisión  
* Fecha de vencimiento  
* Condiciones de pago  
* Generación de documento PDF con formato legal  
* Envío por correo al cliente  
* Estados: EMITIDA, PAGADA PARCIAL, PAGADA TOTAL, VENCIDA, ANULADA

**RF-ADM-FIN-004:** Control de pagos

* Registro de pago recibido  
* Número de referencia/transacción  
* Fecha de pago  
* Monto pagado  
* Método de pago (transferencia, cheque, efectivo, etc.)  
* Banco  
* Comprobante de pago (imagen/PDF)  
* Si pago es total:  
  * Cambio automático de estado de factura a PAGADA TOTAL  
  * Cambio de estado de ODS a PAGADO  
* Si pago es parcial:  
  * Registro del monto pendiente  
  * Estado PAGADA PARCIAL  
* Conciliación bancaria

**RF-ADM-FIN-005:** Cuentas por cobrar

* Listado de facturas pendientes de pago  
* Agrupación por cliente  
* Antigüedad de cuentas:  
  * Al día  
  * 1-30 días  
  * 31-60 días  
  * 61-90 días  
  * Más de 90 días  
* Monto total por cobrar  
* Cliente con mayor deuda  
* Alertas de facturas próximas a vencer  
* Alertas de facturas vencidas  
* Gestión de cobranza

**RF-ADM-FIN-006:** Caja chica

* Registro de fondos de caja chica  
* Asignación de fondo inicial  
* Registro de movimientos:  
  * Egresos (con comprobante)  
  * Reintegros  
* Categorización de gastos  
* Responsable de caja chica  
* Conciliación de caja  
* Reporte de estado de caja chica  
* Solicitudes de reembolso

**RF-ADM-FIN-007:** Contabilidad básica

* Registro de ingresos  
* Registro de egresos/gastos  
* Categorización contable  
* Centro de costos  
* Libro diario  
* Libro mayor  
* Balance de comprobación  
* Estado de resultados básico  
* Flujo de caja

**RF-ADM-FIN-008:** Reportes financieros

* Facturación por cliente/período  
* Análisis de cuentas por cobrar  
* Proformas pendientes de aprobación  
* Ingresos vs gastos  
* Rentabilidad por tipo de servicio  
* Rentabilidad por cliente  
* Proyección de ingresos basada en ODS en proceso

---

### **4.8 Módulo de Administración \- RRHH**

**RF-ADM-RH-001:** Gestión de personal

* Registro completo de empleados:  
  * Datos personales (nombre, apellido, cédula, fecha nacimiento)  
  * Datos de contacto (teléfono, email, dirección)  
  * Datos laborales:  
    * Fecha de ingreso  
    * Cargo/rol  
    * Departamento (Operaciones, Logística, Administración)  
    * Tipo de contrato  
    * Salario base  
    * Beneficios  
  * Datos bancarios  
  * Contacto de emergencia  
* Estados: ACTIVO, INACTIVO, VACACIONES, SUSPENDIDO, RETIRADO  
* Fotografía del empleado  
* Documentos adjuntos (CV, certificados, títulos)

**RF-ADM-RH-002:** Gestión de nómina

* Configuración de período de nómina (quincenal, mensual)  
* Conceptos de nómina configurables:  
  * Salario base  
  * Bonos  
  * Guardias  
  * Horas extras  
  * Comisiones  
  * Otros ingresos  
* Deducciones configurables:  
  * SSO (Seguro Social Obligatorio)  
  * PF (Paro Forzoso)  
  * Política Habitacional  
  * Anticipos  
  * Préstamos  
  * Otras deducciones  
* Cálculo automático de nómina  
* Revisión y aprobación de nómina  
* Generación de recibos de pago individuales  
* Generación de archivo para carga bancaria (formato TXT según banco)  
* Registro de pago efectivo de nómina  
* Historial de nóminas

**RF-ADM-RH-003:** Gestión de guardias y horas extras

* Registro de guardias asignadas a técnicos  
* Calendario de guardias  
* Tarifa por guardia  
* Registro de horas extras  
* Cálculo automático de pago  
* Integración con nómina

**RF-ADM-RH-004:** Gestión de asistencia

* Registro de asistencias diarias  
* Control de entrada/salida  
* Ausencias justificadas  
* Ausencias injustificadas  
* Permisos  
* Vacaciones  
* Incapacidades  
* Reporte de asistencia por empleado/período

**RF-ADM-RH-005:** Gestión de vacaciones

* Cálculo de días de vacaciones acumulados  
* Solicitud de vacaciones  
* Aprobación/rechazo de vacaciones  
* Calendario de vacaciones  
* Alertas de vacaciones pendientes de disfrute

**RF-ADM-RH-006:** Evaluación de desempeño

* Registro de evaluaciones periódicas  
* Indicadores de desempeño por cargo  
* Calificaciones  
* Observaciones  
* Planes de mejora  
* Historial de evaluaciones

**RF-ADM-RH-007:** Reportes de RRHH

* Nómina por período  
* Deducciones por concepto  
* Resumen de guardias y horas extras  
* Ausencias por empleado  
* Vacaciones programadas  
* Costo total de personal  
* Rotación de personal  
* Cumpleaños del mes

---

### **4.9 Módulo de Reportes y Analytics**

**RF-REP-001:** Dashboard ejecutivo

* Indicadores clave (KPIs):  
  * Total de ODS activas  
  * ODS por estado (gráfico de torta/barras)  
  * ODS completadas en el mes  
  * ODS atrasadas  
  * Facturación del mes  
  * Cuentas por cobrar  
  * Productividad por técnico  
* Gráficos:  
  * Tendencia de ODS creadas vs completadas  
  * Distribución de servicios por tipo  
  * Clientes con más actividades  
* Estado de inventarios:  
  * Equipos en almacén / tránsito / instalados  
  * Herramientas disponibles / en uso  
  * Insumos con stock crítico  
* Alertas destacadas:  
  * ODS bloqueadas  
  * Equipos pendientes de devolución  
* Facturas vencidas  
* Stock crítico de insumos

**RF-REP-002:** Reportes operacionales

* ODS por período:  
  * Filtros: fecha, cliente, técnico, tipo, estado  
  * Exportación Excel/PDF  
* ODS atrasadas:  
  * Días de atraso  
  * Motivo del atraso  
  * Responsable  
* ODS bloqueadas por falta de recursos:  
  * Recurso faltante (equipo, herramienta, insumo)  
  * Tiempo bloqueado  
  * Impacto en cronograma  
* Tiempo promedio por tipo de servicio:  
  * Desde creación hasta culminación  
  * Por cliente  
  * Tendencia histórica  
* Tiempo promedio en cada estado:  
  * Identificación de cuellos de botella  
  * Comparación entre tipos de servicio  
* Productividad por técnico:  
  * ODS completadas en período  
  * Tipos de servicio atendidos  
  * Calificación promedio (si aplica)  
  * Tiempo promedio de ejecución  
* Coordinaciones rechazadas:  
  * Por cliente  
  * Motivos de rechazo  
  * Impacto en productividad

**RF-REP-003:** Reportes de logística

* Inventario de equipos:  
  * Por estado  
  * Por tecnología  
  * Por cliente propietario  
  * Antigüedad en almacén  
* Equipos pendientes de devolución:  
  * Agrupados por cliente  
  * Tiempo en espera  
  * Valor del inventario pendiente  
* Movimientos de equipos:  
  * Entradas (recepciones)  
  * Salidas (instalaciones)  
  * Devoluciones  
  * Por período  
* Herramientas:  
  * Disponibilidad actual  
  * En poder de técnicos  
  * No devueltas (con alertas)  
  * Requieren mantenimiento  
  * Histórico de uso  
  * Rotación  
* Insumos:  
  * Stock actual vs mínimo  
  * Consumo por período  
  * Consumo por tipo de servicio  
  * Proyección de necesidades  
  * Valor del inventario  
* Vehículos:  
  * Disponibilidad  
  * Kilometraje recorrido por período  
  * Consumo de combustible  
  * Costos de mantenimiento  
  * Eficiencia por vehículo

**RF-REP-004:** Reportes financieros

* Facturación:  
  * Por cliente  
  * Por tipo de servicio  
  * Por período  
  * Comparativa entre períodos  
* Cuentas por cobrar:  
  * Detalle por cliente  
  * Antigüedad  
  * Tendencia de cobros  
  * Índice de morosidad  
* Proformas:  
  * Pendientes de aprobación  
  * Tasa de aprobación  
  * Tiempo promedio de aprobación  
* Análisis de rentabilidad:  
  * Por tipo de servicio (ingresos vs costos)  
  * Por cliente  
  * Márgenes de ganancia  
* Flujo de caja:  
  * Ingresos proyectados (ODS en proceso)  
  * Egresos proyectados  
  * Disponibilidad  
* Gastos operacionales:  
  * Por categoría  
  * Tendencia  
  * Comparación con presupuesto

**RF-REP-005:** Reportes de calidad y cumplimiento

* Cumplimiento de tiempos comprometidos:  
  * Por tipo de servicio  
  * Por cliente  
  * Por técnico  
* Incidencias reportadas:  
  * Equipos fallidos  
  * Herramientas perdidas/dañadas  
  * Re-trabajos  
* Satisfacción del cliente (si se implementa):  
  * Por técnico  
  * Por tipo de servicio  
  * Tendencia

**RF-REP-006:** Reportes personalizables

* Constructor de reportes con:  
  * Selección de campos  
  * Filtros dinámicos  
  * Agrupaciones  
  * Ordenamiento  
  * Formatos de exportación  
* Guardado de configuraciones de reportes frecuentes  
* Programación de envío automático de reportes

  ---

  ### **4.10 Módulo de Seguridad y Usuarios**

**RF-SEG-001:** Gestión de usuarios

* Registro de usuarios del sistema  
* Vinculación con empleado (si aplica)  
* Credenciales de acceso:  
  * Nombre de usuario único  
  * Contraseña segura (con política de complejidad)  
  * Email  
* Asignación de roles  
* Estado: ACTIVO, INACTIVO, BLOQUEADO  
* Fecha de último acceso  
* Foto de perfil

**RF-SEG-002:** Gestión de roles y permisos

* Roles predefinidos:  
  * **Administrador del Sistema**: Acceso total  
  * **Gerente General**: Visibilidad completa, permisos de aprobación  
  * **Gerente de Operaciones**: Módulos de ODS, Coordinación, Técnicos  
  * **Coordinador**: Creación/modificación de ODS, asignación de técnicos, cronograma  
  * **Asistente de Operaciones**: Creación de ODS, carga de documentos, coordinación con clientes  
  * **Técnico**: Vista de ODS asignadas, carga de informes y fotos, solicitud de recursos  
  * **Gerente de Logística**: Módulo completo de logística  
  * **Almacenista**: Recepción/entrega de equipos, herramientas, insumos  
  * **Gerente de Administración**: Módulo financiero y RRHH completo  
  * **Contador**: Módulo financiero (lectura y creación)  
  * **Analista de RRHH**: Módulo de RRHH  
  * **Consulta/Auditor**: Solo lectura en todos los módulos  
* Permisos granulares por funcionalidad:  
  * Crear  
  * Leer  
  * Actualizar  
  * Eliminar  
  * Aprobar  
  * Exportar  
* Matriz de permisos configurable  
* Asignación de permisos especiales puntuales

**RF-SEG-003:** Autenticación y sesión

* Login con usuario y contraseña  
* Política de contraseñas:  
  * Longitud mínima  
  * Complejidad (mayúsculas, minúsculas, números, caracteres especiales)  
  * Expiración periódica  
  * No reutilización de contraseñas anteriores  
* Recuperación de contraseña mediante email  
* Bloqueo de cuenta tras intentos fallidos  
* Sesión con timeout por inactividad  
* Opción de "recordar sesión" (configurable)  
* Cierre de sesión manual  
* Cierre forzado de sesiones remotas (por administrador)

**RF-SEG-004:** Auditoría

* Log completo de operaciones críticas:  
  * Login/logout  
  * Cambios de estado en ODS  
  * Asignación/desasignación de recursos  
  * Creación/modificación/eliminación de registros importantes  
  * Aprobaciones y rechazos  
  * Transacciones financieras  
  * Cambios en permisos  
* Información registrada:  
  * Usuario  
  * Fecha/hora  
  * Acción realizada  
  * Registro afectado  
  * Valores anteriores y nuevos (en modificaciones)  
  * IP de origen  
* Consulta de logs:  
  * Por usuario  
  * Por acción  
  * Por fecha  
  * Por módulo  
  * Por registro afectado  
* Exportación de logs  
* Retención de logs según normativa (mínimo 7 años)  
* Logs inmutables (no pueden ser modificados o eliminados)

**RF-SEG-005:** Protección de datos

* Cifrado de datos sensibles en base de datos:  
  * Contraseñas (hash seguro)  
  * Datos personales  
  * Información financiera  
* Cifrado de comunicaciones (HTTPS/TLS)  
* Respaldo de contraseñas solo mediante hash irreversible  
* Anonimización de datos para reportes cuando sea necesario  
* Cumplimiento con normativas de protección de datos personales

  ---

  ### **4.11 Módulo de Notificaciones y Comunicaciones**

**RF-NOT-001:** Sistema de notificaciones internas

* Notificaciones en tiempo real dentro del sistema  
* Centro de notificaciones con:  
  * Notificaciones no leídas (contador)  
  * Historial de notificaciones  
  * Filtros por tipo  
* Tipos de notificaciones:  
  * ODS asignada a técnico  
  * ODS con cambio de estado relevante  
  * Pendiente asignado a usuario/departamento  
  * Solicitud de recursos aprobada/rechazada  
  * Alerta de ODS bloqueada  
  * Alerta de ODS atrasada  
  * Equipo/herramienta no devuelta  
  * Stock crítico de insumo  
  * Proforma/factura aprobada/rechazada  
  * Pago registrado  
  * Mantenimiento de vehículo/herramienta próximo  
* Configuración de preferencias de notificación por usuario

**RF-NOT-002:** Notificaciones por correo electrónico

* Envío automático de emails en eventos clave:  
  * Coordinación con cliente (recordatorio)  
  * Envío de proforma al cliente  
  * Envío de factura al cliente  
  * Envío de informes al cliente  
  * Alertas críticas a gerentes  
* Plantillas de correo configurables  
* Registro de emails enviados  
* Estado de entrega

**RF-NOT-003:** Notificaciones push (para móviles)

* Notificaciones push a dispositivos móviles  
* Configuración de tipos de notificaciones push por usuario  
* Prioridad de notificaciones (alta, media, baja)

**RF-NOT-004:** Comunicaciones con clientes

* Registro de todas las comunicaciones con cliente:  
  * Llamadas telefónicas (fecha, hora, persona contactada, resumen)  
  * Correos electrónicos (automáticamente desde el sistema)  
  * Mensajes de texto (si se implementa)  
  * Reuniones  
* Historial de comunicaciones por ODS  
* Historial de comunicaciones por cliente  
* Plantillas de comunicación reutilizables

**RF-NOT-005:** Recordatorios y tareas

* Sistema de recordatorios para usuarios:  
  * Coordinación pendiente  
  * Seguimiento a cliente  
  * Entrega de equipos  
  * Vencimiento de documentos  
* Creación de tareas personales o asignadas  
* Estados de tarea: PENDIENTE, EN PROCESO, COMPLETADA, CANCELADA  
* Fecha de vencimiento  
* Prioridad  
* Notificaciones de tareas próximas a vencer

  ---

  ### **4.12 Módulo de Configuración del Sistema**

**RF-CONF-001:** Configuración general

* Datos de la empresa:  
  * Nombre comercial  
  * RIF/identificación fiscal  
  * Dirección  
  * Teléfonos  
  * Email  
  * Logo  
* Parámetros del sistema:  
  * Formato de fechas  
  * Formato de números  
  * Moneda  
  * Idioma  
  * Zona horaria  
  * Tamaño máximo de archivos  
* Configuración de correo:  
  * Servidor SMTP  
  * Puerto  
  * Autenticación  
  * Email remitente predeterminado

**RF-CONF-002:** Configuración de workflows

* Configuración de estados por tipo de servicio  
* Validaciones de transición configurables  
* Acciones automáticas por cambio de estado  
* Tiempos SLA por tipo de servicio  
* Alertas automáticas por incumplimiento

**RF-CONF-003:** Configuración de plantillas

* Plantillas de documentos PDF:  
  * Informe de servicio  
  * Informe de inspección  
  * Informe post-instalación  
  * Nota de entrega  
  * Proforma  
  * Factura  
  * Recibo de pago de nómina  
* Editor de plantillas con variables dinámicas  
* Vista previa de plantillas

**RF-CONF-004:** Configuración de catálogos

* Tecnologías disponibles (marca/modelo por categoría)  
* Tipos de equipos  
* Categorías de herramientas  
* Unidades de medida de insumos  
* Categorías de gastos  
* Tipos de vehículos  
* Bancos  
* Métodos de pago

**RF-CONF-005:** Numeración de documentos

* Configuración de formatos de numeración:  
  * ODS (ejemplo: ODS-2024-00001)  
  * Proformas (ejemplo: PRF-2024-00001)  
  * Facturas (ejemplo: FACT-00001234)  
  * Notas de entrega (ejemplo: NE-2024-00001)  
* Prefijos personalizables  
* Reinicio de secuencia (anual, nunca)  
* Longitud del número correlativo

**RF-CONF-006:** Backup y restauración

* Configuración de backups automáticos:  
  * Frecuencia (diaria, semanal)  
  * Hora de ejecución  
  * Retención de backups  
* Ejecución manual de backup  
* Restauración desde backup  
* Notificación de éxito/fallo de backup

  ---

  ## **5\. REQUERIMIENTOS NO FUNCIONALES**

  ### **5.1 Rendimiento**

**RNF-PERF-001:** Tiempo de respuesta

* Las operaciones de consulta simple (listados con filtros básicos) deben responder en menos de 2 segundos para hasta 10,000 registros  
* Las operaciones de escritura (crear, actualizar) deben completarse en menos de 3 segundos  
* La carga inicial del dashboard debe completarse en menos de 5 segundos

**RNF-PERF-002:** Concurrencia

* El sistema debe soportar al menos 50 usuarios concurrentes sin degradación significativa del rendimiento  
* El sistema debe manejar al menos 10 transacciones simultáneas de actualización de ODS

**RNF-PERF-003:** Carga de archivos

* La carga de informes con imágenes (hasta 10 imágenes de 5MB cada una) debe completarse en menos de 30 segundos con conexión de banda ancha  
* El sistema debe soportar carga de archivos de hasta 50MB por archivo  
* La carga debe incluir barra de progreso

**RNF-PERF-004:** Generación de reportes

* Los reportes simples (menos de 1,000 registros) deben generarse en menos de 5 segundos  
* Los reportes complejos (más de 1,000 registros con agrupaciones) deben generarse en menos de 15 segundos  
* La exportación a Excel/PDF no debe bloquear otras operaciones del usuario

**RNF-PERF-005:** Búsquedas

* Las búsquedas de texto deben retornar resultados en menos de 1 segundo  
* Las búsquedas avanzadas con múltiples filtros deben responder en menos de 3 segundos

  ### **5.2 Disponibilidad**

**RNF-DISP-001:** Uptime

* El sistema debe estar disponible 99% del tiempo durante horario laboral (7AM \- 7PM, Lunes a Viernes)  
* Ventanas de mantenimiento programado deben notificarse con al menos 48 horas de anticipación

**RNF-DISP-002:** Respaldos

* El sistema debe realizar respaldos automáticos diarios de la base de datos  
* Los respaldos deben almacenarse en ubicación separada del servidor principal  
* Debe mantenerse al menos 30 días de respaldos diarios  
* Respaldos semanales deben mantenerse por 6 meses  
* Respaldos mensuales deben mantenerse por 7 años (cumplimiento fiscal)

**RNF-DISP-003:** Recuperación ante desastres

* El tiempo de recuperación ante fallas (RTO \- Recovery Time Objective) no debe exceder 4 horas  
* El punto de recuperación (RPO \- Recovery Point Objective) no debe superar 24 horas de datos perdidos  
* Debe existir un plan documentado de recuperación ante desastres

**RNF-DISP-004:** Monitoreo

* El sistema debe contar con monitoreo de servicios 24/7  
* Alertas automáticas ante caídas de servicios  
* Log de errores y excepciones centralizado

  ### **5.3 Seguridad**

**RNF-SEG-001:** Cifrado

* Toda comunicación entre cliente y servidor debe estar cifrada mediante HTTPS/TLS 1.2 o superior  
* Las contraseñas deben almacenarse con hash seguro (bcrypt, argon2 o similar) con salt único por usuario  
* Los datos sensibles en la base de datos deben estar cifrados

**RNF-SEG-002:** Autenticación

* El sistema debe implementar autenticación robusta con bloqueo de cuenta tras 5 intentos fallidos  
* Las sesiones deben expirar tras 30 minutos de inactividad  
* Las contraseñas deben cumplir política de complejidad (mínimo 8 caracteres, mayúsculas, minúsculas, números)

**RNF-SEG-003:** Autorización

* El sistema debe implementar control de acceso basado en roles (RBAC)  
* Las validaciones de permisos deben realizarse tanto en frontend como en backend  
* Ninguna operación crítica debe poder ejecutarse sin validación de permisos

**RNF-SEG-004:** Protección contra ataques

* El sistema debe implementar protección contra SQL Injection  
* El sistema debe implementar protección contra Cross-Site Scripting (XSS)  
* El sistema debe implementar protección contra Cross-Site Request Forgery (CSRF)  
* Los archivos cargados deben ser validados por tipo, tamaño y contenido  
* Debe implementarse rate limiting para prevenir ataques de fuerza bruta

**RNF-SEG-005:** Auditoría

* Todas las operaciones críticas deben quedar registradas en logs inmutables  
* Los logs deben incluir: usuario, fecha/hora, acción, IP, datos antes/después  
* Los logs de auditoría deben conservarse por mínimo 7 años

**RNF-SEG-006:** Privacidad de datos

* El sistema debe cumplir con normativas locales de protección de datos personales  
* Los datos personales solo deben ser accesibles por usuarios autorizados  
* Debe existir funcionalidad para anonimizar datos para reportes públicos

  ### **5.4 Usabilidad**

**RNF-USA-001:** Interfaz responsiva

* La interfaz debe ser totalmente responsive y funcionar correctamente en:  
  * Escritorio (resoluciones desde 1366x768)  
  * Tablets (iPad, Android tablets)  
  * Smartphones (para técnicos en campo, funcionalidad limitada)

**RNF-USA-002:** Experiencia móvil para técnicos

* Los técnicos deben poder realizar desde móvil:  
  * Ver ODS asignadas  
  * Cargar informes de servicio  
  * Tomar y subir fotografías  
  * Solicitar herramientas e insumos  
  * Ver detalles de la actividad  
* La interfaz móvil debe funcionar con conexiones lentas (3G)

**RNF-USA-003:** Notificaciones en tiempo real

* El sistema debe proporcionar notificaciones en tiempo real sin necesidad de refrescar la página  
* Las notificaciones deben ser no intrusivas pero visibles

**RNF-USA-004:** Facilidad de uso

* Las operaciones más frecuentes deben requerir máximo 3 clics  
* El sistema debe incluir ayuda contextual en formularios complejos  
* Los mensajes de error deben ser claros y orientar al usuario sobre cómo corregir

**RNF-USA-005:** Idioma

* El sistema debe estar completamente en español  
* Los términos técnicos deben corresponder al lenguaje de la industria en Venezuela/Latinoamérica

**RNF-USA-006:** Accesibilidad

* El sistema debe cumplir con estándares básicos de accesibilidad (WCAG 2.0 nivel A mínimo)  
* Contraste de colores adecuado para legibilidad  
* Navegación por teclado funcional

**RNF-USA-007:** Capacitación

* La interfaz debe ser intuitiva para minimizar necesidad de capacitación  
* Debe existir manual de usuario en español  
* Videos tutoriales de operaciones principales

  ### **5.5 Escalabilidad**

**RNF-ESC-001:** Crecimiento horizontal

* La arquitectura debe permitir distribución de carga mediante balanceadores  
* Los componentes deben poder escalar independientemente

**RNF-ESC-002:** Volumen de datos

* El diseño de base de datos debe soportar crecimiento de datos de al menos 5 años sin re-arquitectura  
* Estimación:  
  * 500-1000 ODS nuevas por mes  
  * 100-200 equipos nuevos por mes  
  * 50-100 GB de archivos por año

**RNF-ESC-003:** Usuarios concurrentes

* La arquitectura debe permitir escalar de 50 a 200 usuarios concurrentes sin cambios mayores

**RNF-ESC-004:** Flexibilidad del workflow

* El sistema debe permitir agregar nuevos tipos de servicios sin modificación de código core  
* Los estados de workflow deben ser configurables  
* Las validaciones de transición deben ser configurables

  ### **5.6 Mantenibilidad**

**RNF-MAN-001:** Documentación

* El código debe estar documentado siguiendo estándares de la industria  
* Debe existir documentación técnica de:  
  * Arquitectura del sistema  
  * Modelo de datos  
  * APIs  
  * Procedimientos de despliegue  
  * Guía de troubleshooting

**RNF-MAN-002:** Modularidad

* El sistema debe utilizar arquitectura modular (por ejemplo, microservicios o módulos bien separados)  
* Los módulos deben tener bajo acoplamiento y alta cohesión  
* Las interfaces entre módulos deben estar bien definidas

**RNF-MAN-003:** Configurabilidad

* Los workflows deben ser configurables sin modificación de código  
* Los catálogos deben ser configurables por administradores  
* Las plantillas de documentos deben ser editables sin código

**RNF-MAN-004:** Control de versiones

* Todo el código debe estar en sistema de control de versiones (Git)  
* Debe seguirse estrategia de branching clara (por ejemplo, GitFlow)  
* Los cambios deben estar documentados en commits descriptivos

**RNF-MAN-005:** Pruebas

* El sistema debe contar con suite de pruebas automatizadas:  
  * Pruebas unitarias (cobertura mínima 70%)  
  * Pruebas de integración  
  * Pruebas end-to-end de flujos críticos  
* Las pruebas deben ejecutarse automáticamente en pipeline de CI/CD

**RNF-MAN-006:** Logs y debugging

* El sistema debe generar logs estructurados y consultables  
* Niveles de log: ERROR, WARNING, INFO, DEBUG  
* Los logs no deben contener información sensible

  ### **5.7 Interoperabilidad**

**RNF-INT-001:** Exportación de datos

* El sistema debe permitir exportación de datos en formatos estándar:  
  * Excel (.xlsx) para datos tabulares  
  * PDF para documentos e informes  
  * CSV para datos raw  
* La exportación debe mantener formato y ser legible

**RNF-INT-002:** API para integración futura

* Debe existir API RESTful documentada (OpenAPI/Swagger)  
* La API debe permitir integración con sistemas de clientes  
* Autenticación mediante tokens (JWT u OAuth2)  
* Rate limiting para proteger el sistema

**RNF-INT-003:** Importación de órdenes

* El sistema debe poder importar órdenes de clientes en formatos comunes:  
  * Excel  
  * CSV  
  * XML/JSON (si cliente tiene sistema)  
* Validación de datos importados antes de persistir

**RNF-INT-004:** Integración con email

* Capacidad de enviar emails transaccionales  
* Capacidad de recibir emails y asociarlos a ODS (deseable)

  ### **5.8 Portabilidad**

**RNF-PORT-001:** Independencia de plataforma

* El sistema debe poder ejecutarse en:  
  * Windows Server  
  * Linux (Ubuntu, CentOS)  
* Preferencia por tecnologías multiplataforma

**RNF-PORT-002:** Base de datos

* Preferencia por bases de datos empresariales con soporte robusto  
* Considerar PostgreSQL, MySQL, SQL Server según licenciamiento

**RNF-PORT-003:** Despliegue

* El sistema debe poder desplegarse on-premise o en cloud  
* Containerización (Docker) deseable para facilitar despliegue  
* Documentación clara de requerimientos de infraestructura

  ### **5.9 Cumplimiento Legal**

**RNF-LEG-001:** Protección de datos personales

* Cumplimiento con normativas locales (Venezuela) de protección de datos  
* Consentimiento para uso de datos personales  
* Derecho de acceso, rectificación y eliminación de datos

**RNF-LEG-002:** Documentos fiscales

* Las facturas deben cumplir con requisitos fiscales de Venezuela:  
  * Numeración correlativa  
  * Datos fiscales completos  
  * Formato legal  
* Inmutabilidad de facturas emitidas

**RNF-LEG-003:** Retención de datos

* Los documentos fiscales deben conservarse por mínimo 7 años  
* Los registros de nómina deben conservarse según normativa laboral  
* Backups deben mantener integridad para auditorías

**RNF-LEG-004:** Firma electrónica

* Soporte para firma digital en documentos (deseable)  
* Captura de firma manuscrita digitalizada en informes de servicio

  ### **5.10 Soporte y Mantenimiento**

**RNF-SOP-001:** Soporte técnico

* Debe existir documentación de soporte para usuarios finales  
* Mesa de ayuda o punto de contacto para incidencias  
* SLA de respuesta a incidencias:  
  * Críticas: 2 horas  
  * Altas: 4 horas  
  * Medias: 1 día laboral  
  * Bajas: 3 días laborales

**RNF-SOP-002:** Actualizaciones

* El sistema debe permitir actualizaciones sin pérdida de datos  
* Las actualizaciones deben poder realizarse con mínima interrupción del servicio  
* Plan de rollback en caso de fallo en actualización

**RNF-SOP-003:** Capacitación

* Capacitación inicial a usuarios en cada rol  
* Material de capacitación: manual, videos, sesiones presenciales/remotas  
* Capacitación de refresher cuando haya cambios mayores

  ---

  ## **6\. CASOS DE USO CRÍTICOS DETALLADOS**

  ### **6.1 CU-001: Flujo Completo de Instalación**

**Actor Principal:** Varios (Asistente Operaciones, Coordinador, Logística, Técnico, Administración)

**Precondiciones:**

* Cliente ha solicitado instalación  
* Usuario tiene permisos adecuados

**Flujo Principal:**

1. **Cliente notifica instalación**  
   * Por teléfono, email o sistema del cliente  
   * Proporciona: número de orden, localidad, contacto, tecnología  
2. **Asistente crea ODS** (RF-ODS-001)  
   * Ingresa todos los datos recibidos  
   * Sistema genera número ODS automático  
   * Sistema crea pendientes automáticos: equipos, configuración, insumos  
   * Estado inicial: PENDIENTE POR ASIGNACIONES  
3. **Operaciones carga configuración** (RF-ODS-003)  
   * Recibe archivo de configuración del cliente  
   * Lo carga en la ODS  
   * Sistema elimina pendiente de configuración  
4. **Logística revisa requerimientos** (RF-LOG-INS-002)  
   * Revisa herramientas e insumos necesarios  
   * Si están disponibles, elimina pendiente de insumos  
   * Si faltan, genera orden de compra  
5. **Logística recibe equipos** (RF-LOG-EQ-001)  
   * Cliente envía equipos  
   * Logística registra cada equipo individualmente  
   * Asocia equipos a la ODS  
   * Equipos pasan a estado ALMACÉN  
   * Sistema elimina pendiente de equipos  
   * ODS cambia a: PENDIENTE POR EQUIPOS → POR COORDINAR  
6. **Coordinador agenda actividad** (RF-ODS-007)  
   * Revisa cronograma  
   * Selecciona fecha tentativa  
   * Sistema valida que no haya conflictos  
7. **Asistente coordina con cliente** (RF-ODS-005)  
   * Sistema genera notificación 48-72 horas antes  
   * Asistente contacta al cliente  
   * Explica alcance, horario, permisos necesarios  
   * Cliente aprueba o rechaza

8a. **Si cliente APRUEBA:**

* ODS cambia a: COORDINADO  
* Continúa en paso 9

8b. **Si cliente RECHAZA:**

* ODS cambia a: COORDINACIÓN RECHAZADA  
* Asistente registra motivo  
* Coordinador reagenda  
* Regresa a paso 7  
9. **Coordinador asigna técnicos** (RF-ODS-004)  
   * Selecciona técnico(s) según complejidad  
   * Asigna rol (principal/asistente)  
   * ODS cambia a: POR REALIZAR  
   * Sistema notifica a técnicos  
10. **Técnico solicita herramientas** (RF-LOG-HER-002)  
    * Técnico revisa ODS asignada  
    * Crea solicitud de herramientas  
    * Asocia solicitud a ODS  
11. **Logística prepara recursos** (RF-LOG-HER-003, RF-LOG-EQ-003, RF-LOG-INS-002)  
    * Aprueba solicitud de herramientas  
    * Prepara kit de herramientas  
    * Prepara equipos de la ODS  
    * Prepara insumos según lista  
    * Registra entrega a técnico  
    * Equipos cambian a: TRÁNSITO  
    * Herramientas cambian a: TRÁSLADO  
12. **Técnico se dirige a campo**  
    * Recibe recursos de logística  
    * ODS cambia a: REALIZANDO  
    * Sistema registra timestamp  
13. **Técnico ejecuta instalación**  
    * Instala equipos  
    * Configura según especificaciones  
    * Realiza pruebas  
    * Cliente firma informe de servicio  
14. **Técnico completa informe de servicio** (RF-ODS-006)  
    * Registra hora inicio y fin  
    * Descripción del trabajo  
    * Observaciones  
    * Captura firma del cliente  
    * Entrega informe escaneado a asistente  
15. **Asistente carga informe de servicio**  
    * Escanea documento físico o recibe digital  
    * Lo carga en la ODS  
    * ODS cambia a: POR INFORME  
16. **Técnico devuelve recursos a logística** (RF-LOG-HER-003, RF-LOG-EQ-004, RF-LOG-INS-003)  
    * Devuelve herramientas  
    * Logística verifica estado y existencia  
    * Herramientas cambian a: ALMACÉN  
    * Solicitud cambia a: DEVUELTA  
    * Devuelve insumos sobrantes  
    * Logística calcula consumo real  
    * Ajusta asignación en ODS  
    * Equipos instalados cambian a: INSTALADO (no regresan físicamente)  
17. **Técnico crea informe post-instalación** (RF-ODS-006)  
    * Carga fotografías (antes/durante/después)  
    * Detalla configuración implementada  
    * Niveles de señal obtenidos  
    * Observaciones técnicas  
    * Carga croquis de instalación  
    * Sistema envía informe automáticamente al cliente  
    * ODS cambia a: CULMINADO  
18. **Administración genera proforma** (RF-ADM-FIN-001)  
    * Al final del período (quincenal/mensual)  
    * Selecciona todas las ODS CULMINADAS del cliente  
    * Genera documento de proforma  
    * Envía por correo al cliente  
    * ODS cambian a: PROFORMA  
19. **Cliente aprueba proforma** (RF-ADM-FIN-002)  
    * Administración registra aprobación  
    * Sistema genera factura automáticamente  
    * ODS cambian a: FACTURADO  
20. **Cliente paga factura** (RF-ADM-FIN-004)  
    * Administración registra pago recibido  
    * Adjunta comprobante  
    * ODS cambian a: PAGADO  
    * **FIN DEL FLUJO**

**Flujos Alternativos:**

* **FA-1: Equipos no llegan a tiempo**  
  * En paso 5, si equipos no llegan, ODS permanece en PENDIENTE POR EQUIPOS  
  * Sistema genera alerta al coordinador  
  * Coordinador contacta al cliente para seguimiento  
* **FA-2: Falta configuración**  
  * En paso 3, si configuración no llega, ODS permanece bloqueada  
  * Sistema notifica a operaciones  
  * Coordinador contacta al cliente  
* **FA-3: Equipo falla durante instalación**  
  * En paso 13, si equipo está defectuoso  
  * Técnico reporta falla  
  * Equipo cambia a: PENDIENTE NOTA ENTREGA  
  * Logística genera nota de entrega  
  * Se solicita equipo de reemplazo al cliente  
  * Puede requerir re-agendamiento  
* **FA-4: Cliente rechaza proforma**  
  * En paso 19, si cliente rechaza  
  * Administración registra motivo  
  * ODS regresan a CULMINADO  
  * Se ajusta proforma y re-envía

**Postcondiciones:**

* ODS completada en estado PAGADO  
* Equipos registrados como INSTALADO en la localidad  
* Informe técnico disponible para futuras referencias  
* Factura pagada y registrada  
* Historial completo de la actividad documentado

---

### **6.2 CU-002: Mantenimiento Correctivo de Emergencia**

**Actor Principal:** Coordinador, Logística, Técnico

**Precondiciones:**

* Cliente reporta servicio caído o degradado  
* Técnico disponible  
* Equipos de repuesto en stock (si se requieren)

**Flujo Principal:**

1. **Cliente reporta falla**  
   * Llamada telefónica urgente  
   * Proporciona: número de orden, localidad, descripción de falla  
2. **Asistente crea ODS de emergencia**  
   * Tipo: Mantenimiento Correctivo  
   * Prioridad: ALTA  
   * Estado inicial: NUEVO  
3. **Coordinador analiza y asigna**  
   * Revisa diagnóstico inicial  
   * Identifica técnico disponible más cercano  
   * Asigna técnico inmediatamente  
   * ODS cambia a: PENDIENTE ASIGNACIÓN  
4. **Técnico solicita recursos**  
   * Basado en diagnóstico, solicita:  
     * Herramientas específicas  
     * Equipos de repuesto (si aplica)  
5. **Logística asigna recursos de emergencia**  
   * Equipos de repuesto marcados como "temporales"  
   * Cambio de estado a: TRÁNSITO (temporal)  
   * Entrega inmediata a técnico  
6. **Técnico se dirige a campo**  
   * ODS cambia a: REALIZANDO  
   * Técnico diagnostica en sitio  
7. **Técnico resuelve falla**  
   * Reemplaza equipo fallido (si aplica)  
   * Restaura servicio  
   * Cliente firma informe de servicio  
8. **Técnico devuelve recursos**  
   * Devuelve herramientas  
   * Devuelve equipo fallido  
   * Equipo fallido cambia a: PENDIENTE NOTA ENTREGA  
   * Si usó equipo temporal, este queda instalado (INSTALADO)  
   * Si no usó equipo temporal, regresa a stock  
   * ODS cambia a: POR NOTA DE ENTREGA  
9. **Logística genera nota de entrega**  
   * Agrupa equipos fallidos  
   * Asocia a ODS  
   * Estado: PENDIENTE  
10. **Logística coordina devolución al cliente**  
    * Prepara equipos para transporte  
    * Coordina con transportista  
    * Envía al cliente  
    * ODS cambia a: EQUIPOS POR ENTREGAR  
11. **Cliente recibe equipos**  
    * Confirma recepción  
    * Nota de entrega cambia a: ENTREGADO  
    * ODS cambia a: CULMINADO  
12. **Proceso de facturación** (igual que CU-001, pasos 18-20)

**Postcondiciones:**

* Servicio restaurado  
* Equipos fallidos devueltos al cliente  
* Actividad facturada y pagada

---

### **6.3 CU-003: Gestión de Herramienta No Devuelta**

**Actor Principal:** Logística, Gerente de Operaciones

**Precondiciones:**

* Técnico ha completado ODS  
* Herramienta no fue devuelta en el plazo esperado

**Flujo Principal:**

1. **Sistema detecta herramienta no devuelta**  
   * Solicitud de herramienta en estado ENTREGADA por más de 24 horas después de ODS CULMINADA  
   * Sistema genera alerta automática  
2. **Logística contacta a técnico**  
   * Solicita devolución de herramienta  
   * Técnico responde con una de las siguientes opciones:

3a. **Herramienta olvidada en vehículo/casa:**

* Técnico devuelve herramienta  
* Logística verifica estado  
* Solicitud cambia a: DEVUELTA  
* Herramienta cambia a: ALMACÉN  
* Se registra incidencia menor

3b. **Herramienta perdida:**

* Técnico reporta pérdida  
* Logística notifica inmediatamente a Gerente de Operaciones  
* Se inicia proceso de reemplazo  
* Se registra incidencia grave  
* Puede haber descuento en nómina del técnico (según política)

3c. **Herramienta dañada:**

* Técnico devuelve herramienta dañada  
* Logística verifica daño  
* Herramienta cambia a: REQUIERE MANTENIMIENTO o BAJA  
* Se notifica a Gerente de Operaciones  
* Se evalúa si daño fue por uso normal o negligencia  
* Se inicia proceso de reparación o reemplazo

**Postcondiciones:**

* Herramienta devuelta o reemplazada  
* Incidencia documentada  
* Acciones correctivas tomadas

---

## **7. MODELO DE DATOS CONCEPTUAL**

### **7.1 Entidades Principales**

#### **Cliente (Carrier)**
* ID_Cliente (PK)  
* Nombre_Comercial  
* Razon_Social  
* RIF  
* Direccion  
* Telefono  
* Email  
* Estado (Activo/Inactivo)  
* Fecha_Registro

#### **Cliente_Final**
* ID_Cliente_Final (PK)  
* Nombre  
* Sector_Industria  
* Observaciones

#### **Localidad**
* ID_Localidad (PK)  
* ID_Cliente_Final (FK)  
* Nombre_Sitio  
* Direccion_Completa  
* Coordenadas_GPS  
* Persona_Contacto  
* Telefono_Contacto  
* Horario_Acceso  
* Restricciones_Permisos  
* Observaciones

#### **ODS (Orden de Servicio)**
* ID_ODS (PK)  
* Numero_ODS (Unique, autogenerado)  
* Numero_Orden_Cliente  
* ID_Cliente (FK)  
* ID_Cliente_Final (FK)  
* ID_Localidad (FK)  
* ID_Tipo_Servicio (FK)  
* Estado_Actual  
* Fecha_Creacion  
* Fecha_Programada  
* Fecha_Ejecucion  
* Fecha_Culminacion  
* Descripcion  
* Diagnostico_Inicial  
* Observaciones  
* Usuario_Creador (FK)  
* Prioridad (Normal/Alta/Urgente)

#### **ODS_Tecnologia** (Relación N:M)
* ID_ODS (FK)  
* ID_Tecnologia (FK)

#### **Tecnologia**
* ID_Tecnologia (PK)  
* Categoria (Microondas Terrestre, Satelital, Multiplexación, Networking)  
* Subcategoria (Punto a Punto, VSAT, etc.)  
* Marca  
* Modelo  
* Especificaciones

#### **Tipo_Servicio**
* ID_Tipo_Servicio (PK)  
* Nombre (Inspección, Instalación, etc.)  
* Descripcion  
* Requiere_Informe_Post  
* SLA_Dias

#### **ODS_Estado_Historial**
* ID_Historial (PK)  
* ID_ODS (FK)  
* Estado_Anterior  
* Estado_Nuevo  
* Fecha_Cambio  
* Usuario_Responsable (FK)  
* Observaciones

#### **Configuracion**
* ID_Configuracion (PK)  
* ID_ODS (FK)  
* Parametros_Tecnicos (JSON o Text)  
* Archivo_Config (ruta)  
* Estado (Pendiente/Cargada)  
* Fecha_Carga  
* Usuario_Cargo (FK)

#### **Workflow_Definicion**
* ID_Workflow (PK)  
* ID_Tipo_Servicio (FK)  
* Nombre  
* Descripcion  
* Version  
* Activo (Boolean)  
* Fecha_Creacion

#### **Workflow_Estado**
* ID_Estado (PK)  
* ID_Workflow (FK)  
* Codigo_Estado  
* Nombre_Estado  
* Descripcion  
* Es_Estado_Inicial (Boolean)  
* Es_Estado_Final (Boolean)  
* Color  
* Orden

#### **Workflow_Transicion**
* ID_Transicion (PK)  
* ID_Workflow (FK)  
* ID_Estado_Origen (FK)  
* ID_Estado_Destino (FK)  
* Nombre_Accion  
* Requiere_Aprobacion (Boolean)  
* Requiere_Justificacion (Boolean)  
* Validaciones (JSON)

#### **Regla_Transicion**
* ID_Regla (PK)  
* ID_Transicion (FK)  
* Tipo_Regla (VALIDACION_CAMPO, VALIDACION_RECURSO, VALIDACION_PERMISO, VALIDACION_NEGOCIO, VALIDACION_TEMPORAL)  
* Condicion (JSON)  
* Mensaje_Error

#### **Modificacion_ODS**
* ID_Modificacion (PK)  
* ID_ODS (FK)  
* ID_Transicion (FK)  
* Tipo_Modificacion (CAMBIO_ESTADO, CAMBIO_ALCANCE, PAUSA, REPROGRAMACION, CANCELACION, REACTIVACION)  
* Estado_Anterior  
* Estado_Nuevo  
* Justificacion  
* Requiere_Aprobacion (Boolean)  
* Aprobada (Boolean)  
* Usuario_Solicita (FK)  
* Usuario_Aprueba (FK)  
* Fecha_Solicitud  
* Fecha_Aprobacion  
* Datos_Adicionales (JSON)


#### **Equipo**
* ID_Equipo (PK)  
* Serial  
* ID_Cliente_Propietario (FK)  
* ID_Tecnologia (FK)  
* Marca  
* Modelo  
* Estado_Ciclo_Vida (Almacén, Tránsito, Instalado, Pendiente Nota Entrega, Entregado)  
* ID_Localidad_Instalado (FK, nullable)  
* Ubicacion_Almacen  
* Condicion (Nuevo, Usado, Operativo, Fallado)  
* Fecha_Recepcion  
* Observaciones

#### **Equipo_Movimiento** (Historial)
* ID_Movimiento (PK)  
* ID_Equipo (FK)  
* ID_ODS (FK, nullable)  
* Tipo_Movimiento (Recepción, Asignación, Instalación, Devolución, Entrega Cliente)  
* Estado_Anterior  
* Estado_Nuevo  
* Fecha_Movimiento  
* Usuario_Responsable (FK)  
* Observaciones

#### **Nota_Entrega**
* ID_Nota_Entrega (PK)  
* Numero_Nota (autogenerado)  
* ID_ODS (FK)  
* Tipo (Salida/Entrada)  
* Estado (Pendiente, En Tránsito, Entregado)  
* Transportista  
* Numero_Guia  
* Fecha_Despacho  
* Fecha_Entrega  
* Firma_Cliente (imagen)  
* Observaciones

#### **Nota_Entrega_Detalle**
* ID_Detalle (PK)  
* ID_Nota_Entrega (FK)  
* ID_Equipo (FK)  
* Condicion

#### **Herramienta**
* ID_Herramienta (PK)  
* Codigo_Herramienta (Unique)  
* Nombre  
* Descripcion  
* Categoria  
* Estado (Almacén, Tráslado, Mantenimiento, Baja)  
* Condicion (Operativa, Requiere Mantenimiento, Dañada)  
* Valor  
* Fecha_Adquisicion  
* Proveedor  
* Foto

#### **Solicitud_Herramienta**
* ID_Solicitud_Herramienta (PK)  
* ID_Tecnico (FK)  
* Estado (Pendiente, Aprobada, En Preparación, Entregada, Devuelta)  
* Fecha_Solicitud  
* Fecha_Requerida  
* Fecha_Entrega  
* Fecha_Devolucion  
* Observaciones

#### **Solicitud_Herramienta_Detalle**
* ID_Detalle (PK)  
* ID_Solicitud_Herramienta (FK)  
* ID_Herramienta (FK)  
* Cantidad

#### **Solicitud_Herramienta_ODS** (Relación N:M)
* ID_Solicitud_Herramienta (FK)  
* ID_ODS (FK)

#### **Insumo**
* ID_Insumo (PK)  
* Codigo_Insumo (Unique)  
* Nombre  
* Descripcion  
* Categoria  
* Unidad_Medida  
* Stock_Actual  
* Stock_Minimo  
* Stock_Maximo  
* Costo_Unitario  
* Proveedor_Principal  
* Ubicacion_Almacen  
* Foto

#### **ODS_Insumo** (Asignación)
* ID_Asignacion (PK)  
* ID_ODS (FK)  
* ID_Insumo (FK)  
* Cantidad_Asignada  
* Cantidad_Devuelta  
* Cantidad_Usada (calculado)  
* Fecha_Asignacion  
* Fecha_Devolucion  
* Estado (Asignado, Entregado, Devuelto)

#### **Tecnico** (hereda de Empleado)
* ID_Tecnico (PK)  
* ID_Empleado (FK)  
* Especialidades (JSON o tabla relacionada)  
* Disponible (Boolean)  
* Nivel (Junior, Semi-Senior, Senior)

#### **ODS_Tecnico** (Asignación)
* ID_Asignacion (PK)  
* ID_ODS (FK)  
* ID_Tecnico (FK)  
* Rol (Principal/Asistente)  
* Fecha_Asignacion

#### **Informe_Servicio**
* ID_Informe_Servicio (PK)  
* ID_ODS (FK)  
* Hora_Inicio  
* Hora_Fin  
* Trabajo_Realizado  
* Observaciones  
* Firma_Cliente (imagen)  
* Archivo_Escaneado (ruta)  
* Fecha_Carga

#### **Informe_Tecnico** (Post-instalación, Post-mantenimiento, Inspección)
* ID_Informe_Tecnico (PK)  
* ID_ODS (FK)  
* Tipo_Informe  
* Contenido (Text/HTML)  
* Fecha_Creacion  
* Usuario_Creador (FK)

#### **Informe_Imagen**
* ID_Imagen (PK)  
* ID_Informe_Tecnico (FK)  
* Archivo_Imagen (ruta)  
* Descripcion  
* Orden

#### **Proforma**
* ID_Proforma (PK)  
* Numero_Proforma (autogenerado)  
* ID_Cliente (FK)  
* Fecha_Emision  
* Fecha_Envio  
* Fecha_Aprobacion  
* Estado (Borrador, Enviada, Aprobada, Rechazada)  
* Subtotal  
* Impuestos  
* Total  
* Observaciones_Cliente  
* Archivo_PDF (ruta)

#### **Proforma_Detalle**
* ID_Detalle (PK)  
* ID_Proforma (FK)  
* ID_ODS (FK)  
* Descripcion  
* Monto

#### **Factura**
* ID_Factura (PK)  
* Numero_Factura (correlativo legal)  
* ID_Proforma (FK)  
* ID_Cliente (FK)  
* Fecha_Emision  
* Fecha_Vencimiento  
* Estado (Emitida, Pagada Parcial, Pagada Total, Vencida, Anulada)  
* Base_Imponible  
* Impuestos  
* Total  
* Saldo_Pendiente  
* Archivo_PDF (ruta)

#### **Pago**
* ID_Pago (PK)  
* ID_Factura (FK)  
* Numero_Referencia  
* Fecha_Pago  
* Monto  
* Metodo_Pago  
* Banco  
* Comprobante (imagen/PDF)  
* Usuario_Registro (FK)

#### **Empleado**
* ID_Empleado (PK)  
* Cedula (Unique)  
* Nombre  
* Apellido  
* Fecha_Nacimiento  
* Telefono  
* Email  
* Direccion  
* Fecha_Ingreso  
* Cargo  
* Departamento  
* Tipo_Contrato  
* Salario_Base  
* Estado (Activo, Inactivo, Vacaciones, Suspendido, Retirado)  
* Datos_Bancarios  
* Contacto_Emergencia  
* Foto

#### **Usuario**
* ID_Usuario (PK)  
* ID_Empleado (FK, nullable)  
* Username (Unique)  
* Password_Hash  
* Email  
* Estado (Activo, Inactivo, Bloqueado)  
* Fecha_Ultimo_Acceso  
* Intentos_Fallidos  
* Foto_Perfil

#### **Rol**
* ID_Rol (PK)  
* Nombre_Rol  
* Descripcion

#### **Usuario_Rol**
* ID_Usuario (FK)  
* ID_Rol (FK)

#### **Permiso**
* ID_Permiso (PK)  
* Modulo  
* Funcionalidad  
* Accion (Crear, Leer, Actualizar, Eliminar, Aprobar, Exportar)

#### **Rol_Permiso**
* ID_Rol (FK)  
* ID_Permiso (FK)

#### **Auditoria**
* ID_Auditoria (PK)  
* ID_Usuario (FK)  
* Fecha_Hora  
* Accion  
* Modulo  
* Registro_Afectado  
* Valores_Anteriores (JSON)  
* Valores_Nuevos (JSON)  
* IP_Origen

---

## **8. ARQUITECTURA PROPUESTA**

### **8.1 Arquitectura General**

**Patrón Arquitectónico:** Arquitectura en capas (Layered Architecture) con separación clara de responsabilidades.

```
┌─────────────────────────────────────────────────────────┐
│                  CAPA DE PRESENTACIÓN                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Web Browser  │  │ Mobile App   │  │  Tablet App  │  │
│  │  (Desktop)   │  │  (Técnicos)  │  │ (Logística)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTPS/REST API
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │           API Gateway / Backend Services         │  │
│  │  • Autenticación y Autorización                  │  │
│  │  • Lógica de Negocio                             │  │
│  │  • Orquestación de Workflows                     │  │
│  │  • Generación de Documentos                      │  │
│  │  • Notificaciones                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   CAPA DE SERVICIOS                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   ODS    │ │Logística │ │  Admin   │ │  RRHH    │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  CAPA DE PERSISTENCIA                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Base de Datos Relacional (SQL)           │  │
│  │         • PostgreSQL / MySQL / SQL Server        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Almacenamiento de Archivos               │  │
│  │         • Sistema de archivos / S3 / Blob        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### **8.2 Componentes Principales**

#### **Frontend (Capa de Presentación)**
* **Tecnología Sugerida:** Framework moderno (React, Vue.js, Angular)  
* **Características:**  
  * SPA (Single Page Application) para experiencia fluida  
  * Responsive design (Bootstrap, Tailwind, Material UI)  
  * PWA (Progressive Web App) para funcionalidad offline en móviles  
  * Notificaciones en tiempo real (WebSockets o Server-Sent Events)

#### **Backend (Capa de Aplicación y Servicios)**
* **Tecnología Sugerida:** Node.js (Express/NestJS), Python (Django/FastAPI), Java (Spring Boot), .NET Core  
* **Características:**  
  * API RESTful bien documentada (OpenAPI/Swagger)  
  * Autenticación JWT  
  * Middleware de autorización basado en roles  
  * Validación de datos en entrada  
  * Manejo centralizado de errores  
  * Logging estructurado

#### **Base de Datos**
* **Tecnología Sugerida:** PostgreSQL (open source, robusto) o SQL Server (si hay licencias disponibles)  
* **Características:**  
  * Diseño normalizado (3FN mínimo)  
  * Índices en columnas de búsqueda frecuente  
  * Constraints de integridad referencial  
  * Triggers para auditoría automática  
  * Vistas para reportes complejos  
  * Stored procedures para lógica crítica

#### **Almacenamiento de Archivos**
* **Opciones:**  
  * Sistema de archivos local con estructura organizada  
  * Almacenamiento en nube (AWS S3, Azure Blob, Google Cloud Storage)  
* **Organización:**  
  * `/uploads/ods/{año}/{mes}/{id_ods}/`  
  * `/uploads/equipos/{id_equipo}/`  
  * `/uploads/empleados/{id_empleado}/`

### **8.3 Integraciones Externas**

* **Servicio de Email (SMTP):** Para envío de notificaciones, proformas, facturas  
* **Servicio de SMS (opcional):** Para notificaciones críticas a técnicos  
* **Servicio de Almacenamiento en Nube:** Para backups automáticos  
* **Servicio de Firma Electrónica (futuro):** Para documentos legales

### **8.4 Seguridad**

* **Autenticación:** JWT con refresh tokens  
* **Autorización:** RBAC (Role-Based Access Control)  
* **Cifrado:**  
  * HTTPS/TLS para comunicaciones  
  * Bcrypt/Argon2 para contraseñas  
  * Cifrado de campos sensibles en BD  
* **Protección:**  
  * Rate limiting  
  * CORS configurado  
  * Sanitización de inputs  
  * Prepared statements (prevención SQL Injection)  
  * CSP headers  
* **Auditoría:** Logs inmutables de todas las operaciones críticas

---

## **9. PLAN DE IMPLEMENTACIÓN SUGERIDO**

### **Fase 1: Fundamentos (Mes 1-2)**
* Configuración de infraestructura  
* Diseño detallado de base de datos  
* Implementación de autenticación y autorización  
* Módulo de gestión de usuarios y roles  
* Módulo de gestión de clientes y localidades

### **Fase 2: Core Operacional (Mes 3-4)**
* Módulo de ODS (creación, estados, workflow)  
* Módulo de coordinación  
* Módulo de asignación de técnicos  
* Dashboard básico  
* Cronograma de actividades

### **Fase 3: Logística (Mes 5-6)**
* Módulo de gestión de equipos  
* Módulo de herramientas  
* Módulo de insumos  
* Notas de entrega  
* Inventarios

### **Fase 4: Documentación e Informes (Mes 7)**
* Carga de informes de servicio  
* Generación de informes técnicos  
* Plantillas de documentos  
* Galería de imágenes

### **Fase 5: Administración (Mes 8-9)**
* Módulo de proformas y facturación  
* Módulo de cuentas por cobrar  
* Módulo de RRHH básico (empleados, nómina)  
* Reportes financieros

### **Fase 6: Reportes y Analytics (Mes 10)**
* Dashboard ejecutivo  
* Reportes operacionales  
* Reportes de logística  
* Reportes financieros avanzados  
* Constructor de reportes personalizables

### **Fase 7: Optimización y Móvil (Mes 11-12)**
* Optimización de rendimiento  
* Aplicación móvil para técnicos  
* Notificaciones push  
* Funcionalidad offline  
* Capacitación de usuarios  
* Migración de datos históricos  
* Puesta en producción

---

## **10. RIESGOS Y MITIGACIONES**

### **Riesgo 1: Complejidad de Workflows**
**Descripción:** Los workflows de ODS son complejos y varían por tipo de servicio.  
**Impacto:** Alto  
**Probabilidad:** Alta  
**Mitigación:**  
* Diseñar engine de workflow configurable  
* Documentar exhaustivamente cada flujo  
* Validar con usuarios reales en cada iteración  
* Implementar por fases, un tipo de servicio a la vez

### **Riesgo 2: Resistencia al Cambio**
**Descripción:** Los usuarios pueden resistirse a adoptar el nuevo sistema.  
**Impacto:** Alto  
**Probabilidad:** Media  
**Mitigación:**  
* Involucrar a usuarios clave desde el diseño  
* Capacitación exhaustiva y continua  
* Período de operación paralela (sistema antiguo + nuevo)  
* Soporte técnico dedicado en las primeras semanas  
* Demostrar beneficios tangibles rápidamente

### **Riesgo 3: Calidad de Datos Históricos**
**Descripción:** Datos históricos pueden estar incompletos o inconsistentes.  
**Impacto:** Medio  
**Probabilidad:** Alta  
**Mitigación:**  
* Proceso de limpieza y validación de datos antes de migración  
* Migración por fases  
* Mantener sistema antiguo como consulta por período de transición  
* Aceptar que algunos datos históricos no serán migrables

### **Riesgo 4: Escalabilidad**
**Descripción:** El sistema puede no escalar adecuadamente con el crecimiento.  
**Impacto:** Alto  
**Probabilidad:** Baja  
**Mitigación:**  
* Diseño con escalabilidad en mente desde el inicio  
* Pruebas de carga antes de producción  
* Arquitectura que permita escalamiento horizontal  
* Monitoreo de rendimiento continuo

### **Riesgo 5: Seguridad de Datos**
**Descripción:** Brechas de seguridad pueden exponer datos sensibles.  
**Impacto:** Crítico  
**Probabilidad:** Media  
**Mitigación:**  
* Implementar mejores prácticas de seguridad desde el inicio  
* Auditorías de seguridad periódicas  
* Penetration testing antes de producción  
* Backups cifrados y offsite  
* Plan de respuesta a incidentes

### **Riesgo 6: Dependencia de Conectividad**
**Descripción:** Técnicos en campo pueden tener conectividad limitada.  
**Impacto:** Medio  
**Probabilidad:** Alta  
**Mitigación:**  
* Implementar funcionalidad offline en app móvil  
* Sincronización automática cuando hay conexión  
* Permitir carga de informes posterior  
* Diseño de interfaz que funcione con 3G

---

## **11. MÉTRICAS DE ÉXITO**

### **Métricas Operacionales**
* **Tiempo promedio de ciclo de ODS:** Reducción del 30% vs proceso manual  
* **Tasa de ODS completadas a tiempo:** > 85%  
* **Tiempo de coordinación:** Reducción del 50%  
* **Tasa de re-trabajos:** < 5%

### **Métricas de Logística**
* **Precisión de inventario:** > 98%  
* **Tiempo de localización de equipos:** < 2 minutos  
* **Tasa de herramientas no devueltas:** < 2%  
* **Rotación de inventario de equipos:** Reducción del 40% en tiempo de permanencia en almacén

### **Métricas Financieras**
* **Tiempo de ciclo de facturación:** Reducción del 50%  
* **Días promedio de cuentas por cobrar:** Reducción del 20%  
* **Tasa de aprobación de proformas:** > 90%  
* **Precisión en costeo de servicios:** > 95%

### **Métricas de Adopción**
* **Tasa de adopción de usuarios:** > 90% en 3 meses  
* **Satisfacción de usuarios:** > 4/5 en encuestas  
* **Tiempo promedio de capacitación:** < 4 horas por usuario  
* **Tickets de soporte:** < 5 por semana después del primer mes

### **Métricas Técnicas**
* **Uptime del sistema:** > 99%  
* **Tiempo de respuesta promedio:** < 2 segundos  
* **Tasa de errores:** < 0.1%  
* **Cobertura de pruebas automatizadas:** > 70%

---

## **12. CONCLUSIONES Y RECOMENDACIONES**

### **Conclusiones**

1. **Complejidad Justificada:** El sistema propuesto es complejo, pero la complejidad refleja la realidad operacional de XTEL. Intentar simplificar excesivamente resultaría en un sistema que no cumple las necesidades reales.

2. **Integración Crítica:** El éxito del sistema depende de la integración fluida entre los tres departamentos (Operaciones, Logística, Administración). El diseño debe facilitar esta integración sin crear silos de información.

3. **Workflows Configurables:** Dada la variabilidad de los procesos, es esencial que los workflows sean configurables sin modificación de código. Esto permitirá adaptación a cambios en procesos de negocio.

4. **Trazabilidad Total:** La capacidad de rastrear cada equipo, cada ODS, cada movimiento es fundamental para el control y la auditoría. El sistema debe garantizar esta trazabilidad.

5. **Experiencia Móvil:** Los técnicos son usuarios clave y trabajan en campo. La experiencia móvil no puede ser una idea tardía; debe ser parte central del diseño.

### **Recomendaciones**

1. **Implementación por Fases:** No intentar implementar todo a la vez. Comenzar con el core (ODS y logística de equipos) y expandir gradualmente.

2. **Prototipo Rápido:** Desarrollar un prototipo funcional del flujo de instalación completo en las primeras 6 semanas para validar el diseño con usuarios reales.

3. **Usuarios Piloto:** Seleccionar un grupo pequeño de usuarios (2-3 técnicos, 1 coordinador, 1 persona de logística) para probar cada módulo antes del rollout general.

4. **Documentación Continua:** Mantener documentación actualizada de workflows, procesos y procedimientos. Esto será crítico para capacitación y soporte.

5. **Inversión en Capacitación:** Dedicar recursos significativos a capacitación. Un sistema excelente que los usuarios no saben usar es un fracaso.

6. **Plan de Contingencia:** Mantener procesos manuales de respaldo durante los primeros 3-6 meses en caso de fallas del sistema.

7. **Monitoreo Proactivo:** Implementar monitoreo y alertas desde el día 1. Detectar y resolver problemas antes de que afecten a los usuarios.

8. **Feedback Continuo:** Establecer canales formales para que los usuarios reporten problemas y sugieran mejoras. Actuar sobre este feedback rápidamente.

9. **Consideración de Cloud:** Evaluar seriamente deployment en cloud (AWS, Azure, Google Cloud) vs on-premise. Cloud ofrece ventajas en escalabilidad, backups, y acceso remoto.

10. **Auditoría Externa:** Antes del go-live, realizar auditoría externa de seguridad y de procesos para identificar puntos ciegos.

### **Próximos Pasos Inmediatos**

1. **Aprobación de Stakeholders:** Presentar este documento a la gerencia y obtener aprobación formal del alcance y enfoque.

2. **Selección de Tecnología:** Decidir stack tecnológico específico basado en:  
   * Expertise del equipo de desarrollo  
   * Costos de licenciamiento  
   * Requerimientos de infraestructura  
   * Soporte a largo plazo

3. **Formación de Equipo:** Ensamblar equipo de desarrollo con roles claros:  
   * Product Owner  
   * Scrum Master / Project Manager  
   * Desarrolladores Backend (2-3)  
   * Desarrolladores Frontend (2)  
   * Desarrollador Móvil (1)  
   * QA / Tester (1)  
   * DBA (1, puede ser compartido)  
   * UX/UI Designer (1, al menos para fase inicial)

4. **Setup de Infraestructura:** Preparar ambientes de desarrollo, staging y producción.

5. **Diseño Detallado de Base de Datos:** Convertir el modelo conceptual en esquema físico con todos los detalles (tipos de datos, índices, constraints).

6. **Diseño de UI/UX:** Crear wireframes y mockups de las pantallas principales para validación temprana.

7. **Planificación de Sprints:** Si se usa metodología ágil, planificar los primeros 3-4 sprints en detalle.

---

## **ANEXOS**

### **Anexo A: Glosario de Términos**

* **ODS:** Orden de Servicio  
* **Carrier:** Empresa de telecomunicaciones que opera infraestructura de red  
* **Site Survey:** Inspección de sitio para determinar factibilidad  
* **VSAT:** Very Small Aperture Terminal (terminal satelital)  
* **TDM:** Time Division Multiplexing  
* **SSO:** Seguro Social Obligatorio  
* **PF:** Paro Forzoso  
* **RIF:** Registro de Información Fiscal (Venezuela)  
* **SLA:** Service Level Agreement  
* **RBAC:** Role-Based Access Control  
* **JWT:** JSON Web Token

### **Anexo B: Referencias**

* Documento original de requerimientos SGCV2.md  
* Entrevistas con personal de XTEL  
* Procesos documentados de la empresa  
* Mejores prácticas de la industria de telecomunicaciones

### **Anexo C: Contactos Clave**

* **Gerente General:** [Nombre]  
* **Gerente de Operaciones:** [Nombre]  
* **Gerente de Logística:** [Nombre]  
* **Gerente de Administración:** [Nombre]  
* **Coordinador Principal:** [Nombre]  
* **Técnico Senior (Usuario Piloto):** [Nombre]

---

**Fin del Documento de Análisis y Diseño**

**Versión:** 1.0  
**Fecha:** [Fecha actual]  
**Preparado por:** [Nombre del analista/equipo]  
**Aprobado por:** [Pendiente]

---
