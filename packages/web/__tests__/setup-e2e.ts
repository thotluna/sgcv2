import { exec } from 'child_process'
import net from 'net'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function killPortProcess(port: number): Promise<void> {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`)
    if (stdout.trim()) {
      await execAsync(`kill -9 $(lsof -ti:${port})`)
      // eslint-disable-next-line no-console -- Registro de depuración para scripts de configuración de pruebas
      console.log(`Procesos en el puerto ${port} han sido terminados`)
    }
  } catch {
    // No hay procesos en el puerto, lo cual es normal
    // eslint-disable-next-line no-console -- Registro de depuración para scripts de configuración de pruebas
    console.log(`No hay procesos en el puerto ${port}`)
  }
}

async function waitForServerToStart(
  port: number,
  maxAttempts = 30
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const socket = new net.Socket()
        socket.setTimeout(1000)

        socket.connect(port, 'localhost', () => {
          socket.destroy()
          resolve(true)
        })

        socket.on('timeout', () => {
          socket.destroy()
          reject(new Error('Connection timeout'))
        })

        socket.on('error', err => {
          socket.destroy()
          reject(err)
        })
      })

      // eslint-disable-next-line no-console -- Registro de depuración para scripts de configuración de pruebas
      console.log(`Servidor arrancado en el puerto ${port}`)
      return
    } catch {
      // eslint-disable-next-line no-console -- Registro de depuración para scripts de configuración de pruebas
      console.log(`Intento ${attempt}: Servidor no disponible, reintentando...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  throw new Error(
    `No se pudo conectar al servidor después de ${maxAttempts} intentos`
  )
}

async function setupE2EEnvironment() {
  // Matar procesos en el puerto 3001
  await killPortProcess(3001)

  exec('pnpm -F web dev')
  // Iniciar el servidor de API en modo test
  const serverProcess = exec('pnpm -F api dev -- --test')

  // Esperar a que el servidor arranque
  await waitForServerToStart(3001)

  return serverProcess
}

export default setupE2EEnvironment
