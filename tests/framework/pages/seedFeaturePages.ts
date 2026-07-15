import { expect, type Page } from "@playwright/test";
import {
  AlertsPage,
  AuthPage,
  CheckboxesPage,
  DragDropPage,
  DynamicElementsPage,
  ExitIntentPage,
  FileDownloadPage,
  FileUploadPage,
  FormsPage,
  HomePage,
  IframesPage,
  KeyPressPage,
  NotificationsPage,
  OpenNewTabPage,
  OpenPopupPage,
  SauceLoginPage,
  ShadowDomPage,
  TablesPage,
} from "./routePages";

export class HomeFeaturePage extends HomePage {
  constructor(page: Page) {
    super(page);
  }

  async expectLandingContent(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: "Test Automation Practice (Web and Mobile Web)",
      }),
    ).toBeVisible();
  }

  async openFeatureCard(path: string): Promise<void> {
    await this.page.locator(`[data-test="feature-card-${path}"]`).click();
  }
}

export class FormsFeaturePage extends FormsPage {
  constructor(page: Page) {
    super(page);
  }

  async submitInvalidForm(): Promise<void> {
    await this.page.locator('[data-test="submit-button"]').click();
  }

  async expectValidationErrors(): Promise<void> {
    await expect(this.page.locator('[data-test="username-error"]')).toBeVisible();
    await expect(this.page.locator('[data-test="email-error"]')).toBeVisible();
    await expect(this.page.locator('[data-test="password-error"]')).toBeVisible();
  }

  async submitValidForm(): Promise<void> {
    await this.page.locator('[data-test="username-input"]').fill("qa-user");
    await this.page.locator('[data-test="email-input"]').fill("qa@example.com");
    await this.page.locator('[data-test="password-input"]').fill("strongpass123");
    await this.page.locator('[data-test="submit-button"]').click();
  }

  async expectFormSubmittedWithoutValidationErrors(): Promise<void> {
    await expect(this.page.locator('[data-test="username-error"]')).toHaveCount(0);
    await expect(this.page.locator('[data-test="email-error"]')).toHaveCount(0);
    await expect(this.page.locator('[data-test="password-error"]')).toHaveCount(0);
  }
}

export class AuthFeaturePage extends AuthPage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator('[data-test="username-input"]').fill(username);
    await this.page.locator('[data-test="password-input"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }

  async expectAuthError(): Promise<void> {
    await expect(this.page.locator('[data-test="auth-error"]')).toBeVisible();
  }

  async expectAuthenticatedState(): Promise<void> {
    await expect(this.page.locator('[data-test="auth-success"]')).toBeVisible();
  }
}

export class SauceLoginFeaturePage extends SauceLoginPage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator('[data-test="username-input"]').fill(username);
    await this.page.locator('[data-test="password-input"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }

  async expectErrorContains(text: string): Promise<void> {
    await expect(this.page.locator('[data-test="auth-error"]')).toContainText(text);
  }

  async expectProductsPage(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Products" })).toBeVisible();
  }

  async toggleFirstProductInCart(): Promise<void> {
    await this.page.locator('[data-test="add-to-cart-1"]').click();
  }

  async expectFirstProductMarkedAsInCart(): Promise<void> {
    await expect(this.page.locator('[data-test="add-to-cart-1"]')).toHaveText(
      "Remove",
    );
  }
}

export class TablesFeaturePage extends TablesPage {
  constructor(page: Page) {
    super(page);
  }

  private primaryTable() {
    return this.page.locator('[data-test="dynamic-table"]').first();
  }

  async toggleNameSortOrder(): Promise<void> {
    await this.primaryTable().locator('[data-test="table-header-name"]').click();
  }

  async firstNameCellText(): Promise<string> {
    return (
      (await this.primaryTable()
        .locator("tbody tr")
        .first()
        .locator("td")
        .nth(1)
        .textContent()) || ""
    ).trim();
  }
}

export class DragDropFeaturePage extends DragDropPage {
  constructor(page: Page) {
    super(page);
  }

  async dragFirstItemBelowSecond(): Promise<void> {
    await this.page.locator('[data-test="sortable-item-Item 1"]').dragTo(
      this.page.locator('[data-test="sortable-item-Item 2"]'),
    );
  }

  async expectListVisible(): Promise<void> {
    await expect(this.page.locator('[data-test="drag-drop-list"]')).toBeVisible();
  }
}

export class DynamicElementsFeaturePage extends DynamicElementsPage {
  constructor(page: Page) {
    super(page);
  }

  async setLoadTime(seconds: number): Promise<void> {
    await this.page
      .locator('[data-test="load-time-slider"]')
      .evaluate((element, value) => {
        const input = element as HTMLInputElement;
        input.value = String(value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }, seconds);
  }

  async reload(): Promise<void> {
    await this.page.locator('[data-test="reload-button"]').click();
  }

  async toggleHidden(): Promise<void> {
    await this.page.locator('[data-test="toggle-hidden-button"]').click();
  }
}

export class FileUploadFeaturePage extends FileUploadPage {
  constructor(page: Page) {
    super(page);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.page.locator('[data-test="file-input"]').setInputFiles(filePath);
  }
}

export class FileDownloadFeaturePage extends FileDownloadPage {
  constructor(page: Page) {
    super(page);
  }

  async triggerFirstDownload(): Promise<void> {
    await this.page.locator('[data-test="download-button-0"]').click();
  }
}

export class NotificationsFeaturePage extends NotificationsPage {
  constructor(page: Page) {
    super(page);
  }

