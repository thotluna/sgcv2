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

  await page.waitForURL('/dashboard', { timeout: 60000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Manual Testing Automation - Point 5.3', () => {
  test('Login flow redirects to dashboard and persists token in cookie', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/dashboard$/);

    // Verify token is stored in cookie (secure storage)
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(c => c.name === 'auth-token');
    expect(authCookie).toBeTruthy();
    expect(authCookie?.value).toBeTruthy();

    // Verify user data is persisted in localStorage (by Zustand)
    const storage = await page.evaluate(() => localStorage.getItem('auth-storage'));
    if (!storage) {
      throw new Error('Auth storage not found');
    }
    const parsed = JSON.parse(storage);
    expect(parsed.state?.user).toBeTruthy();
    expect(parsed.state?.isAuthenticated).toBe(true);
    // Token should NOT be in localStorage
    expect(parsed.state?.token).toBeUndefined();
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

  test('Responsive layout adapts for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    // Use semantic selectors - test what the user sees
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });
});
