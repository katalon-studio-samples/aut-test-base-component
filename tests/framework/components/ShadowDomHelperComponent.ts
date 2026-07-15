import { expect, type Page } from "@playwright/test";

export class ShadowDomHelperComponent {
  constructor(private readonly page: Page) {}

  async clickShadowButton(
    hostTestId = "shadow-host",
    buttonTestId = "shadow-button",
  ): Promise<void> {
    const host = this.page.locator(`[data-test="${hostTestId}"]`);
    await expect(host).toBeVisible();

    await host.evaluate((element, targetButtonTestId) => {
      const hostElement = element as HTMLElement;
      const shadowButton = hostElement.shadowRoot?.querySelector(
        `[data-test="${targetButtonTestId}"]`,
      ) as HTMLButtonElement | null;

      if (!shadowButton) {
        throw new Error(`Shadow button ${targetButtonTestId} was not found.`);
      }

      shadowButton.click();
    }, buttonTestId);
  }
}
