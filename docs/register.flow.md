```mermaid
sequenceDiagram
    participant FrontendPage as Register/page.tsx
    participant FrontendForm as SignUpForm Component
    participant ServerAction as signSubmitServerAction.ts
    participant BackendController as AuthController (Express)
    participant BackendService as AuthService
    participant BackendRepository as AuthRepository (Supabase)

    FrontendPage->>FrontendForm: Renderiza formulario de registro
    FrontendForm->>FrontendForm: Usuario llena formulario
    FrontendForm->>ServerAction: Llama sendSing() con datos de registro

    ServerAction->>BackendController: Fetch a endpoint de signup
    Note over ServerAction: Configura headers
    Note over ServerAction: Serializa datos a JSON

    BackendController->>BackendService: Llama signUp(email, password, code)

    BackendService->>BackendService: Valida código de cliente
    BackendService->>BackendService: Verifica email coincida con código

    BackendService->>BackendRepository: Llama signUp(email, password)

    BackendRepository-->>BackendService: Retorna datos de usuario

    BackendService-->>BackendController: Retorna datos de usuario

    BackendController-->>ServerAction: Respuesta con datos de sesión

    ServerAction->>ServerAction: Procesa respuesta
    Note over ServerAction: Guarda tokens en cookies

    ServerAction-->>FrontendForm: Retorna resultado de registro

    alt Registro exitoso
        FrontendForm->>FrontendPage: Redirige a página privada
    else Registro fallido
        FrontendForm->>FrontendForm: Muestra error
    end
```

Componentes clave en el flujo:

Frontend (Register/page.tsx)
Renderiza formulario de registro
Maneja interacción del usuario
Formulario de Registro
Recopila datos (email, password, código de cliente)
Invoca acción del servidor
signSubmitServerAction.ts
Realiza fetch al backend
Configura headers
Maneja respuesta
Gestiona cookies
AuthController (Express)
Recibe solicitud de registro
Valida datos de entrada
Invoca servicio de registro
AuthService
Valida código de cliente
Verifica consistencia de datos
Coordina proceso de registro
AuthRepository (Supabase)
Interactúa con base de datos
Crea usuario
Gestiona autenticación
Puntos de atención:

Validación de código de cliente
Manejo de errores
Gestión de sesión y tokens
Redirección tras registro
