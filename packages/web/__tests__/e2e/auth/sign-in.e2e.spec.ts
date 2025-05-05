import messages from '../../../messages/es.json' with { type: 'json' }
import { SIGN_UP_FROM_DATA } from './page-objects/register.pom'
import { SignInPage } from './page-objects/sign-in.pom'
import { test, expect, Page } from '@playwright/test'

test.describe('User Login flow', () => {
  // test.describe.configure({ mode: 'serial' })

  const prepareTestUser = async (
    page: Page,
    email: string,
    password: string
  ) => {
    const signInPage = new SignInPage(page)
    await signInPage.goto()
    await signInPage.fillEmail(email)
    await signInPage.fillPassword(password)
    await signInPage.submit()
  }

  test('should successfully login a user with valid credentials', async ({
    page
  }) => {
    const { email, password } = SIGN_UP_FROM_DATA.USER_NEW
    await prepareTestUser(page, email, password)

    await page.waitForURL('**/private', {
      timeout: 20000,
      waitUntil: 'networkidle'
    })

    expect(page.url()).toBe('http://localhost:3000/private')
  })

  test('should block user login with unregistered email', async ({ page }) => {
    await prepareTestUser(page, 'unregistered@gmail.com', '123123123')

    await expect(
      page.getByText(messages.validation.invalid_credentials)
    ).toBeVisible({
      timeout: 5000
    })

    expect(page.url()).toBe('http://localhost:3000/login')
  })

  test('should block user login with incorrect password', async ({ page }) => {
    const { email } = SIGN_UP_FROM_DATA.USER_NEW
    await prepareTestUser(page, email, '987654321')

    await expect(
      page.getByText(messages.validation.invalid_credentials)
    ).toBeVisible({
      timeout: 5000
    })

    expect(page.url()).toBe('http://localhost:3000/login')
  })
})
