import { LoginFormPage } from './page-objects/login-form.pom'
import { cleanup } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

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
    const mockOnSubmit: jest.Mock<
      Promise<void>,
      [{ email: string; password: string }]
    > = jest.fn().mockResolvedValue(undefined)
    const page = new LoginFormPage(mockOnSubmit)

    // Fill fields and submit within act
    await waitFor(async () => {
      await page.fillAndSubmit('test@example.com', 'password123')
    })
    // Wait for onSubmit to be called
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1))
    expect(mockOnSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
      }),
    )
  })

  it('renders with no accessibility violations', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    const page = new LoginFormPage(mockOnSubmit)

    await waitFor(async () =>
      expect(await axe(page.element.container)).toHaveNoViolations(),
    )
  })

  it('shows error for invalid email format', async () => {
    const mockOnSubmit = jest.fn()
    const page = new LoginFormPage(mockOnSubmit)
    await waitFor(async () => {
      await page.fillAndSubmit('foo', 'password123')
    })
    expect(await page.getEmailError()).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows error for too short password', async () => {
    const mockOnSubmit = jest.fn()
    const page = new LoginFormPage(mockOnSubmit)
    await waitFor(async () => {
      await page.fillAndSubmit('test@example.com', '123')
    })
    expect(await page.getPasswordError()).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('disables submit button while onSubmit is pending', async () => {
    let resolvePromise: () => void
    const mockOnSubmit = jest.fn(
      () =>
        new Promise<void>(res => {
          resolvePromise = res
        }),
    )
    const page = new LoginFormPage(mockOnSubmit)
    // Trigger form submission
    await waitFor(async () => {
      await page.fillAndSubmit('test@example.com', 'password123')
    })
    // Button disabled while pending
    await waitFor(() => expect(page.submitButton).toHaveAttribute('disabled'))
    // Resolve onSubmit
    await waitFor(async () => resolvePromise!())
    // Button enabled after resolution
    await waitFor(() =>
      expect(page.submitButton).not.toHaveAttribute('disabled'),
    )
  })
})
