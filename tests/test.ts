import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Justin Rowsell' })).toBeVisible();
});

test('globe legend toggles the places visited', async ({ page }) => {
	await page.goto('/');

	const toggle = page.getByRole('switch', { name: /everywhere i.ve been/i });
	await expect(toggle).toHaveAttribute('aria-checked', 'false');

	const visited = page.locator('.visited');
	await expect(visited).toHaveAttribute('aria-hidden', 'true');

	await toggle.click();

	await expect(toggle).toHaveAttribute('aria-checked', 'true');
	await expect(visited).not.toHaveAttribute('aria-hidden', 'true');
	await expect(page.locator('.visited-item')).toHaveCount(25);
	await expect(page.locator('.visited-item').first()).toBeVisible();
});
