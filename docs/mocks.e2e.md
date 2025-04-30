Estado Actual:

Tenemos una implementación mejorada de SupabaseAuthRepositoryMock
El repositorio ya incluye importaciones de utilidades como CustomerCodeJwtHelper
Se ha añadido más detalle a las respuestas simuladas
Plan Actualizado para Pruebas E2E:

1. Configuración del Repositorio Mock
   Modificaremos la inicialización del backend para seleccionar dinámicamente entre SupabaseAuthRepository y SupabaseAuthRepositoryMock.

En /packages/api/src/main.ts:

```TypeScript
export const getAuthRouter = () => {
    const repository: AuthRespository = process.env.USE_MOCK_REPO === 'true'
    ? new SupabaseAuthRepositoryMock()
    : new SupabaseAuthRepository()

    const service = new AuthService(repository)
    const authController = new AuthController(service)
    const authRouter = new AuthRouter(authController)
    authRouter.initializeRoutes()
    return authRouter.getRouter()
}
```

2. Script de Inicio del API Mockeado
   Crearemos /scripts/start-mock-api.js:

```JavaScript
const fs = require('fs')
const net = require('net')
const path = require('path')

// Configurar alias de módulos si es necesario
require('module-alias/register')

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(0, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    server.on('error', reject)
  })
}

async function startMockApi() {
  try {
    const port = await findFreePort()

    // Configurar variables de entorno para el modo mock
    process.env.USE_MOCK_REPO = 'true'
    process.env.JWT_SECRET = 'test-secret'
    process.env.PORT = port.toString()

    // Ruta al punto de entrada del API
    const apiEntryPath = path.resolve(__dirname, '../packages/api/src/main.ts')

    // Registrar transpilador de TypeScript para importar módulos TS
    require('ts-node').register({
      transpileOnly: true,
      project: path.resolve(__dirname, '../packages/api/tsconfig.json')
    })

    // Importar dinámicamente el punto de entrada del API
    const { startServer } = require(apiEntryPath)

    // Escribir puerto en archivo temporal
    const mockApiPortPath = path.resolve(__dirname, '../.mock-api-port')
    fs.writeFileSync(mockApiPortPath, port.toString())

    // Iniciar el servidor
    await startServer()

    console.log(`Mock API started on port ${port}`)

    // Manejar terminación del proceso
    process.on('SIGINT', () => {
      fs.unlinkSync(mockApiPortPath)
      process.exit(0)
    })

    return port
  } catch (error) {
    console.error('Error starting mock API:', error)
    process.exit(1)
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  startMockApi()
}

module.exports = { startMockApi }
```

Para que esto funcione, necesitarás modificar el punto de entrada del API (/packages/api/src/main.ts) para exportar una función startServer:

```TypeScript
export const startServer = async () => {
  const app = ServerApi.getInstance()

  // Configurar puerto desde variable de entorno
  const port = parseInt(process.env.PORT || '3001', 10)

  app.setPort(port)

  // Agregar rutas
  app.addRoute('/auth', getAuthRouter())

  // Iniciar servidor
  app.start(port)
}

// Si se ejecuta directamente (para desarrollo)
if (require.main === module) {
  startServer()
}
```

Además, necesitarás instalar algunas dependencias:

```bash
npm install --save-dev ts-node module-alias
```

En tu package.json, puedes agregar un script:

```json
{
  "scripts": {
    "start:mock-api": "node scripts/start-mock-api.js"
  }
}
```

3. Configuración de Variables de Entorno
   En /packages/web/.env.test:

```.env
NEXT_PUBLIC_URL_API=http://localhost:${MOCK_API_PORT}
```

4. Modificación de Playwright
   En /packages/web/playwright.config.ts:

```TypeScript
import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  globalSetup: async () => {
    const mockApiPortPath = path.resolve(__dirname, '../../.mock-api-port')
    const port = fs.readFileSync(mockApiPortPath, 'utf-8').trim()

    process.env.MOCK_API_PORT = port
  },
  globalTeardown: async () => {
    // Limpiar archivo de puerto
    const mockApiPortPath = path.resolve(__dirname, '../../.mock-api-port')
    if (fs.existsSync(mockApiPortPath)) {
      fs.unlinkSync(mockApiPortPath)
    }
  },
  // Resto de la configuración de Playwright
})
```

5. Ejemplo de Test E2E
   En /packages/web/e2e/auth.spec.ts:

```TypeScript
import { test, expect } from '@playwright/test'

test('Sign up flow', async ({ page }) => {
  await page.goto('/signup')

  // Interactuar con formulario
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')

  await page.click('button[type="submit"]')

  // Verificar redirección o estado de autenticación
  await expect(page).toHaveURL('/dashboard')
})
```

6. Scripts de NPM
   En /packages/web/package.json:

```json
{
  "scripts": {
    "test:e2e": "playwright test --config=playwright.config.ts",
    "test:e2e:debug": "playwright test --debug",
    "start:mock-api": "node ../../scripts/start-mock-api.js"
  }
}
```

Documentación
Crearemos /docs/e2e-testing.md:

