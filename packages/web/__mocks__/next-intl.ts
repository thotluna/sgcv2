import { ReactNode } from 'react'

export function useTranslations() {
  return (key: string): string => key
}

export function useFormatter() {
  return (value: unknown): unknown => value
}

export function NextIntlClientProvider({
  children,
}: {
  children: ReactNode
}): ReactNode {
  return children
}
