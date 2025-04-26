import { CUSTOMER_CODE } from '../mocks/handlers/auth'
import { SignUpPage } from './register.pom'
import test from '@playwright/test'

test.describe('Registration form validation errors', () => {
  test('should show JWT malformed error for badly formatted customer code', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillCustomerCode(CUSTOMER_CODE.CODE_NOT_FORMATTED)
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('jwt malformed')
  })

  test('should show code required error when customer code is empty', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('customer_code_required')
  })

  test('should show email invalid error for badly formatted email', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillEmail('test@')
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('email_invalid')
  })

  test('should show email required error when email is empty', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('email_invalid')
  })

  test('should show password invalid error for short password', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillPassword('123')
    await signUpPage.fillConfirmPassword('123456789')
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('password_min_length')
  })

  test('should show password required error when password is empty', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillConfirmPassword('123456789')
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('password_min_length')
  })

  test('should show confirm password invalid error for mismatched passwords', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillPassword('1234567890')
    await signUpPage.fillConfirmPassword('123456789')
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('password_not_match')
  })

  test('should show confirm password required error when confirmation is empty', async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()
    await signUpPage.fillPassword('123456789')
    await signUpPage.submit()
    await signUpPage.expectErrorValidation('password_min_length')
  })
})
