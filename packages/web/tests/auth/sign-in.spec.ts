import { factory } from '../utils'
import test, { expect } from '@playwright/test'

const unregisteredCredentials = {
  email: 'test@sample.com',
  password: '123456789',
}

const transCommon = factory('SignPages')
const transSignIn = factory('SignInPage')
const transValidation = factory('validation')

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

test.describe('Sign-in form validation errors', () => {
  test('should show invalid email error for malformed email', async ({
    page,
  }) => {
    await page.getByLabel(transCommon('email')).fill('test@')
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(page.getByText(transValidation('email_invalid'))).toBeVisible()
  })

  test('should show email required error when email is empty', async ({
    page,
  }) => {
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(page.getByText(transValidation('email_invalid'))).toBeVisible()
  })

  test('should show password invalid error for short password', async ({
    page,
  }) => {
    await page.getByLabel(transCommon('password'), { exact: true }).fill('123')
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transValidation('password_min_length')),
    ).toBeVisible()
  })

  test('should show password required error when password is empty', async ({
    page,
  }) => {
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transValidation('password_min_length')),
    ).toBeVisible()
  })

  test('should show invalid credentials error for unregistered user', async ({
    page,
  }) => {
    await page
      .getByLabel(transCommon('email'))
      .fill(unregisteredCredentials.email)
    await page
      .getByLabel(transCommon('password'), { exact: true })
      .fill(unregisteredCredentials.password)
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transSignIn('credential_invalid')),
    ).toBeVisible()
  })
})
