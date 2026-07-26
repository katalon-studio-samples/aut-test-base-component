import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BaseRoutePage extends BasePage {
  readonly path: string;
  readonly title: string;

  constructor(page: Page, path: string, title: string) {
    super(page);
    this.path = path;
    this.title = title;
  }

  async goto(extension = ""): Promise<void> {
    await this.gotoPath(this.path, extension);
    await this.dismissKatalonConfigBannerIfPresent();
  }

  async assertLoaded(extension = ""): Promise<void> {
    await this.assertPath(this.path, extension);
  }
}
