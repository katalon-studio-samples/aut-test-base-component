import { expect, type Locator, type Page } from "@playwright/test";

const ROUTE_EXTENSION_PATTERN = /\.(html|php|asp|aspx|jsp)$/;

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected normalizeRoute(path: string): string {
    if (!path) {
      return "/";
    }

    return path.startsWith("/") ? path : `/${path}`;
  }

  protected applyRouteExtension(path: string, extension = ""): string {
    const normalized = this.normalizeRoute(path).replace(
      ROUTE_EXTENSION_PATTERN,
      "",
    );

    if (!extension || normalized === "/") {
      return normalized;
    }

    return `${normalized}${extension}`;
  }

  async gotoPath(path: string, extension = ""): Promise<void> {
    const formattedPath = this.applyRouteExtension(path, extension);
    await this.page.goto(formattedPath, { waitUntil: "domcontentloaded" });
  }

  async dismissKatalonConfigBannerIfPresent(): Promise<void> {
    const banner = this.page.locator("#katalon-config-banner");
    if ((await banner.count()) === 0) {
      return;
    }

    if (await banner.isVisible()) {
      await banner.getByRole("button").first().click();
      await expect(banner).toBeHidden();
    }
  }

  async assertPath(path: string, extension = ""): Promise<void> {
    const formattedPath = this.applyRouteExtension(path, extension);
    const escapedPath = formattedPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await expect(this.page).toHaveURL(new RegExp(`${escapedPath}$`));
  }

  getByDataTest(value: string): Locator {
    return this.page.locator(`[data-test="${value}"]`);
  }

  async clickByDataTest(value: string): Promise<void> {
    await this.getByDataTest(value).click();
  }

  async expectVisibleByDataTest(value: string): Promise<void> {
    await expect(this.getByDataTest(value)).toBeVisible();
  }
}
