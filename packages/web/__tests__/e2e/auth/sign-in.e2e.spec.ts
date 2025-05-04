import messages from '../../../messages/es.json' with { type: 'json' }
import { getCustomerCode, SignUpPage } from './page-objects/register.pom'
import { SignInPage } from './page-objects/sign-in.pom'
import { test, expect, Page } from '@playwright/test'

test.describe('User Login flow', () => {
  // test.describe.configure({ mode: 'serial' })

  const prepareTestUser = async (
    page: Page,
  ): Promise<{ email: string; password: string }> => {
    const signUpPage = new SignUpPage(page)
    const email = `test-${Date.now()}@example.com`
    const password = '123123123'
    const code = await getCustomerCode(email)

    await signUpPage.goto()
    await signUpPage.fillCustomerCode(code)
    await signUpPage.fillEmail(email)
    await signUpPage.fillPassword(password)
    await signUpPage.fillConfirmPassword(password)
    await signUpPage.submit()

    await page.waitForURL('**/private', {
      timeout: 15000,
      waitUntil: 'networkidle',
    })

    return { email, password }
  }

  test.beforeAll(async () => {
    await fetch(`http://localhost:3001/reset-mock`).catch(() => {
      throw new Error('Failed to reset repository')
    })
  })

  test('should successfully login a user with valid credentials', async ({
    page,
  }) => {
    const { email, password } = await prepareTestUser(page)

    const signInPage = new SignInPage(page)
    await signInPage.goto()

    await signInPage.fillForm(email, password)

    await page.waitForURL('**/private', {
      timeout: 20000,
      waitUntil: 'networkidle',
    })

    expect(page.url()).toBe('http://localhost:3000/private')
  })

  test('should block user login with unregistered email', async ({ page }) => {
    const signInPage = new SignInPage(page)
    await signInPage.goto()
    expect(page.url()).toBe('http://localhost:3000/login')
    const email = 'unregistered@example.com'

    await signInPage.fillForm(email, '12121212')

    await expect(
      page.getByText(messages.validation.invalid_credentials),
    ).toBeVisible({
      timeout: 5000,
    })

    expect(page.url()).toBe('http://localhost:3000/login')
  })

  test('should block user login with incorrect password', async ({ page }) => {
    const { email } = await prepareTestUser(page)

    const signInPage = new SignInPage(page)
    await signInPage.goto()

    await signInPage.fillForm(email, 'wrongpassword')

    await expect(
      page.getByText(messages.validation.invalid_credentials),
    ).toBeVisible({
      timeout: 5000,
    })

    expect(page.url()).toBe('http://localhost:3000/login')
  })
})
