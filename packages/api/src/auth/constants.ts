export const SUPABASE_URLs = {
  AUTHORIZATION: `${process.env.SUPABASE_URL}/auth/v1/authorize`,
  EXGHANGE: `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=pkce`,
} as const
