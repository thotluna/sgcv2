import { rest } from 'msw'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export const CUSTOMER_CODE = {
  CODE_NOT_FORMATTED: '123456',
  CODE_NOT_FOUND: '123456',
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

    // console.log('correcto msw')

    return res(
      ctx.status(200),
      ctx.json({
        data: code,
        status: 'success',
        code: 200,
      }),
    )
  }),
]
