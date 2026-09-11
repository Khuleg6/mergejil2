import { test, expect } from '@playwright/test';

test('should display welcome message', async ({ page }) => {
  await page.goto('/');

  // Expect the sample app's heading to greet us.
  expect(await page.locator('h1').innerText()).toContain('Welcome');
});
