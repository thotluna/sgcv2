import { CUSTOMER_CODE } from '../mocks/handlers/auth'
import { server } from '../mocks/server'
import { factory } from '../utils'
import test, { expect } from '@playwright/test'

const transCommon = factory('SignPages')
const transSignUp = factory('RegisterPage')
const transValidation = factory('validation')

test.beforeAll(() => {
  server.listen()
})

test.afterAll(() => {
  server.close()
})

test.beforeEach(async ({ page }) => {
  server.resetHandlers()
  await page.goto('http:/localhost:3000/register')
})

test('should display registration page title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create/)
})

test.describe('Registration form validation errors', () => {
  test('should show JWT malformed error for badly formatted customer code', async ({
    page,
  }) => {
    await page
      .getByLabel(transSignUp('customer_code'))
      .fill(CUSTOMER_CODE.CODE_NOT_FORMATTED)
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(page.getByText(transSignUp('jwt malformed'))).toBeVisible()
  })

  test('should show code required error when customer code is empty', async ({
    page,
  }) => {
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transValidation('customer_code_required')),
    ).toBeVisible()
  })

  test('should show email invalid error for badly formatted email', async ({
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
    await page.getByLabel(transSignUp('confirm_password')).fill('123456789')
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transValidation('password_min_length')),
    ).toBeVisible()
  })

  test('should show password required error when password is empty', async ({
    page,
  }) => {
    await page.getByLabel(transSignUp('confirm_password')).fill('123456789')
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transValidation('password_min_length')),
    ).toBeVisible()
  })

  test('should show confirm password invalid error for mismatched passwords', async ({
    page,
  }) => {
    await page
      .getByLabel(transCommon('password'), { exact: true })
      .fill('123456789')
    await page.getByLabel(transSignUp('confirm_password')).fill('123')
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transValidation('password_min_length')),
    ).toBeVisible()
  })

  test('should show confirm password required error when confirmation is empty', async ({
    page,
  }) => {
    await page
      .getByLabel(transCommon('password'), { exact: true })
      .fill('12345678')
    await page.getByLabel(transSignUp('confirm_password')).fill('123456789')
    await page.getByRole('button', { name: transCommon('submit') }).click()

    await expect(
      page.getByText(transValidation('password_not_match')),
    ).toBeVisible()
  })
})
