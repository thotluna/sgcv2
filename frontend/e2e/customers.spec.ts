import { test, expect } from '@playwright/test';
import { CustomerPOM } from './customer.pom';
import { CreateCustomerFormData } from '@/app/(core)/operations/customers/types/types';

test.describe.serial('Customer Management Flow', () => {
  let customerPOM: CustomerPOM;
  let currentCustomer: CreateCustomerFormData;

  test.beforeAll(() => {
    const timestamp = Date.now();
    currentCustomer = {
      code: `C${timestamp.toString().slice(-4)}`,
      legalName: `E2E Customer ${timestamp}`,
      businessName: `E2E Biz ${timestamp}`,
      taxId: `J-${timestamp.toString().slice(-8)}-1`,
      address: 'Test Address 123',
      phone: '1234567890',
    };
  });

  test.beforeEach(async ({ page }) => {
    customerPOM = new CustomerPOM(page);
    await customerPOM.login();
  });

  test('should create a new customer', async ({ page }) => {
    await customerPOM.goToCreateCustomer();
    await customerPOM.fillCreateCustomer(currentCustomer);
    await customerPOM.saveCustomer();

    await expect(page.getByText('Cliente creado exitosamente')).toBeVisible();
    await expect(page).toHaveURL('/operations/customers');

    await customerPOM.searchCustomer(currentCustomer.legalName);
    await expect(page.getByText(currentCustomer.legalName)).toBeVisible();
  });

  test('should search and view customer details', async ({ page }) => {
    await customerPOM.goToCustomers();
    await customerPOM.searchCustomer(currentCustomer.legalName);
    await customerPOM.selectCustomerBySearchLegalName(currentCustomer.legalName);
    await customerPOM.clickViewCustomer();

    await expect(page.getByText('Detalles del Cliente')).toBeVisible({ timeout: 15000 });
    // Precise regex match for the URL ID
    await expect(page).toHaveURL(/\/operations\/customers\/[a-zA-Z0-9-]+$/);
  });

  test('should update customer', async ({ page }) => {
    await customerPOM.goToEditCustomersByLegalName(currentCustomer.legalName);

    const updatedName = `${currentCustomer.legalName} Updated`;

    await customerPOM.fillUpdateCustomer({
      legalName: updatedName,
    });
    await customerPOM.saveCustomer();

    await expect(page.getByText('Cliente actualizado exitosamente')).toBeVisible();
    await expect(page).toHaveURL('/operations/customers');

    await customerPOM.searchCustomer(updatedName);
    await expect(page.getByText(updatedName)).toBeVisible();

    // Update local state to reflect the change for subsequent tests if any
    currentCustomer.legalName = updatedName;
  });

  test('should delete customer', async ({ page }) => {
    // Create a specific disposable customer for deletion to avoid side effects if run in parallel someday
    // or strictly following the flow, we could delete the main one.
    // Given the user's previous code created a NEW one for deletion, we'll follow that robust pattern.

    const deleteTimestamp = Date.now();
    const customerToDelete: CreateCustomerFormData = {
      ...currentCustomer,
      code: `D${deleteTimestamp.toString().slice(-4)}`,
      legalName: `Delete Me ${deleteTimestamp}`,
      businessName: `Delete Biz ${deleteTimestamp}`,
      taxId: `J-${deleteTimestamp.toString().slice(-8)}-1`,
      phone: deleteTimestamp.toString().slice(-10),
    };

    // 1. Create
    await customerPOM.goToCreateCustomer();
    await customerPOM.fillCreateCustomer(customerToDelete);
    await customerPOM.saveCustomer();
    await expect(page.getByText('Cliente creado exitosamente')).toBeVisible();

    // 2. Search & Delete
    await customerPOM.searchCustomer(customerToDelete.legalName);
    await customerPOM.selectCustomerBySearchLegalName(customerToDelete.legalName);
    await customerPOM.clickDeleteCustomer();

    await expect(page.getByText('¿Estás seguro?')).toBeVisible();

    await customerPOM.confirmDelete();

    await expect(page.getByText('Cliente eliminado exitosamente')).toBeVisible();
    await expect(page).toHaveURL('/operations/customers');

    // 3. Verify Inactive status
    await customerPOM.searchCustomer(customerToDelete.legalName);
    const row = page.getByRole('row', { name: customerToDelete.legalName }).first();
    await expect(row).toContainText('Inactivo');
  });
});
