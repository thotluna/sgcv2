import { RegisterFormPage } from './page-objects/register-form.pom'
import { SingUpDTO } from '@/app/_auth/types'
import { waitFor, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

describe('Register Form Component', () => {
  it('displays all inputs', async () => {
    const mockOnSubmit = jest.fn()
    const page = new RegisterFormPage(mockOnSubmit)
    expect(page.codeInput).toBeInTheDocument()
    expect(page.emailInput).toBeInTheDocument()
    expect(page.passwordInput).toBeInTheDocument()
    expect(page.confirmPasswordInput).toBeInTheDocument()
    expect(page.submitButton).toBeInTheDocument()
  })
  it('displays validation errors when fields are empty', async () => {
    const mockOnSubmit = jest.fn()
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    await page.submitEmpty()

    expect(await page.getCodeError()).toBeInTheDocument()
    expect(await page.getEmailError()).toBeInTheDocument()
    const passwordErrors = await page.getPasswordError()
    expect(passwordErrors.length).toBeGreaterThanOrEqual(1)
    expect(passwordErrors[0]).toBeInTheDocument()
    expect(await page.getConfirmPasswordError()).toBeNull()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with valid data', async () => {
    const mockOnSubmit: jest.Mock<Promise<void>, [SingUpDTO]> = jest
      .fn()
      .mockResolvedValue(undefined)
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/customer_code/i)

    await page.fillAndSubmit(
      '1234',
      'test@example.com',
      'password123',
      'password123'
    )

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    })
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        code: '1234',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }),
      expect.anything()
    )
  })

  it('shows error for invalid email format', async () => {
    const mockOnSubmit = jest.fn()
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    await page.fillAndSubmit('1234', 'bademail', 'password123', 'password123')

    expect(await page.getEmailError()).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows error for password mismatch', async () => {
    const mockOnSubmit = jest.fn()
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    await page.fillAndSubmit(
      '1234',
      'test@example.com',
      'password123',
      'different'
    )

    expect(await page.getConfirmPasswordError()).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('renders with no accessibility violations', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    expect(await axe(page.element.container)).toHaveNoViolations()
  })
})
