import { expect, type Page } from "@playwright/test";

export class SideNavComponent {
  constructor(private readonly page: Page) {}

  private buildNavSelector(path: string): string {
    const normalized = path.startsWith("/") ? path.slice(1) : path;
    return `[data-test="nav-${normalized}"]`;
  }

  async openMobileMenuIfVisible(): Promise<void> {
    const mobileMenuButton = this.page.locator('[data-test="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
    }
  }

  async navigate(path: string): Promise<void> {
    if (path === "/") {
      await this.page.goto(path);
      return;
    }

    await this.openMobileMenuIfVisible();
    await this.page.locator(this.buildNavSelector(path)).first().click();
  }

  async expectNavItemVisible(path: string): Promise<void> {
    if (path === "/") {
      await expect(this.page.locator('[data-test="mobile-menu-button"]')).toBeVisible();
      return;
    }

    await this.openMobileMenuIfVisible();
    await expect(this.page.locator(this.buildNavSelector(path)).first()).toBeVisible();
  }
}
