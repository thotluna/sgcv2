import { SupabaseAuthRepository } from '../auth.supabase.repository'
import { DBErrorConexion } from '../errors'
import { createClient } from '@supabase/supabase-js'

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}))

describe('SupabaseAuthRepository.validateCodeClient', () => {
  let repo: SupabaseAuthRepository

  const mockClient: any = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    single: jest.fn(),
  }

  beforeAll(() => {
    ;(createClient as jest.Mock).mockReturnValue(mockClient)
    repo = new SupabaseAuthRepository()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('resuelve true cuando no hay error', async () => {
    mockClient.single.mockResolvedValue({ error: null })
    await expect(repo.validateCustomerCode('test')).resolves.toBe(true)
  })

  it('lanza DBErrorConexion("db_conexion_error") en caso de error genérico', async () => {
    mockClient.single.mockResolvedValue({ error: { message: 'otra falla' } })
    await expect(repo.validateCustomerCode('test')).rejects.toThrow(
      new DBErrorConexion('db_conexion_error'),
    )
  })
})
