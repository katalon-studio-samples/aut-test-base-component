import { expect, type Page } from "@playwright/test";

export class ThemeToggleComponent {
  constructor(private readonly page: Page) {}

  private readonly extensionButton = this.page.locator(
    'button[aria-label="Select URL extension"]',
  );

  private readonly themeButton = this.page.locator(
    'button[aria-label*="Switch to"]',
  );

  async toggleTheme(): Promise<void> {
    await this.themeButton.click();
  }

  async selectUrlExtension(extensionLabel: string): Promise<void> {
    await this.extensionButton.click();
    await this.page.getByRole("button", { name: extensionLabel }).click();
  }

  async expectSelectedExtension(labelContains: string): Promise<void> {
    await expect(this.extensionButton).toContainText(labelContains);
  }
}
