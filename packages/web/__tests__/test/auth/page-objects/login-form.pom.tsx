import { SingInForm } from '../../../../src/app/(sign)/login/signin-form'
import { SingInDTO } from '../../../../src/app/_auth/types'
import { render, screen, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'sonner'

export class LoginFormPage {
  element!: RenderResult<
    typeof import('/home/thot/projects/sgcv2/node_modules/.pnpm/@testing-library+dom@10.4.0/node_modules/@testing-library/dom/types/queries'),
    HTMLElement,
    HTMLElement
  >

  constructor(private mockOnSubmit: (data: SingInDTO) => Promise<void>) {
    this.element = render(
      <article>
        <SingInForm onSubmit={this.mockOnSubmit} />
        <Toaster richColors />
      </article>
    )
  }

  get emailInput(): HTMLInputElement {
    return screen.getByLabelText(/email/i)
  }

  get passwordInput(): HTMLInputElement {
    return screen.getByLabelText(/password/i, { selector: 'input' })
  }

  get submitButton(): HTMLButtonElement {
    return screen.getByRole('button', { name: /submit/i })
  }

  async submitEmpty(): Promise<void> {
    const user = userEvent.setup()
    user.click(this.submitButton)
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

  getCredentialInvalid() {
    return screen.findByText('credential_invalid')
  }
}
