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

test('blog index renders and links from the nav', async ({ page }) => {
	await page.goto('/blog');
	await expect(page.getByRole('heading', { level: 1, name: /Far Afield/ })).toBeVisible();
	await expect(page.locator('nav.nav a[href="/blog"]')).toBeVisible();
});

test('rss feed is served for Buttondown', async ({ request }) => {
	const res = await request.get('/rss.xml');
	expect(res.ok()).toBe(true);
	expect(res.headers()['content-type']).toMatch(/xml/);
	expect(await res.text()).toContain('<atom:link href="https://justinrowsell.dev/rss.xml"');
});

test('home page newsletter button leads to the Far Afield signup', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Newsletter' })).toHaveAttribute('href', '#newsletter');

	const form = page.locator('#newsletter form');
	await expect(form).toHaveAttribute('action', /buttondown\.com\/api\/emails\/embed-subscribe\//);
	await expect(form.getByLabel('Email address')).toHaveAttribute('type', 'email');
});
