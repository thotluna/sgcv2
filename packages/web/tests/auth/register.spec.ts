import test, { expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/?singUp=true')
})

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create/)
})

test.describe('has error validation', () => {
  test('has error client code', async ({ page }) => {
    await page.getByLabel('Codigo de cliente').fill('12345678')
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('Codigo de cliente tiene un formato invalido'),
    ).toBeVisible()
  })

  test('has error client code empty', async ({ page }) => {
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('Codigo de cliente tiene un formato invalido'),
    ).toBeVisible()
  })

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
    await page.getByLabel('password').fill('123')
    await page.getByLabel('Confirma la Contraseña').fill('123456789')
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('has error password empty', async ({ page }) => {
    await page.getByLabel('Confirma la Contraseña').fill('123456789')
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('has error confirm password', async ({ page }) => {
    // await page.locator('input[name="password"]').fill('123');
    await page.getByLabel('password').fill('123456789')
    await page.getByLabel('Confirma la Contraseña').fill('123')
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('has error confirm password empty', async ({ page }) => {
    await page.getByLabel('password').fill('12345678')
    await page.getByLabel('Confirma la Contraseña').fill('123456789')
    await page.getByRole('button', { name: 'submit' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })
})
