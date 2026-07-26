import { expect, type Page } from "@playwright/test";

export class NotificationComponent {
  constructor(private readonly page: Page) {}

  async addSuccessNotification(): Promise<void> {
    await this.page.locator('[data-test="add-success"]').click();
  }

  async addErrorNotification(): Promise<void> {
    await this.page.locator('[data-test="add-error"]').click();
  }

  async addInfoNotification(): Promise<void> {
    await this.page.locator('[data-test="add-info"]').click();
  }

  async expectAtLeastOneNotification(): Promise<void> {
    await expect(
      this.page.locator('[data-test^="notification-"]').first(),
    ).toBeVisible();
  }
}
