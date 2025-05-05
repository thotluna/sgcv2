import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'

export const NEXT_LOCALE = 'NEXT_LOCALE'
export async function getLanguageFromCookies(
  cookieStore: ReturnType<typeof cookies> | ReadonlyRequestCookies
): Promise<string> {
  const cookiesValue = await cookieStore
  return cookiesValue.get(NEXT_LOCALE)?.value || 'es'
}
