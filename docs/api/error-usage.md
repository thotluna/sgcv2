# Uso del Sistema de Manejo de Errores

## Introducción

El sistema de manejo de errores está diseñado para proporcionar una gestión flexible y contextual de diferentes tipos de errores en la aplicación.

## Tipos de Errores

### 1. BaseError

Utilizado para errores genéricos con código de estado HTTP.

```typescript
// Crear un error de autenticación personalizado
const AuthErrorClass = errorClassFactory('AuthError', HTTP_CODE.UNAUTHORIZED)
const tokenError = new AuthErrorClass('token_invalid', 'Token inválido')
```

#### Atributos

- `name`: Nombre del error
- `code`: Código único del error
- `message`: Mensaje descriptivo
- `statusCode`: Código HTTP relacionado
- `details`: Información adicional opcional
- `timestamp`: Momento de creación del error

### 2. SystemError

Para errores críticos del sistema con diferentes niveles de severidad.

```typescript
// Error del sistema con alta severidad
const dbError = new SystemError(
  'DatabaseError',
  'connection_failed',
  'No se pudo conectar a la base de datos',
  'high',
)
```

#### Atributos adicionales

- `severity`: Nivel de gravedad ('low', 'medium', 'high')
- `stackTrace`: Traza de la pila de errores

## Factories de Error

### errorClassFactory

Permite crear clases de error personalizadas con un código de estado HTTP predefinido.

```typescript
// Crear un factory para errores de autorización
const AuthErrorClass = errorClassFactory('AuthError', HTTP_CODE.UNAUTHORIZED)

// Usar el factory
const forbiddenError = new AuthErrorClass(
  'insufficient_permissions',
  'No tienes permisos suficientes',
)
```

## Mejores Prácticas

1. Usar el tipo de error más apropiado según el contexto
2. Proporcionar siempre un código de error único
3. Incluir detalles adicionales cuando sea posible
4. Mantener los mensajes de error concisos pero informativos

## Consideraciones de Seguridad

- Evitar revelar detalles internos sensibles en los mensajes de error
- Usar el campo `details` con precaución para no exponer información confidencial

## Ejemplos Avanzados

### Manejo de Errores de Validación

```typescript
const ValidationErrorClass = createValidationErrorFactory('ValidationError')

const emailError = new ValidationErrorClass(
  'email_invalid',
  'Email no válido',
  'email',
  {
    format: 'Debe ser un email válido',
    minLength: 5,
  },
  HTTP_CODE.BAD_REQUEST,
)
```

### Serialización de Errores

Todos los errores tienen un método `toJSON()` para facilitar la serialización:

```typescript
const error = new SystemError(
  'DatabaseError',
  'connection_timeout',
  'Tiempo de conexión agotado',
  'high',
)

console.log(JSON.stringify(error))
// Incluirá todos los atributos del error
```
