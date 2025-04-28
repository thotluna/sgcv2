import { generateCodeChallenge, generatePKCEParams } from '@utils'

describe('oauth functions test', () => {
  test('should be return codeVerifier with length between 43 and 128', async () => {
    const { codeVerifier } = await generatePKCEParams()
    expect(codeVerifier.length).toBeGreaterThanOrEqual(43)
    expect(codeVerifier.length).toBeLessThanOrEqual(128)
  })

  test('should be return object with codeChallengue and codeVerify', async () => {
    const codes = await generatePKCEParams()
    expect(codes).toHaveProperty('codeVerifier')
    expect(codes).toHaveProperty('codeChallenge')
  })

  test('should be codeChallengue equalt codeVerify encode crypto ', async () => {
    const { codeChallenge, codeVerifier } = await generatePKCEParams()
    expect(codeChallenge).toEqual(await generateCodeChallenge(codeVerifier))
  })
})
