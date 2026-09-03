import { test, expect } from "../../fixtures/app.fixtures";

const consoleLevels = [
  { level: "log", browserType: "log" },
  { level: "debug", browserType: "debug" },
  { level: "info", browserType: "info" },
  { level: "warn", browserType: "warning" },
  { level: "error", browserType: "error" },
] as const;

test.describe("@regression console log fixture", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/console-logs");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Console log fixture",
    );
  });

  test("emits each supported console level exactly once", async ({ page }) => {
    const capturedMessages: Array<{ type: string; text: string }> = [];
    page.on("console", (message) => {
      if (message.text().startsWith("[Console Log Fixture]")) {
        capturedMessages.push({ type: message.type(), text: message.text() });
      }
    });

    for (const { level } of consoleLevels) {
      await page.locator(`[data-test="emit-console-${level}"]`).click();
    }

    await expect
      .poll(() => capturedMessages.length, { timeout: 5_000 })
      .toBe(consoleLevels.length);

    expect(capturedMessages.map(({ type }) => type)).toEqual(
      consoleLevels.map(({ browserType }) => browserType),
    );
    expect(capturedMessages.map(({ text }) => text)).toEqual(
      consoleLevels.map(
        ({ level }, index) =>
          `[Console Log Fixture][${level.toUpperCase()}] Event ${index + 1}`,
      ),
    );

    const activityRows = page.locator('[data-test="console-activity-row"]');
    await expect(activityRows).toHaveCount(consoleLevels.length);
    await expect(activityRows.first()).toContainText("Event 5");
    await expect(activityRows.last()).toContainText("Event 1");
  });

  test("emits all five levels from one user action", async ({ page }) => {
    const capturedMessages: Array<{ type: string; text: string }> = [];
    page.on("console", (message) => {
      if (message.text().startsWith("[Console Log Fixture]")) {
        capturedMessages.push({ type: message.type(), text: message.text() });
      }
    });

    await page.locator('[data-test="emit-all-console-levels"]').click();

    await expect
      .poll(() => capturedMessages.length, { timeout: 5_000 })
      .toBe(consoleLevels.length);
    expect(capturedMessages.map(({ type }) => type)).toEqual(
      consoleLevels.map(({ browserType }) => browserType),
    );
    await expect(
      page.locator('[data-test="console-activity-row"]'),
    ).toHaveCount(consoleLevels.length);
  });
});
