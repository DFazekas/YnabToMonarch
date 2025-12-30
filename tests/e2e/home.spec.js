import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('renders and interactive elements work', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#getStartedButton');
    await expect(page.locator('#pageHeader h2')).toHaveText(/YNAB to Monarch Migration/);

    // Open and close "How does this work?" modal
    const trigger = page.locator('ui-modal#migrationInfoModal >> [slot="trigger"]');
    await trigger.click();
    const overlay = page.locator('.ui-modal-overlay');
    await expect(overlay).toBeVisible();
    await overlay.locator('.ui-modal-close-btn').click();
    await page.waitForFunction(() => !document.querySelector('.ui-modal-overlay'));

    // Navigate via Get Started button
    await page.locator('#getStartedButton').click();
    await expect(page).toHaveURL(/\/upload$/);
  });

  test('responsive layout across viewports', async ({ page }) => {
    const sizes = [
      { w: 375, h: 640, expectedH2: '20px' },   // text-xl
      { w: 640, h: 800, expectedH2: '24px' },   // sm:text-2xl
      { w: 768, h: 1024, expectedH2: '30px' },  // md:text-3xl
      { w: 1280, h: 800, expectedH2: '36px' }   // lg:text-4xl
    ];

    for (const { w, h, expectedH2 } of sizes) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      await page.waitForSelector('#pageHeader h2');

      // No horizontal overflow
      const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(noOverflow).toBe(true);

      // Header font size scales
      const fontSize = await page.$eval('#pageHeader h2', el => getComputedStyle(el).fontSize);
      expect(fontSize).toBe(expectedH2);

      // Button visible and clickable
      await expect(page.locator('#getStartedButton')).toBeVisible();
    }
  });
});
