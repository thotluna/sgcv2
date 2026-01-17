# Arquitectura del Proyecto

Este documento define las reglas arquitectónicas que deben seguirse estrictamente en el desarrollo del backend de SGCV2.

## Flujo de Trabajo (Layers)

El flujo de ejecución debe seguir siempre esta cadena:
`Routes -> Controller -> UseCase -> Service -> Repository`

### 1. Routes

Define los endpoints de la API y delega la ejecución al Controller correspondiente.

### 2. Controller

- Encargado de recibir la petición HTTP.
- Valida la entrada (vía DTOs/Schemas).
- Llama al UseCase necesario.
- Mapea la respuesta al formato estándar `ApiResponse<T>`.

### 3. UseCase (Capa de Aplicación)

- Contiene la lógica de orquestación de una acción específica del usuario.
- **Regla**: No puede inyectar Repositorios directamente.
- Debe inyectar **Services** usando interfaces segregadas.

### 4. Service (Capa de Aplicación/Dominio)

- Contiene la lógica de negocio reutilizable.
- **Interface Segregation**: Se deben definir interfaces pequeñas y específicas en la capa de dominio (`domain/`) para cada necesidad del UseCase (ej. `CreateService`, `UpdateService`).
- El servicio implementa estas interfaces y coordina las llamadas al Repositorio.

### 5. Repository (Capa de Infraestructura/Persistencia)

- Encargado de la persistencia de datos (Prisma).
- Implementa la interfaz de repositorio definida en la capa de dominio.

## Reglas de Inyección de Dependencias (DI)

- Se utiliza **InversifyJS**.
- Todas las capas deben estar desacopladas mediante interfaces y Symbols (`di/types.ts`).
- Los servicios y repositorios deben estar marcados con `@injectable()`.

---

_Nota para el Asistente IA: Lee este documento antes de proponer cambios estructurales o crear nuevos módulos._
