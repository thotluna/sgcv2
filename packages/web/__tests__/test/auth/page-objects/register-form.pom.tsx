import { SingUpForm } from '../../../../src/app/_auth/components/signup-form'
import { SingUpDTO } from '../../../../src/app/_auth/types'
import { render, screen, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'sonner'

type query =
  typeof import('/home/thot/projects/sgcv2/node_modules/.pnpm/@testing-library+dom@10.4.0/node_modules/@testing-library/dom/types/queries')

export class RegisterFormPage {
  element!: RenderResult<query, HTMLElement, HTMLElement>

  constructor(private mockOnSubmit: (data: SingUpDTO) => Promise<void>) {
    this.element = render(
      <article>
        <SingUpForm onSubmit={this.mockOnSubmit} />
        <Toaster richColors />
      </article>,
    )
  }

  get codeInput(): HTMLInputElement {
    return screen.getByLabelText(/code/i)
  }

  get emailInput(): HTMLInputElement {
    return screen.getByLabelText(/email/i)
  }

  get passwordInput(): HTMLInputElement {
    return screen.getByLabelText(/^password$/i, { selector: 'input' })
  }

  get confirmPasswordInput(): HTMLInputElement {
    return screen.getByLabelText(/confirm_password/i, { selector: 'input' })
  }

  get submitButton(): HTMLButtonElement {
    return screen.getByRole('button', { name: /submit/i })
  }

  async fillAndSubmit(
    code: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    const user = userEvent.setup()
    await user.clear(this.codeInput)
    await user.type(this.codeInput, code)
    await user.clear(this.emailInput)
    await user.type(this.emailInput, email)
    await user.clear(this.passwordInput)
    await user.type(this.passwordInput, password)
    await user.clear(this.confirmPasswordInput)
    await user.type(this.confirmPasswordInput, confirmPassword)
    await user.click(this.submitButton)
  }

  async submitEmpty(): Promise<void> {
    const user = userEvent.setup()
    await user.click(this.submitButton)
  }

  getCodeError() {
    return screen.findByText('customer_code_required')
  }

  getEmailError() {
    return screen.findByText('email_invalid')
  }

  getPasswordError() {
    return screen.findAllByText('password_min_length')
  }

  getConfirmPasswordError() {
    return screen.queryByText('password_not_match')
  }
}
