import './jest.env'
import '@testing-library/jest-dom'
import { ReactNode } from 'react'

// Suppress React act environment warnings
const _origConsoleError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string') {
    const msg: string = args[0]
    if (
      msg.includes(
        'The current testing environment is not configured to support act',
      ) ||
      msg.includes('not wrapped in act')
    ) {
      return
    }
  }
  _origConsoleError(...args)
}

// Mock next-intl ESM module globally to avoid transform issues
jest.mock('next-intl', () => ({
  useTranslations: (): ((key: string) => string) => (key: string) => key,
  useFormatter: (): ((value: unknown) => unknown) => (value: unknown) => value,
  NextIntlClientProvider: ({ children }: { children: ReactNode }): ReactNode =>
    children,
}))