# Pruebas E2E con Playwright y Backend Mockeado

## Configuración

1. Variables de entorno:

   - `USE_MOCK_REPO`: Activa el repositorio mockeado
   - `MOCK_API_PORT`: Puerto dinámico para el API mockeado

2. Ejecución de pruebas:
   ```bash
   npm run start:mock-api  # Inicia API mockeada
   npm run test:e2e        # Ejecuta pruebas E2E
   ```
   Funcionamiento
   El script start-mock-api.js levanta un servidor con repositorio mockeado
   Playwright lee el puerto desde .mock-api-port
   Los tests utilizan el backend mockeado con respuestas predefinidas

### Consideraciones Adicionales

1. Manejar diferentes escenarios en [SupabaseAuthRepositoryMock](cci:2://file:///home/thot/projects/sgcv2/packages/api/src/auth/auth.supabase.repository.mock.ts:3:0-168:1)
2. Implementar más métodos de utilidad para simular diferentes estados
3. Añadir logs y health checks para debugging

### Pasos Siguientes

1. Implementar la estructura de scripts
2. Configurar variables de entorno
3. Crear tests E2E básicos
4. Refinar el mock de repositorio
5. Documentar el proceso

¿Te gustaría que profundice en alguno de estos puntos o comenzar con la implementación?

me queda una duda.
1 podemos guardar en .env el numero de puerto?
2 porque hacer todo el script de levantar un server, no llamamos el script dev con pnpm como pnpm -F api dev. y si ya habiamos guardado el puerto y teniamos una variable que idicava que tenia que levantar con el mock de supabase

Excelentes preguntas. Voy a responder cada punto y proponer una solución más simple y directa:

1. Guardar Puerto en .env
   Sí, podemos guardar el puerto en un archivo .env. De hecho, es una práctica recomendada. Puedes crear un .env.test específico para pruebas:

```env
# .env.test

MOCK_API_PORT=0 # 0 significa puerto aleatorio
USE_MOCK_REPO=true
JWT_SECRET=test-secret
```

2. Usar Script de Desarrollo Existente
   Tienes toda la razón. En lugar de crear un script complejo, podemos modificar el script de desarrollo existente para soportar el modo mock.

Modificaré el script de desarrollo en packages/api/package.json:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch src/main.ts",
    "dev:mock": "USE_MOCK_REPO=true NODE_ENV=test tsx watch src/main.ts"
  }
}
```

Y en packages/api/src/main.ts:

```typescript
export const startServer = async () => {
  const app = ServerApi.getInstance()

  // Lógica para seleccionar puerto
  const port = process.env.MOCK_API_PORT
    ? parseInt(process.env.MOCK_API_PORT, 10)
    : 3001

  // Lógica para seleccionar repositorio
  const repository =
    process.env.USE_MOCK_REPO === 'true'
      ? new SupabaseAuthRepositoryMock()
      : new SupabaseAuthRepository()

  app.setPort(port)
  app.addRoute('/auth', getAuthRouter(repository))

  app.start(port)

  if (process.env.NODE_ENV === 'test') {
    // Escribir puerto para tests
    const mockApiPortPath = path.resolve(process.cwd(), '.mock-api-port')
    fs.writeFileSync(mockApiPortPath, port.toString())
  }

  return port
}

// Script de entrada
if (require.main === module) {
  startServer()
}
```

Script Simplificado para E2E
En lugar del script complejo anterior, podemos crear un script simple en scripts/start-mock-api.js:

```javascript
const { spawn } = require('child_process')
const path = require('path')

async function startMockApi() {
  const apiPath = path.resolve(__dirname, '../packages/api')

  const mockApiProcess = spawn('pnpm', ['dev:mock'], {
    cwd: apiPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      USE_MOCK_REPO: 'true',
      MOCK_API_PORT: '0', // Puerto aleatorio
    },
  })

  // Manejar cierre del proceso
  process.on('SIGINT', () => {
    mockApiProcess.kill()
  })

  return mockApiProcess
}

// Si se ejecuta directamente
if (require.main === module) {
  startMockApi()
}

module.exports = { startMockApi }
```

Beneficios de Este Enfoque
Utiliza el script de desarrollo existente
Configurable via variables de entorno
Mantiene la lógica de selección de repositorio en el código principal
Escribe el puerto para tests de manera integrada
Más simple y menos código personalizado
Configuración de Playwright
En playwright.config.ts:

```typescript
import { defineConfig } from '@playwright/test'
import fs from 'fs'
import path from 'path'

export default defineConfig({
globalSetup: async () => {
const mockApiPortPath = path.resolve(\_\_dirname, '../.mock-api-port')
const port = fs.readFileSync(mockApiPortPath, 'utf-8').trim()

    process.env.MOCK_API_PORT = port

},
// Resto de configuración...
})
```

Pasos para Implementar
Modificar packages/api/package.json
Actualizar packages/api/src/main.ts
Crear scripts/start-mock-api.js
Configurar Playwright
Preguntas para Ti
¿Te parece que este enfoque simplifica demasiado el proceso?
¿Quieres que profundice en algún aspecto de la implementación?

```

```
