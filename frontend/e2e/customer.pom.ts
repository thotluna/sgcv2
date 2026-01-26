import { Page, expect } from '@playwright/test';
import {
  CreateCustomerFormData,
  UpdateCustomerFormData,
} from '@/app/(core)/operations/customers/types';

export class CustomerPOM {
  constructor(private page: Page) {}

  async login() {
    await this.page.goto('/login');
    const usernameInput = this.page.locator('input[id="username"]');
    const passwordInput = this.page.locator('input[id="password"]');

    await usernameInput.fill('admin');
    await passwordInput.fill('admin123');

    await this.page.getByRole('button', { name: /Sign in/i }).click();
    await this.page.waitForURL('/dashboard');
  }

  // --- Navigation ---

  async goToCustomers() {
    await this.page.goto('/operations/customers');
  }

  async goToCreateCustomer() {
    await this.goToCustomers();
    await this.page.getByRole('button', { name: 'Nuevo Cliente' }).click();
  }

  async goToEditCustomersByLegalName(legalName: string) {
    await this.goToCustomers();
    await this.searchCustomer(legalName);
    await this.selectCustomerBySearchLegalName(legalName);
    await this.clickUpdateCustomer();
    await expect(this.page.getByText('Editar Cliente')).toBeVisible();
  }

  // --- Actions ---

  async searchCustomer(legalName: string) {
    await this.page.getByPlaceholder('Buscar clientes...').fill(legalName);
    await expect(this.page.getByRole('row').filter({ hasText: legalName }).first()).toBeVisible();
  }

  async selectCustomerBySearchLegalName(legalName: string) {
    const row = this.page.getByRole('row', { name: legalName }).first();
    await row.getByRole('button').click();
  }

  async clickViewCustomer() {
    await this.page.locator('[role="menuitem"]').filter({ hasText: 'Ver' }).click();
  }

  async clickUpdateCustomer() {
    await this.page.locator('[role="menuitem"]').filter({ hasText: 'Editar' }).click();
  }

  async clickDeleteCustomer() {
    await this.page.locator('[role="menuitem"]').filter({ hasText: 'Eliminar' }).click();
  }

  async confirmDelete() {
    await this.page.getByRole('button', { name: 'Eliminar' }).click();
  }

  // --- Forms ---

  async fillCreateCustomer(data: Partial<CreateCustomerFormData>) {
    if (data.code) await this.page.fill('input[name="code"]', data.code);
    if (data.legalName) await this.page.fill('input[name="legalName"]', data.legalName);
    if (data.businessName) await this.page.fill('input[name="businessName"]', data.businessName);
    if (data.taxId) await this.page.fill('input[name="taxId"]', data.taxId);
    if (data.address) await this.page.fill('input[name="address"]', data.address);
    if (data.phone) await this.page.fill('input[name="phone"]', data.phone);
  }

  async fillUpdateCustomer(data: Partial<UpdateCustomerFormData>) {
    if (data.code) await this.page.fill('input[name="code"]', data.code);
    if (data.legalName) await this.page.fill('input[name="legalName"]', data.legalName);
    if (data.businessName) await this.page.fill('input[name="businessName"]', data.businessName);
    if (data.taxId) await this.page.fill('input[name="taxId"]', data.taxId);
    if (data.address) await this.page.fill('input[name="address"]', data.address);
    if (data.phone) await this.page.fill('input[name="phone"]', data.phone);
    if (data.state) await this.page.fill('input[name="state"]', data.state);
  }

  async saveCustomer() {
    await this.page.getByRole('button', { name: 'Guardar Cliente' }).click();
  }
}
