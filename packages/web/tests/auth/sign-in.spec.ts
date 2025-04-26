import test, { expect } from '@playwright/test'

const unregisteredCredentials = {
  email: 'test@sample.com',
  password: '123456789',
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

test.describe('has error', () => {
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
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('given an empty password, then return error password required', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres', {}),
    ).toBeVisible()
  })

  test('Given email and password not registered, then returns invalid credentials', async ({
    page,
  }) => {
    await page
      .getByLabel('Correo electrónico')
      .fill(unregisteredCredentials.email)
    await page
      .getByLabel('Contraseña', { exact: true })
      .fill(unregisteredCredentials.password)
    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(
      page.getByText('El email o la contraseña no son validos'),
    ).toBeVisible()
  })
})
