import { SingInForm } from '../../src/app/_auth/components/signin-form'
import { SingInDTO } from '../../src/app/_auth/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export class LoginFormPage {
  container: Element

  constructor(
    private mockOnSubmit: (data: SingInDTO, event?: unknown) => Promise<void>,
  ) {
    this.container = render(
      <SingInForm onSubmit={this.mockOnSubmit} />,
    ).container
  }

  get emailInput(): HTMLInputElement {
    return screen.getByLabelText(/email/i)
  }

  get passwordInput(): HTMLInputElement {
    return screen.getByLabelText(/password/i, { selector: 'input' })
  }

  get submitButton() {
    return screen.getByRole('button', { name: /submit/i })
  }

  async submitEmpty(): Promise<void> {
    const user = userEvent.setup()
    await user.click(this.submitButton)
  }

  async fillAndSubmit(email: string, password: string): Promise<void> {
    const user = userEvent.setup()
    await user.clear(this.emailInput)
    await user.type(this.emailInput, email)
    await user.clear(this.passwordInput)
    await user.type(this.passwordInput, password)
    await user.click(this.submitButton)
  }

  getEmailError() {
    return screen.findByText('email_invalid')
  }

  getPasswordError() {
    return screen.findByText('password_min_length')
  }
}
