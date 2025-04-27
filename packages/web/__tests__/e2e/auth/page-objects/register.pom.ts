import messages from '../../../../messages/es.json'
import { Page, expect } from '@playwright/test'

export class SignUpPage {
  constructor(private page: Page) {}
  async goto() {
    await this.page.goto('http://localhost:3000/register')
  }
  async fillCustomerCode(value: string) {
    await this.page.getByLabel(messages.RegisterPage.customer_code).fill(value)
  }
  async fillEmail(value: string) {
    await this.page.getByLabel(messages.SignPages.email).fill(value)
  }
  async fillPassword(value: string) {
    await this.page
      .getByLabel(messages.SignPages.password, { exact: true })
      .fill(value)
  }
  async fillConfirmPassword(value: string) {
    await this.page
      .getByLabel(messages.RegisterPage.confirm_password)
      .fill(value)
  }
  async submit() {
    await this.page
      .getByRole('button', { name: messages.SignPages.submit })
      .click()
  }
  async expectErrorValidation(key: keyof typeof messages.validation) {
    await expect(this.page.getByText(messages.validation[key])).toBeVisible()
  }
}
