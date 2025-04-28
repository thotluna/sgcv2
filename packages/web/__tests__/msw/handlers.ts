import { UserResponse } from '@/app/_auth/types'
import { rest } from 'msw'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export const CUSTOMER_CODE = {
  CODE_NOT_FORMATTED: 'no_format',
  CODE_NOT_FOUND: 'not_found',
} as const

export const handlers = [
  rest.post(`${BASE_URL}/code/validate`, async (req, res, ctx) => {
    const body = await req.json()
    const code = body.code

    // Bad request
    if (!code) {
      // console.log('bad request msw')

      return res(
        ctx.status(400),
        ctx.json({
          status: 'error',
          message: 'Se requiere codigo de cliente ***',
          code: 400,
          metadata: null,
        }),
      )
    }

    //JWT Malformed
    if (code === CUSTOMER_CODE.CODE_NOT_FORMATTED) {
      // console.log('jwt malformed msw')

      return res(
        ctx.status(400),
        ctx.json({
          status: 'error',
          message: 'Error en el formato jwt',
          code: 400,
          metadata: null,
        }),
      )
    }

    // JWT Invalid
    if (code === CUSTOMER_CODE.CODE_NOT_FOUND) {
      // console.log('jwt invalid msw')

      return res(
        ctx.status(400),
        ctx.json({
          status: 'error',
          message: 'Codigo no encontrado.',
          code: 400,
          metadata: null,
        }),
      )
    }

    console.log('correcto msw')

    return res(
      ctx.status(200),
      ctx.json({
        data: code,
        status: 'success',
        code: 200,
      }),
    )
  }),

  rest.post(`${BASE_URL}/sign-up`, async (req, res, ctx) => {
    const body = await req.json()
    const { email, password, code } = body

    if (!code || !email || !password) {
      return res(
        ctx.status(400),
        ctx.json({
          status: 'error',
          message: 'Se requieren email, password y codigo de cliente',
          code: 400,
          metadata: null,
        }),
      )
    }

    const data: UserResponse = {
      user: {
        id: '1',
        email,
        created_at: new Date().toISOString(),
        role: 'user',
      },
      session: {
        access_token: '123456789',
        refresh_token: '123456789',
        expires_in: 3600,
        expires_at: new Date().getTime() + 3600000,
        token_type: 'Bearer',
        user: {
          id: '1',
          email,
          created_at: new Date().toISOString(),
          role: 'user',
        },
      },
    }

    return res(
      ctx.status(200),
      ctx.json({
        data,
        status: 'success',
        code: 200,
      }),
    )
  }),
]
