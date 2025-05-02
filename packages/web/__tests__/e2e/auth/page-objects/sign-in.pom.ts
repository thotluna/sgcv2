import messages from '../../../../messages/es.json'
import { Page, expect } from '@playwright/test'

export class SignInPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3000/login')
  }

  async fillEmail(value: string) {
    const mail = this.page.getByLabel(messages.SignPages.email)
    await mail.focus()
    await mail.fill(value)
  }

  async fillPassword(value: string) {
    const passwordInput = this.page.getByLabel(messages.SignPages.password, {
      exact: true,
    })
    await passwordInput.focus()
    await passwordInput.fill(value)
  }

  async submit() {
    await this.page
      .getByRole('button', { name: messages.SignPages.submit })
      .click()
  }

  async fillForm(email: string, password: string) {
    await this.fillEmail(email)
    await this.fillPassword(password)

    await this.submit()
  }

  async expectErrorValidation(key: keyof typeof messages.validation) {
    await expect(this.page.getByText(messages.validation[key])).toBeVisible()
  }
}
