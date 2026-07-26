import { expect, type Page } from "@playwright/test";

export class ModalComponent {
  constructor(private readonly page: Page) {}

  private modal(dataTest: string) {
    return this.page.locator(`[data-test="${dataTest}"]`);
  }

  async expectVisible(dataTest: string): Promise<void> {
    await expect(this.modal(dataTest)).toBeVisible();
  }

  async expectHidden(dataTest: string): Promise<void> {
    await expect(this.modal(dataTest)).toBeHidden();
  }

  async clickAction(dataTest: string, actionTestId: string): Promise<void> {
    await this.modal(dataTest).locator(`[data-test="${actionTestId}"]`).click();
  }
}
