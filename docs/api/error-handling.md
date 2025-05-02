# Manejo de Errores en SGC v2

## Introducción

En SGC v2, hemos diseñado un sistema de manejo de errores robusto y flexible que permite una gestión precisa y contextual de diferentes tipos de errores.

## Interfaces de Error

### 1. BaseErrorShape

Interfaz base para todos los errores del sistema.

**Atributos**:

- `name`: Nombre identificativo del error
- `code`: Código único del error
- `message`: Mensaje descriptivo del error
- `timestamp`: Momento exacto en que se generó el error

**Ejemplo**:

```typescript
{
  name: 'AuthenticationError',
  code: 'token_invalid',
  message: 'El token de autenticación no es válido',
  timestamp: 2025-05-01T22:56:15-04:00
}
```

### 2. BusinessErrorShape

Extiende `BaseErrorShape` para errores de negocio.

**Atributos adicionales**:

- `httpCode`: Código HTTP relacionado con el error
- `details`: Información adicional sobre el error

**Ejemplo**:

```typescript
{
  name: 'PaymentError',
  code: 'payment_declined',
  message: 'El pago no pudo ser procesado',
  timestamp: 2025-05-01T22:56:15-04:00,
  httpCode: 402,
  details: {
    reason: 'Fondos insuficientes',
    cardType: 'VISA'
  }
}
```

### 3. ValidationErrorShape

Extiende `BusinessErrorShape` para errores de validación.

**Atributos adicionales**:

- `field`: Campo específico que no pasó la validación
- `validationRules`: Reglas de validación que no se cumplieron

**Ejemplo**:

```typescript
{
  name: 'ValidationError',
  code: 'email_invalid',
  message: 'El formato de email no es correcto',
  timestamp: 2025-05-01T22:56:15-04:00,
  httpCode: 400,
  field: 'email',
  validationRules: {
    format: 'must be a valid email',
    minLength: 5
  }
}
```

### 4. SystemErrorShape

Extiende `BaseErrorShape` para errores críticos del sistema.

**Atributos adicionales**:

- `severity`: Nivel de gravedad del error
- `stackTrace`: Traza de la pila de errores

**Ejemplo**:

```typescript
{
  name: 'DatabaseError',
  code: 'connection_failed',
  message: 'No se pudo conectar a la base de datos',
  timestamp: 2025-05-01T22:56:15-04:00,
  severity: 'high',
  stackTrace: '...'
}
```

## Factories de Error

### 1. createBusinessErrorFactory

Crea una clase de error de negocio personalizada.

**Ejemplo de uso**:

```typescript
const AuthError = createBusinessErrorFactory('AuthError')
const tokenError = new AuthError(
  'token_invalid',
  'Token de autenticación inválido',
  401,
  { attemptCount: 3 },
)
```

### 2. createValidationErrorFactory

Crea una clase de error de validación personalizada.

**Ejemplo de uso**:

```typescript
const ValidationError = createValidationErrorFactory('ValidationError')
const passwordError = new ValidationError(
  'password_weak',
  'La contraseña no cumple los requisitos de seguridad',
  'password',
  {
    minLength: 8,
    requireSpecialChar: true,
  },
  400,
)
```

### 3. createSystemErrorFactory

Crea una clase de error de sistema personalizada.

**Ejemplo de uso**:

```typescript
const SystemError = createSystemErrorFactory('DatabaseError')
const connectionError = new SystemError(
  'connection_timeout',
  'Tiempo de conexión agotado',
  'high',
)
```

## Mejores Prácticas

1. Usa el factory más apropiado según el contexto del error.
2. Proporciona siempre un código de error único.
3. Incluye detalles adicionales cuando sea posible.
4. Mantén los mensajes de error concisos pero informativos.

## Consideraciones de Seguridad

- Nunca reveles detalles internos sensibles en los mensajes de error.
- Usa los campos `details` con precaución para no exponer información confidencial.
