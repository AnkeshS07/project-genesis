import { expect, test } from '@playwright/test';

/**
 * Critical journey: UI shell is reachable and shows bootstrap messaging.
 * Styling / Tailwind / snapshots are out of scope.
 */
test.describe('web shell smoke', () => {
  test('should_load_home_and_show_shell_online', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /UI shell is online/i })).toBeVisible();
    await expect(page.getByText(/UI-only/i)).toBeVisible();
  });
});
