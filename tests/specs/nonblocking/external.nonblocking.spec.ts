import { test, expect } from "../../fixtures/app.fixtures";

test.describe("@regression @nonblocking External and Dynamic Scenarios", () => {
  test("@regression @nonblocking @external file download emits event or graceful error", async ({
    seedPages,
    page,
  }) => {
    await seedPages.fileDownload.goto();

    const networkRequestPromise = page
      .waitForRequest(
        (request) => {
          const url = request.url();
          return (
            url.includes("allorigins.win/raw") || url.includes("sample-files/sample.txt")
          );
        },
        { timeout: 10_000 },
      )
      .catch(() => null);

    const [download, networkRequest] = await Promise.all([
      page.waitForEvent("download", { timeout: 10_000 }).catch(() => null),
      networkRequestPromise,
      seedPages.fileDownload.triggerFirstDownload(),
    ]);

    if (download) {
      const suggestedFilename = download.suggestedFilename();
      expect(suggestedFilename.length).toBeGreaterThan(0);
      return;
    }

    expect(networkRequest).not.toBeNull();

    const errorMessage = page.locator('[data-test="error-message"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText("Failed to download");
    }
  });

  test("@regression @nonblocking @external external iframe route mounts frame element", async ({
    routePages,
    page,
  }) => {
    await routePages.iframesDocsKatalon.goto();

    await expect(
      page.locator('iframe[title="Katalon Docs Iframe"]'),
    ).toBeVisible();
  });

  test("@regression @nonblocking @dynamic dynamic-id-locator regenerates IDs", async ({
    routePages,
    page,
  }) => {
    await routePages.dynamicIdLocator.goto();

    const idBefore = await page
      .locator('#user-role-select')
      .evaluate((el) => el.getAttribute("id"));

    await page.getByRole("button", { name: "Regenerate IDs" }).click();

    const dynamicIdText = await page
      .locator("text=Current ID:")
      .first()
      .textContent();

    expect(idBefore).toBe("user-role-select");
    expect(dynamicIdText || "").toContain("combobox-input-");
  });
});
