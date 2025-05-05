import messages from '../../../../messages/es.json'
import { Page, expect } from '@playwright/test'

export const SIGN_UP_FROM_DATA = {
  USER_EXIST: {
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImV4aXN0ZW5AZ21haWwuY29tIiwiZW1haWwiOiJleGlzdGVuQGdtYWlsLmNvbSIsImlhdCI6MTc0NjM5MzkwMCwiZXhwIjoxNzc3OTUxNTAwfQ.GGXWbelQAimIPdnU8PQBrhiKXCo0mmlO9j5CeXrKDts',
    email: 'existen@gmail.com',
    password: '123456789'
  },
  USER_NEW: {
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTM5NjksImV4cCI6MTc3Nzk1MTU2OX0.8cwDEHFS4w92L9ckeOf1ql3IeI0-2WsEa0x8M1NILD0',
    email: 'new@gmail.com',
    password: '123456789'
  },
  USER_CODE_INVALID: {
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTQ4MjEsImV4cCI6MTc3Nzk1MjQyMX0.TzZ_qUppFsVLJMv5VqHGOgICwS3czdr3wj_UYAVbrUA',
    email: 'new@gmail.com',
    password: '123456789'
  }
}

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

  async getButtonSubmit() {
    return await this.page.getByRole('button', {
      name: messages.SignPages.submit
    })
  }

  async submit() {
    await this.page
      .getByRole('button', { name: messages.SignPages.submit })
      .click()
  }
  async expectErrorValidation(key: keyof typeof messages.validation) {
    await expect(this.page.getByText(messages.validation[key])).toBeVisible()
  }

  async registerUser(otherMail?: string) {
    const email = otherMail || 'test@example.com'
    const code = await getCustomerCode(email)

    this.goto()
    this.fillCustomerCode(code)
    this.fillEmail(email)
    this.fillPassword('123456789')
    this.fillConfirmPassword('123456789')
    this.submit()
    await this.page.waitForURL('**/private', {
      timeout: 15000,
      waitUntil: 'networkidle'
    })
  }

  async expectMessageError(msg: string) {
    const msgTraslate =
      messages.RegisterPage[msg as keyof typeof messages.RegisterPage]
    await this.page.evaluate(() => {
      import('sonner').then(({ toast }) => {
        toast.error(msgTraslate)
      })
    })
    await expect(this.page.getByText(msgTraslate)).toBeVisible()
  }
}

export async function getCustomerCode(email: string) {
  const body = await fetch(`http://localhost:3001/v1/auth/customer-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  })
    .then(res => res.json())
    .catch(() => {
      throw new Error('Failed to get customer code')
    })

  if (body.status !== 'success') {
    throw new Error('Failed to get customer code')
  }
  const {
    data: {
      token: [data]
    }
  } = body

  return data.code
}
