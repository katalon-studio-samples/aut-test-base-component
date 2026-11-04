import { expect, test } from '@playwright/test';

test('same-origin signer loads Traffic Agent using the main page settings @regression', async ({ page, context }) => {
  await context.route('**/libs/traffic-agent/v1/**', route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: '',
  }));
  await page.goto('/tab-workflow-test?env=qa&clientCode=KA-TEST');
  const [signer] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByTestId('open-signer-1-same-domain-tab').click(),
  ]);
  await expect(signer.getByTestId('signer-tab-title')).toBeVisible();
  await expect(signer.locator('script[src*="truetest-sdk.min.js"]')).toHaveCount(1);
  const agent = signer.locator('script[src*="traffic-agent.min.js"]');
  await expect(agent).toHaveCount(1);
  await expect(agent).toHaveAttribute('client-code', 'KA-TEST');
  await expect(agent).toHaveAttribute('src', /https:\/\/static\.qa\.katalon\.com\//);
});
