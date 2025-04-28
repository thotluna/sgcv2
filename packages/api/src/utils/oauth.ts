import crypto from 'crypto'

// Función para generar una cadena aleatoria (code_verifier)
function generateCodeVerifier() {
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const longitud = Math.floor(Math.random() * (128 - 43 + 1)) + 43 // Entre 43 y 128
  let codeVerifier = ''
  for (let i = 0; i < longitud; i++) {
    codeVerifier += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length),
    )
  }
  return codeVerifier
}

// Función para calcular el code_challenge (SHA256)
export async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hash = crypto.createHash('sha256')
  hash.update(data)
  const digest = hash.digest('base64')
  // Replace characters according to the base64url standard
  const codeChallenge = digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return codeChallenge
}

// Ejemplo de uso
export async function generatePKCEParams() {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  return {
    codeVerifier,
    codeChallenge,
  }
}
