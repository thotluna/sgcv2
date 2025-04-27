import messages from '../../../../messages/es.json'
import { Page, expect } from '@playwright/test'

export class SignInPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3000')
  }

  async fillEmail(value: string) {
    await this.page.getByLabel(messages.SignPages.email).fill(value)
  }

  async fillPassword(value: string) {
    await this.page
      .getByLabel(messages.SignPages.password, { exact: true })
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
