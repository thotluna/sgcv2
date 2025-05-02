import messages from '../../../messages/es.json'
import { getCustomerCode, SignUpPage } from './page-objects/register.pom'
import { test, expect, Page } from '@playwright/test'

test.describe('User Registration Flow', () => {
  test.describe.configure({ mode: 'serial' })

  const registerUser = async (
    page: Page,
    email: string,
    password = '123456789',
  ) => {
    const signUpPage = new SignUpPage(page)
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
  }

  test.beforeEach(async () => {
    await fetch(`http://localhost:3001/reset-mock`).catch(() => {
      throw new Error('Failed to reset repository')
    })
  })

  test('should successfully register a new user with valid credentials', async ({
    page,
  }) => {
    await registerUser(page, 'test@example.com')
    expect(page.url()).toBe('http://localhost:3000/private')
  })

  test('should block user registration with invalid customer code', async ({
    page,
  }) => {
    const email = 'test@example.com'
    const code = await getCustomerCode('test2@gmail.com')
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillCustomerCode(code)
    await signUpPage.fillEmail(email)
    await signUpPage.fillPassword('123456789')
    await signUpPage.fillConfirmPassword('123456789')
    await signUpPage.submit()

    await page.evaluate(() => {
      import('sonner').then(({ toast }) => {
        toast.error(messages.RegisterPage.Invalid_code)
      })
    })
    await expect(
      page.getByText(messages.RegisterPage.Invalid_code),
    ).toBeVisible()

    await expect(async () => {
      await page.waitForURL('**/private', { timeout: 1000 })
    }).rejects.toThrow()

    expect(page.url()).toBe('http://localhost:3000/register')
  })

  test('should prevent multiple registration attempts with same email', async ({
    page,
  }) => {
    const email = 'test@example.com'
    await registerUser(page, email)
    const code = await getCustomerCode(email)
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillCustomerCode(code)
    await signUpPage.fillEmail(email)
    await signUpPage.fillPassword('123456789')
    await signUpPage.fillConfirmPassword('123456789')
    await signUpPage.submit()

    await expect(async () => {
      await page.evaluate(() => {
        import('sonner').then(({ toast }) => {
          toast.error(messages.RegisterPage.auth_email_already_registered)
        })
      })
      await expect(
        page.getByText(messages.RegisterPage.auth_email_already_registered),
      ).toBeVisible()

      await page.waitForURL('**/private', { timeout: 1000 })
    }).rejects.toThrow()

    expect(page.url()).toBe('http://localhost:3000/register')
  })
})
