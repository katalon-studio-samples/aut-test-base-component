import { test, expect } from "../../fixtures/app.fixtures";

test.describe("@smoke @regression Popup and New Tab", () => {
  test("@smoke @regression popup form postMessage flow", async ({
    seedPages,
    page,
  }) => {
    await seedPages.openPopup.goto();
    const [popup] = await seedPages.openPopup.openPopupWindow();

    await popup.waitForLoadState();
    await popup.locator('#name').fill('Playwright QA');
    await popup.locator('#email').fill('playwright@example.com');
    await popup.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Submitted Info:')).toBeVisible();
    await expect(page.getByText('Playwright QA')).toBeVisible();
  });

  test("@smoke @regression open-new-tab emits popup events", async ({
    seedPages,
    page,
  }) => {
    await seedPages.openNewTab.goto();

    const [tab] = await Promise.all([
      page.waitForEvent('popup'),
      seedPages.openNewTab.openNewTab(),
    ]);
    expect(tab).toBeTruthy();
    expect(tab.isClosed()).toBe(false);
    await tab.close();

    const [popupWindow] = await Promise.all([
      page.waitForEvent('popup'),
      seedPages.openNewTab.openPopupWindow(),
    ]);
    expect(popupWindow).toBeTruthy();
    expect(popupWindow.isClosed()).toBe(false);
    await popupWindow.close();
  });
});
