import { test, expect } from "../../fixtures/app.fixtures";

test.describe("@smoke @regression Interaction Scenarios", () => {
  test("@smoke @regression table sort interaction", async ({ seedPages }) => {
    await seedPages.tables.goto();

    const before = await seedPages.tables.firstNameCellText();
    await seedPages.tables.toggleNameSortOrder();
    const after = await seedPages.tables.firstNameCellText();

    expect(after).not.toBe(before);
  });

  test("@smoke @regression drag and drop list interaction", async ({ seedPages, page }) => {
    await seedPages.dragDrop.goto();
    await seedPages.dragDrop.expectListVisible();

    await seedPages.dragDrop.dragFirstItemBelowSecond();
    await expect(page.locator('[data-test^="sortable-item-"]')).toHaveCount(5);
  });

  test("@smoke @regression dynamic elements reload and hidden content toggle", async ({
    seedPages,
    page,
  }) => {
    await seedPages.dynamicElements.goto();
    await seedPages.dynamicElements.setLoadTime(1);
    await seedPages.dynamicElements.reload();

    await expect(page.locator('[data-test="loading-indicator"]')).toBeVisible();
    await expect(page.locator('[data-test="dynamic-item-0"]')).toBeVisible({
      timeout: 15_000,
    });

    await seedPages.dynamicElements.toggleHidden();
    await expect(page.locator('[data-test="hidden-content"]')).toBeVisible();
  });

  test("@smoke @regression alerts, confirm, and prompt behaviors", async ({
    seedPages,
    page,
  }) => {
    await seedPages.alerts.goto();

    page.once("dialog", (dialog) => dialog.accept());
    await seedPages.alerts.showAlert();
    await seedPages.alerts.expectResultContains("Alert shown");

    page.once("dialog", (dialog) => dialog.accept());
    await seedPages.alerts.showConfirm();
    await seedPages.alerts.expectResultContains("Confirm dialog: OK");

    page.once("dialog", (dialog) => dialog.accept("Playwright"));
    await seedPages.alerts.showPrompt();
    await seedPages.alerts.expectResultContains("Playwright");
  });

  test("@smoke @regression checkbox mass toggle and key press capture", async ({
    seedPages,
    page,
  }) => {
    await seedPages.checkboxes.goto();
    await seedPages.checkboxes.checkAll();
    await seedPages.checkboxes.expectAllChecked(true);
    await seedPages.checkboxes.uncheckAll();
    await seedPages.checkboxes.expectAllChecked(false);

    await seedPages.keyPress.goto();
    await seedPages.keyPress.pressKey("Enter");
    await expect(page.locator('[data-test="last-key-pressed"]')).toContainText(
      "Enter",
    );
  });
});
