import { expect, type Frame, type Page } from "@playwright/test";

export class IframeHelperComponent {
  constructor(private readonly page: Page) {}

  async frameByDataTest(dataTest: string): Promise<Frame> {
    const iframeLocator = this.page.locator(`iframe[data-test="${dataTest}"]`).first();
    await expect(iframeLocator).toBeVisible();

    const frame = await iframeLocator.contentFrame();
    if (!frame) {
      throw new Error(`Unable to resolve frame for data-test=\"${dataTest}\".`);
    }

    return frame;
  }
}
