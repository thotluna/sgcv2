import { rest } from 'msw'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export const handlers = [
  rest.post(`${BASE_URL}/code/validate`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        data: 1231,
        code: 200,
      }),
    )
  }),
]
