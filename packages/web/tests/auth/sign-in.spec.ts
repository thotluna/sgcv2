import test, { expect } from '@playwright/test'

const unregisteredCredentials = {
  email: 'test@sample.com',
  password: '123456789',
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

test.describe('has error', () => {
  test('has error email', async ({ page }) => {
    await page.getByLabel('Email').fill('test@')
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(page.getByText('El email no es valido')).toBeVisible()
  })

  test('has error email empty', async ({ page }) => {
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(page.getByText('El email no es valido')).toBeVisible()
  })

  test('has error password', async ({ page }) => {
    // await page.locator('input[name="password"]').fill('123');
    await page.getByLabel('Password', { exact: true }).fill('123')
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('has error password empty', async ({ page }) => {
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('has error intent sign in without client code registered', async ({
    page,
  }) => {
    await page.getByLabel('Email').fill(unregisteredCredentials.email)
    await page
      .getByLabel('Password', { exact: true })
      .fill(unregisteredCredentials.password)
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('El email o la contraseña no son validos'),
    ).toBeVisible()
  })
})
