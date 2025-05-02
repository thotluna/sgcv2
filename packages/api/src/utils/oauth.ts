import crypto from 'crypto'

function generateCodeVerifier() {
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const longitud = Math.floor(Math.random() * (128 - 43 + 1)) + 43

  let codeVerifier = ''
  for (let i = 0; i < longitud; i++) {
    codeVerifier += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length),
    )
  }
  return codeVerifier
}
export async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hash = crypto.createHash('sha256')
  hash.update(data)
  const digest = hash.digest('base64')
  const codeChallenge = digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return codeChallenge
}
export async function generatePKCEParams() {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  return {
    codeVerifier,
    codeChallenge,
  }
}
