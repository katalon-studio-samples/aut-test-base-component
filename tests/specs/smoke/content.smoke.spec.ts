import { test, expect } from "../../fixtures/app.fixtures";

test.describe("@smoke @regression Content and Cross-Context", () => {
  test("@smoke @regression file upload workflow", async ({
    seedPages,
    page,
  }) => {
    await seedPages.fileUpload.goto();
    await seedPages.fileUpload.uploadFile("README.md");

    await expect(page.locator('[data-test="uploaded-files"]')).toBeVisible();
    await expect(page.locator('[data-test="uploaded-file-0"]')).toContainText(
      "README.md",
    );
  });

  test("@smoke @regression notification and shadow dom interaction", async ({
    seedPages,
    components,
    page,
  }) => {
    await seedPages.notifications.goto();
    await components.notifications.addSuccessNotification();
    await components.notifications.expectAtLeastOneNotification();

    await seedPages.shadowDom.goto();
    await components.shadowDomHelper.clickShadowButton();
    await seedPages.shadowDom.expectDialogOpen();
    await page.getByRole("button", { name: "Close" }).click();
  });

  test("@smoke @regression iframe and exit intent scenarios", async ({
    seedPages,
    components,
  }) => {
    await seedPages.iframes.goto();
    await seedPages.iframes.openIframeExamplesAccordion();

    const iframe = await components.iframeHelper.frameByDataTest("iframe-iframe1");
    await iframe.getByRole("button", { name: "Click Me" }).click();
    await seedPages.iframes.expectIframeMessageVisible();

    await seedPages.exitIntent.goto();
    await seedPages.exitIntent.triggerExitIntent();
    await components.modal.expectVisible("exit-modal");
    await components.modal.clickAction("exit-modal", "modal-no");
    await components.modal.expectHidden("exit-modal");
  });
});
