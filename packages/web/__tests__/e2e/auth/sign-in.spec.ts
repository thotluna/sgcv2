import { SignInPage } from './page-objects/sign-in.pom'
import { test } from '@playwright/test'

const unregisteredCredentials = {
  email: 'test@sample.com',
  password: '123456789',
}

test.beforeEach(async ({ page }) => {
  const signIn = new SignInPage(page)
  await signIn.goto()
})

test.describe('Sign-in form validation errors', () => {
  test('should show invalid email error for malformed email', async ({
    page,
  }) => {
    const signIn = new SignInPage(page)
    await signIn.fillEmail('test@')
    await signIn.submit()
    await signIn.expectErrorValidation('email_invalid')
  })

  test('should show email required error when email is empty', async ({
    page,
  }) => {
    const signIn = new SignInPage(page)
    await signIn.submit()
    await signIn.expectErrorValidation('email_invalid')
  })

  test('should show password invalid error for short password', async ({
    page,
  }) => {
    const signIn = new SignInPage(page)
    await signIn.fillPassword('123')
    await signIn.submit()
    await signIn.expectErrorValidation('password_min_length')
  })

  test('should show password required error when password is empty', async ({
    page,
  }) => {
    const signIn = new SignInPage(page)
    await signIn.submit()
    await signIn.expectErrorValidation('password_min_length')
  })

  test('should show invalid credentials error for unregistered user', async ({
    page,
  }) => {
    const signIn = new SignInPage(page)
    await signIn.fillEmail(unregisteredCredentials.email)
    await signIn.fillPassword(unregisteredCredentials.password)
    await signIn.submit()
    await signIn.expectErrorValidation('credential_invalid')
  })
})