  async addSuccess(): Promise<void> {
    await this.page.locator('[data-test="add-success"]').click();
  }
}

export class AlertsFeaturePage extends AlertsPage {
  constructor(page: Page) {
    super(page);
  }

  async showAlert(): Promise<void> {
    await this.page.getByRole("button", { name: "Show Alert" }).click();
  }

  async showConfirm(): Promise<void> {
    await this.page.locator('[data-test="confirm-button"]').click();
  }

  async showPrompt(): Promise<void> {
    await this.page.locator('[data-test="prompt-button"]').click();
  }

  async expectResultContains(text: string): Promise<void> {
    await expect(this.page.locator('[data-test="result-container"]')).toContainText(text);
  }
}

export class CheckboxesFeaturePage extends CheckboxesPage {
  constructor(page: Page) {
    super(page);
  }

  async checkAll(): Promise<void> {
    await this.page.locator('[data-test="check-all-button"]').click();
  }

  async uncheckAll(): Promise<void> {
    await this.page.locator('[data-test="uncheck-all-button"]').click();
  }

  async expectAllChecked(expected: boolean): Promise<void> {
    const checkboxes = this.page.locator('input[data-test^="checkbox-checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i += 1) {
      await expect(checkboxes.nth(i)).toHaveJSProperty("checked", expected);
    }
  }
}

export class KeyPressFeaturePage extends KeyPressPage {
  constructor(page: Page) {
    super(page);
  }

  async pressKey(key: string): Promise<void> {
    await this.page.locator("body").click();
    await this.page.keyboard.press(key);
  }
}

export class OpenPopupFeaturePage extends OpenPopupPage {
  constructor(page: Page) {
    super(page);
  }

  async openPopupWindow() {
    return Promise.all([
      this.page.waitForEvent("popup"),
      this.page.getByRole("button", { name: "Open Form in New Window" }).click(),
    ]);
  }
}

export class OpenNewTabFeaturePage extends OpenNewTabPage {
  constructor(page: Page) {
    super(page);
  }

  async openNewTab(): Promise<void> {
    await this.page.locator('[data-test="open-new-tab-button"]').click();
  }

  async openPopupWindow(): Promise<void> {
    await this.page.locator('[data-test="open-popup-window-button"]').click();
  }
}

export class ShadowDomFeaturePage extends ShadowDomPage {
  constructor(page: Page) {
    super(page);
  }

  async expectDialogOpen(): Promise<void> {
    await expect(this.page.getByRole("dialog")).toBeVisible();
  }
}

export class IframesFeaturePage extends IframesPage {
  constructor(page: Page) {
    super(page);
  }

  async openIframeExamplesAccordion(): Promise<void> {
    await this.page.getByRole("button", { name: "Iframe Examples" }).click();
  }

  async expectIframeMessageVisible(): Promise<void> {
    await expect(this.page.locator('[data-test="iframe-messages"]')).toBeVisible();
  }
}

export class ExitIntentFeaturePage extends ExitIntentPage {
  constructor(page: Page) {
    super(page);
  }

  async triggerExitIntent(): Promise<void> {
    await this.page.evaluate(() => {
      document.dispatchEvent(new MouseEvent("mouseleave", { clientY: 0 }));
    });
  }

  async expectExitModalVisible(): Promise<void> {
    await expect(this.page.locator('[data-test="exit-modal"]')).toBeVisible();
  }
}

export interface SeedFeaturePages {
  home: HomeFeaturePage;
  forms: FormsFeaturePage;
  auth: AuthFeaturePage;
  sauceLogin: SauceLoginFeaturePage;
  tables: TablesFeaturePage;
  dragDrop: DragDropFeaturePage;
  dynamicElements: DynamicElementsFeaturePage;
  fileUpload: FileUploadFeaturePage;
  fileDownload: FileDownloadFeaturePage;
  notifications: NotificationsFeaturePage;
  alerts: AlertsFeaturePage;
  checkboxes: CheckboxesFeaturePage;
  keyPress: KeyPressFeaturePage;
  openPopup: OpenPopupFeaturePage;
  openNewTab: OpenNewTabFeaturePage;
  shadowDom: ShadowDomFeaturePage;
  iframes: IframesFeaturePage;
  exitIntent: ExitIntentFeaturePage;
}

export const createSeedFeaturePages = (page: Page): SeedFeaturePages => ({
  home: new HomeFeaturePage(page),
  forms: new FormsFeaturePage(page),
  auth: new AuthFeaturePage(page),
  sauceLogin: new SauceLoginFeaturePage(page),
  tables: new TablesFeaturePage(page),
  dragDrop: new DragDropFeaturePage(page),
  dynamicElements: new DynamicElementsFeaturePage(page),
  fileUpload: new FileUploadFeaturePage(page),
  fileDownload: new FileDownloadFeaturePage(page),
  notifications: new NotificationsFeaturePage(page),
  alerts: new AlertsFeaturePage(page),
  checkboxes: new CheckboxesFeaturePage(page),
  keyPress: new KeyPressFeaturePage(page),
  openPopup: new OpenPopupFeaturePage(page),
  openNewTab: new OpenNewTabFeaturePage(page),
  shadowDom: new ShadowDomFeaturePage(page),
  iframes: new IframesFeaturePage(page),
  exitIntent: new ExitIntentFeaturePage(page),
});
