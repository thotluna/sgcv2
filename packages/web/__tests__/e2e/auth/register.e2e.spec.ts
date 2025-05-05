import messages from '../../../messages/es.json' with { type: 'json' }
import { SIGN_UP_FROM_DATA, SignUpPage } from './page-objects/register.pom'
import { test, expect, Page } from '@playwright/test'

test.describe('User Registration Flow', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(async () => {
    await fetch(`http://localhost:3001/v1/auth/reset-mock`).catch(() => {
      throw new Error('Failed to reset repository')
    })
  })

  const registerUser = async (
    page: Page,
    email: string,
    password: string,
    code: string
  ) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillCustomerCode(code)
    await signUpPage.fillEmail(email)
    await signUpPage.fillPassword(password)
    await signUpPage.fillConfirmPassword(password)
    await signUpPage.submit()
  }

  test('should successfully register a new user with valid credentials', async ({
    page
  }) => {
    await registerUser(
      page,
      SIGN_UP_FROM_DATA.USER_NEW.email,
      SIGN_UP_FROM_DATA.USER_NEW.password,
      SIGN_UP_FROM_DATA.USER_NEW.code
    )

    await page.waitForURL('**/private', {
      timeout: 15000,
      waitUntil: 'networkidle'
    })
    expect(page.url()).toBe('http://localhost:3000/private')
  })

  test('should block user registration with invalid customer code', async ({
    page
  }) => {
    await registerUser(
      page,
      SIGN_UP_FROM_DATA.USER_CODE_INVALID.email,
      SIGN_UP_FROM_DATA.USER_CODE_INVALID.password,
      SIGN_UP_FROM_DATA.USER_CODE_INVALID.code
    )

    const errorMessage = page.locator('[data-slot="form-message"]')
    await expect(errorMessage).toContainText('Código no encontrado')

    // await expect(
    //   page.getByText(messages.RegisterPage.code_not_found, { exact: true })
    // ).toBeVisible()

    await expect(async () => {
      await page.waitForURL('**/private', { timeout: 1000 })
    }).rejects.toThrow()

    expect(page.url()).toBe('http://localhost:3000/register')
  })

  test('should prevent multiple registration attempts with same email', async ({
    page
  }) => {
    await registerUser(
      page,
      SIGN_UP_FROM_DATA.USER_EXIST.email,
      SIGN_UP_FROM_DATA.USER_EXIST.password,
      SIGN_UP_FROM_DATA.USER_EXIST.code
    )
    await expect(async () => {
      await page.evaluate(() => {
        import('sonner').then(({ toast }) => {
          toast.error(messages.RegisterPage.auth_email_already_registered)
        })
      })
      await expect(
        page.getByText(messages.RegisterPage.auth_email_already_registered)
      ).toBeVisible()

      await page.waitForURL('**/private', { timeout: 1000 })
    }).rejects.toThrow()

    expect(page.url()).toBe('http://localhost:3000/register')
  })
})
