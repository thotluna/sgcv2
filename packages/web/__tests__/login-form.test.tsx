import { LoginFormPage } from './page-objects/LoginFormPage'
import { cleanup } from '@testing-library/react'
import { act, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

// Register jest-axe matcher
expect.extend(toHaveNoViolations)

// Mock translations
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

afterEach(() => {
  cleanup()
})

describe('Login Form Component', () => {
  it('displays validation errors when fields are empty', async () => {
    const mockOnSubmit = jest.fn()
    const page = new LoginFormPage(mockOnSubmit)
    await page.submitEmpty()

    expect(await page.getEmailError()).toBeInTheDocument()
    expect(await page.getPasswordError()).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with valid email and password', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    const page = new LoginFormPage(mockOnSubmit)

    // Fill fields and submit within act
    await act(async () => {
      await page.fillAndSubmit('test@example.com', 'password123')
    })
    // Wait for onSubmit to be called
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1))
    expect(mockOnSubmit).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password123' },
      expect.anything(),
    )
  })

  it('calls onSubmit with valid email and password', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    const page = new LoginFormPage(mockOnSubmit)

    await waitFor(async () =>
      expect(await axe(page.container)).toHaveNoViolations(),
    )
  })
})
