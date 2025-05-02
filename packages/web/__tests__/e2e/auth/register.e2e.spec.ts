import { SignUpPage } from './page-objects/register.pom'
import test from '@playwright/test'
import { expect } from '@playwright/test'

async function getCustomerCode(email: string) {
  const body = await fetch(`http://localhost:3001/v1/auth/customer-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
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
      token: [data],
    },
  } = body

  return data.code
}

test.beforeEach(async () => {
  await fetch(`http://localhost:3001/reset-mock`).catch(() => {
    throw new Error('Failed to reset repository')
  })
})

test('happy path', async ({ page }) => {
  const email = 'test@example.com'
  const code = await getCustomerCode(email)
  const signUpPage = new SignUpPage(page)
  await signUpPage.goto()
  await signUpPage.fillCustomerCode(code)
  await signUpPage.fillEmail(email)
  await signUpPage.fillPassword('123456789')
  await signUpPage.fillConfirmPassword('123456789')
  await signUpPage.submit()

  // Esperar navegación con más tiempo y detalles
  await page.waitForURL('**/private', {
    timeout: 15000,
    waitUntil: 'networkidle',
  })
  expect(page.url()).toBe('http://localhost:3000/private')
})
