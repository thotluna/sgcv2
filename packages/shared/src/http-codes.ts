export const HTTP_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const
export type HttpCodeType = (typeof HTTP_CODE)[keyof typeof HTTP_CODE]
