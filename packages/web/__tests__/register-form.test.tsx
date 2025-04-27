import { server } from './msw/server'
import { RegisterFormPage } from './page-objects/RegisterFormPage'
import { cleanup, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

process.env.NEXT_PUBLIC_URL_API = 'http://localhost'

expect.extend(toHaveNoViolations)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

afterEach(() => {
  cleanup()
})

describe('Register Form Component', () => {
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
    const mockOnSubmit: jest.Mock<
      Promise<void>,
      [
        {
          code: string
          email: string
          password: string
          confirmPassword: string
        },
      ]
    > = jest.fn().mockResolvedValue(undefined)
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    await waitFor(async () => {
      await page.fillAndSubmit(
        '1234',
        'test@example.com',
        'password123',
        'password123',
      )
    })
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1))
    expect(mockOnSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        code: '1234',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    )
  })

  it('shows error for invalid email format', async () => {
    const mockOnSubmit = jest.fn()
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    await waitFor(async () => {
      await page.fillAndSubmit('1234', 'bademail', 'password123', 'password123')
    })
    expect(await page.getEmailError()).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows error for password mismatch', async () => {
    const mockOnSubmit = jest.fn()
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    await waitFor(async () => {
      await page.fillAndSubmit(
        '1234',
        'test@example.com',
        'password123',
        'different',
      )
    })

    expect(await page.getConfirmPasswordError()).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('renders with no accessibility violations', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    const page = new RegisterFormPage(mockOnSubmit)
    await screen.findByLabelText(/code/i)
    await waitFor(async () =>
      expect(await axe(page.element.container)).toHaveNoViolations(),
    )
  })
})
