import { test, expect, Page } from '@playwright/test';

/**
 * IMPORTANT: These tests require the backend to be running on http://localhost:4000
 * Start the backend with: cd backend && npm run dev
 */

// Helper to perform login
async function login(page: Page) {
  await page.goto('/login');

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Get input elements and wait for them to be enabled
  const usernameInput = page.getByPlaceholder('me@domain.com');
  const passwordInput = page.getByPlaceholder('introduce tu contraseña');

  // Wait for inputs to be visible and enabled
  await usernameInput.waitFor({ state: 'visible' });
  await passwordInput.waitFor({ state: 'visible' });

  // Click to focus before filling (WebKit sometimes needs this)
  await usernameInput.click();
  await usernameInput.fill('admin');

  await passwordInput.click();
  await passwordInput.fill('admin123');

  // Wait for button and click
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await signInButton.waitFor({ state: 'visible' });
  await signInButton.click();

  await page.waitForURL('/', { timeout: 60000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Manual Testing Automation - Point 5.3', () => {
  test('Login flow redirects to dashboard and persists token', async ({ page, browserName }) => {
    // test.skip(browserName === 'webkit', 'WebKit has connectivity issues with backend');

    await login(page);
    await expect(page).toHaveURL(/\/$/);
    const storage = await page.evaluate(() => localStorage.getItem('auth-storage'));
    if (!storage) {
      throw new Error('Auth storage not found');
    }
    const parsed = JSON.parse(storage);
    expect(parsed.state?.token).toBeTruthy();
  });

  test('Protected route redirects to login when not authenticated', async ({ page }) => {
    // Clear all cookies first
    await page.context().clearCookies();

    // Navigate to protected route (root)
    await page.goto('/');

    // Should redirect to login with callbackUrl parameter
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl=%2F/);
  });

  test('Logout flow redirects to login and clears session', async ({ page }) => {
    await login(page);

    // Find logout button and click it
    const logoutButton = page.getByRole('button', { name: /logout/i });
    await logoutButton.waitFor({ state: 'visible' });
    await logoutButton.click();

    // Verify redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Verify token is removed from storage
    const storage = await page.evaluate(() => localStorage.getItem('auth-storage'));
    if (storage) {
      const parsed = JSON.parse(storage);
      expect(parsed.state?.token).toBeNull();
      expect(parsed.state?.isAuthenticated).toBe(false);
    }
  });

  test('Responsive layout adapts for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    // Use semantic selectors - test what the user sees
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });
});
