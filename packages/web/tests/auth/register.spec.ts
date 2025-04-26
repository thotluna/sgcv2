import { CUSTOMER_CODE } from '../mocks/handlers/auth'
import { server } from '../mocks/server'
import test, { expect } from '@playwright/test'

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

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create/)
})

test.describe('has error validation', () => {
  test('Given a badly formatted code, then it returns error JWT malformed', async ({
    page,
  }) => {
    await page
      .getByLabel('Código de cliente')
      .fill(CUSTOMER_CODE.CODE_NOT_FORMATTED)
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(page.getByText('Error en el formato jwt')).toBeVisible()
  })

  test('given an empty code, then return error code required', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(page.getByText('Se requiere codigo de cliente')).toBeVisible()
  })

  test('Given a bandly format email, then it returns error email invalid', async ({
    page,
  }) => {
    await page.getByLabel('Correo electrónico').fill('test@')
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(page.getByText('El email no es valido')).toBeVisible()
  })

  test('given an empty email, then return error email required', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(page.getByText('El email no es valido')).toBeVisible()
  })

  test('Given a bandly format password, then it returns error password invalid', async ({
    page,
  }) => {
    await page.getByLabel('Contraseña', { exact: true }).fill('123')
    await page.getByLabel('Confirmar contraseña').fill('123456789')
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('given an empty password, then return error password required', async ({
    page,
  }) => {
    await page.getByLabel('Confirmar contraseña').fill('123456789')
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('Given a bandly format confirm password, then it returns error confirm password invalid', async ({
    page,
  }) => {
    await page.getByLabel('Contraseña', { exact: true }).fill('123456789')
    await page.getByLabel('Confirmar contraseña').fill('123')
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('given an empty confirm password, then return error confirm password required', async ({
    page,
  }) => {
    await page.getByLabel('Contraseña', { exact: true }).fill('12345678')
    await page.getByLabel('Confirmar contraseña').fill('123456789')
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(
      page.getByText('Las contraseñas no coinciden', {}),
    ).toBeVisible()
  })
})
