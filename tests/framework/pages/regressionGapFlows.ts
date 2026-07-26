import { expect, type Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";

export class RegressionGapFlows extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private async goto(path: string): Promise<void> {
    await this.gotoPath(path);
    await this.dismissKatalonConfigBannerIfPresent();
  }

  private async clickToastShadowButton(): Promise<void> {
    await this.page
      .locator('[data-test="toast-shadow-host"]')
      .evaluate((host) => {
        const button = (host as HTMLElement).shadowRoot?.querySelector(
          '[data-test="toast-trigger"]',
        ) as HTMLButtonElement | null;
        if (!button) {
          throw new Error("Unable to find toast trigger inside shadow host.");
        }
        button.click();
      });
  }

  async nativeElementPrimary(): Promise<void> {
    await this.goto("/native-element");
    await this.page
      .locator('[data-test="basic-date-input"]')
      .fill("2026-01-15");
    await this.page
      .locator('[data-test="datetime-local-input"]')
      .fill("2026-01-15T10:45");
    await expect(
      this.page.locator('[data-test="basic-date-input"]'),
    ).toHaveValue("2026-01-15");
  }

  async aboutPrimary(): Promise<void> {
    await this.goto("/about");
    const githubLink = this.page.locator('[data-test="github-link"]');
    await expect(githubLink).toHaveAttribute("href", /github\.com/);
    await expect(
      this.page.locator('[data-test="linkedin-link"]'),
    ).toHaveAttribute("href", /linkedin\.com/);
  }

  async msuSimulationFormPrimary(): Promise<void> {
    await this.goto("/msu-simulation-form");
    await this.page.locator("#city").click();
    await this.page.locator('[data-test="city-option-1"]').click();
    await expect(
      this.page.locator('[data-test="city-selected-value"]'),
    ).not.toContainText("Select a city");
  }

  async fileUploadEsPrimary(filePath: string): Promise<void> {
    await this.goto("/file-upload/es");
    await this.page.locator("#btnFileDialog").setInputFiles(filePath);
    await this.page.getByRole("button", { name: "Next" }).click();
    await expect(this.page.locator(".es-result-section")).toBeVisible();
    await expect(this.page.locator(".es-feedback")).toContainText(
      "ready to upload",
    );
  }

  async iframes1Primary(): Promise<void> {
    await this.goto("/iframes-1");
    const iframe = this.page.locator('iframe[data-test="iframe-nested"]');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", /\/iframes-2/);
  }

  async iframes2Primary(): Promise<void> {
    await this.goto("/iframes-2");
    await this.page.getByRole("button", { name: "Add" }).first().click();
    await expect(this.page.getByRole("dialog")).toContainText("Action clicked");
    await this.page.getByRole("button", { name: "Close" }).click();
  }

  async contextMenuPrimary(): Promise<void> {
    await this.goto("/context-menu");
    await this.page
      .locator('[data-test="context-menu-trigger"]')
      .click({ button: "right" });
    await expect(this.page.locator('[data-test="context-menu"]')).toBeVisible();
    await expect(
      this.page.locator('[data-test="context-menu-edit"]'),
    ).toBeVisible();
  }

  async multiTieredMenuPrimary(): Promise<void> {
    await this.goto("/multi-tiered-menu");
    const simpleMenuHeading = this.page
      .getByRole("heading", { name: "Simple Multi Tiered Menu" })
      .first();
    await expect(simpleMenuHeading).toBeVisible({ timeout: 30_000 });

    const simpleMenu = simpleMenuHeading.locator(
      "xpath=following-sibling::nav[1]",
    );
    await expect(simpleMenu).toBeVisible();

    await simpleMenu
      .getByRole("button", { name: "Products", exact: true })
      .hover();
    await simpleMenu
      .getByRole("button", { name: "Electronics", exact: true })
      .hover();
    await simpleMenu
      .getByRole("button", { name: "Tablets", exact: true })
      .hover();
    await simpleMenu.getByRole("button", { name: "iPad", exact: true }).click();

    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toContainText("You clicked: iPad");
    await dialog.getByRole("button", { name: "Close" }).click();
  }

  async toastDelayScenarioPrimary(): Promise<void> {
    await this.goto("/toast-delay-scenario");
    await expect(
      this.page.getByRole("heading", {
        name: /Toast & Delayed Notification Scenario/,
      }),
    ).toBeVisible({ timeout: 30_000 });

    await this.page
      .locator('[data-test="toast-message-input"]')
      .fill("Toast from regression gap closure");
    await this.clickToastShadowButton();

    const toast = this.page
      .locator('[data-test="toast-container"] > [data-test^="toast-"]')
      .first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Toast from regression gap closure");

    await this.page
      .locator('[data-test="delayed-notification-duration-input"]')
      .fill("2");
    await this.page
      .locator('[data-test="delayed-notification-trigger"]')
      .click();
    await expect(
      this.page.locator('[data-test="delayed-notification-waiting"]'),
    ).toBeVisible();
    await expect(
      this.page.locator('[data-test="delayed-notification-visible"]'),
    ).toBeVisible({ timeout: 10_000 });
  }

  async abTestingPrimary(): Promise<void> {
    await this.goto("/ab-testing");
    const button = this.page.locator('[data-test="variant-button"]');
    const before = (await button.textContent()) || "";
    await button.click();
    await expect(button).not.toHaveText(before);
  }

  async brokenImagesPrimary(): Promise<void> {
    await this.goto("/broken-images");

    const image0 = this.page.locator('[data-test="image-0"]');
    const image1 = this.page.locator('[data-test="image-1"]');
    const image2 = this.page.locator('[data-test="image-2"]');

    await expect(image0).toBeVisible();
    await expect(image1).toBeVisible();
    await expect(image2).toBeVisible();

    await expect(image0).toHaveAttribute("src", /picsum\.photos\/200/);
    await expect(image1).toHaveAttribute(
      "src",
      "https://example.com/broken-image.jpg",
    );
    await expect(image2).toHaveAttribute("src", "invalid-url");

    await expect
      .poll(async () => {
        const widths = await Promise.all(
          [image1, image2].map((locator) =>
            locator.evaluate((img) => (img as HTMLImageElement).naturalWidth),
          ),
        );
        return widths.some((width) => width === 0);
      })
      .toBe(true);
  }

  async sliderPrimary(): Promise<void> {
    await this.goto("/slider");

    const slider = this.page.locator('[data-test="slider"]');
    await expect(
      this.page.getByRole("heading", { name: "Horizontal Slider" }),
    ).toBeVisible();

    await slider.evaluate((input, value) => {
      const range = input as HTMLInputElement;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(range, String(value));
      range.dispatchEvent(new Event("input", { bubbles: true }));
      range.dispatchEvent(new Event("change", { bubbles: true }));
    }, 80);

    await expect(this.page.locator('[data-test="slider-value"]')).toContainText(
      "80",
    );
  }

  async popupFormPrimary(): Promise<void> {
    await this.page.addInitScript(() => {
      (window as Window & { __popupPayload?: unknown }).__popupPayload = null;
      (window as Window & { __popupClosed?: boolean }).__popupClosed = false;

      const openerMock = {
        postMessage: (payload: unknown) => {
          (window as Window & { __popupPayload?: unknown }).__popupPayload =
            payload;
        },
      };

      try {
        Object.defineProperty(window, "opener", {
          configurable: true,
          get: () => openerMock,
        });
      } catch {
        // ignore
      }

      try {
        Object.defineProperty(window, "close", {
          configurable: true,
          value: () => {
            (window as Window & { __popupClosed?: boolean }).__popupClosed =
              true;
          },
        });
      } catch {
        (window as Window & { close: () => void }).close = () => {
          (window as Window & { __popupClosed?: boolean }).__popupClosed = true;
        };
      }
    });

    await this.goto("/popup-form");
    await this.page.locator("#name").fill("Popup User");
    await this.page.locator("#email").fill("popup@example.com");
    await this.page.getByRole("button", { name: "Submit" }).click();

    const payload = (await this.page.evaluate(
      () => (window as Window & { __popupPayload?: unknown }).__popupPayload,
    )) as { type?: string; data?: { name?: string; email?: string } } | null;
    const closed = await this.page.evaluate(
      () => (window as Window & { __popupClosed?: boolean }).__popupClosed,
    );

    expect(payload?.type).toBe("popupFormData");
    expect(payload?.data?.name).toBe("Popup User");
    expect(payload?.data?.email).toBe("popup@example.com");
    expect(closed).toBe(true);
  }

  async keyValueFormPrimary(): Promise<void> {
    await this.goto("/key-value-form");
    await expect(
      this.page.getByRole("heading", { name: "Enter Key-Value Pairs" }),
    ).toBeVisible();

    await this.page.locator('input[name="key"]').fill("env");
    await this.page.locator('input[name="value"]').fill("qa");
    await this.page.getByRole("button", { name: "Next" }).click();

    await this.page.locator('input[name="key"]').fill("region");
    await this.page.locator('input[name="value"]').fill("us");
    await this.page.getByRole("button", { name: "Submit" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Submitted Key-Value Pairs" }),
    ).toBeVisible();
    await expect(this.page.locator("tbody tr").first()).toContainText("env");
    await expect(this.page.locator("tbody tr").first()).toContainText("qa");
  }

  async keyValueFormNegative(): Promise<void> {
    await this.goto("/key-value-form");
    await expect(
      this.page.getByRole("button", { name: "Submit" }),
    ).toBeDisabled();
    await expect(
      this.page.getByRole("button", { name: "Next" }),
    ).toBeDisabled();
  }

  async iframesCellphoneDemoPrimary(): Promise<void> {
    await this.goto("/iframes/cellphone-demo");
    const iframe = this.page.locator('iframe[title="Cellphone Demo"]');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", /cellphone-demo/);
  }

  async iframesVinothDemoPrimary(): Promise<void> {
    await this.goto("/iframes/vinoth-demo");
    const iframe = this.page.locator(
      'iframe[title="Vinoth QA Demo Site Iframe"]',
    );
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", /vinothqaacademy/);
  }

  async iframesDocsKatalonPrimary(): Promise<void> {
    await this.goto("/iframes/docs-katalon");
    const iframe = this.page.locator('iframe[title="Katalon Docs Iframe"]');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", /docs\.katalon\.com/);
  }

  async iframesSameDomainPrimary(): Promise<void> {
    await this.page.goto("/iframes/same-domain?url=/forms");
    await this.dismissKatalonConfigBannerIfPresent();
    await expect(
      this.page.locator('[data-test="iframe-educenter"]'),
    ).toHaveAttribute("src", "/forms");
  }

  async richTextEditorPrimary(): Promise<void> {
    await this.goto("/rich-text-editor");
    const editor = this.page.locator('[contenteditable="true"]').first();
    await editor.click();
    await this.page.keyboard.type("Regression rich text content");
    await this.page.getByRole("button", { name: "Save" }).click();
    await expect(editor).toContainText("Regression rich text content");
  }

  async inputCheckboxPrimary(): Promise<void> {
    await this.goto("/input/checkbox");
    await this.page.getByLabel("Enable notifications").check();
    await this.page.getByLabel("Accept terms and conditions").check();
    await this.page
      .locator('input[type="button"][value="Show Selection"]')
      .click();
    await expect(this.page.locator('[id$="-result"]')).toContainText(
      "Enable notifications: Yes",
    );
    await expect(this.page.locator('[id$="-result"]')).toContainText(
      "Accept terms and conditions: Yes",
    );
  }

  async inputTextPrimary(): Promise<void> {
    await this.goto("/input/text");
    await this.page.getByLabel("Mandatory field:").fill("Playwright Mandatory");
    await this.page.getByLabel("Optional field:").fill("Optional Input");
    await this.page.getByLabel("Hidden value field:").fill("Hidden Text");
    await this.page
      .getByLabel("Uncontrolled field (no value attribute):")
      .fill("Uncontrolled");
    await this.page.locator('input[type="button"][value="Show Text"]').click();
    await expect(this.page.locator('[id$="-result"]')).toContainText(
      "Mandatory: Playwright Mandatory",
    );
  }

  async inputTextNegative(): Promise<void> {
    await this.goto("/input/text");
    await this.page.locator('input[type="button"][value="Show Text"]').click();
    await expect(this.page.locator('[id$="-error"]')).toContainText(
      "Mandatory field is required.",
    );
  }

  async inputRadioSearchSubmitPrimary(): Promise<void> {
    await this.goto("/input/radio-search-submit");
    await this.page.getByTestId("search-input").fill("Wireless");
    await this.page.getByLabel("Electronics").check();
    await this.page.getByLabel("4+ Stars").check();
    await this.page
      .locator('input[type="submit"][value="Search Products"]')
      .click();

    await expect(
      this.page.getByRole("heading", { name: /Search Results \(/ }),
    ).toBeVisible();

    const rows = this.page.locator("tr[data-product-id]");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await expect(rows.nth(i)).toContainText(/Wireless/i);
    }
  }

  async inputFormInputsPrimary(): Promise<void> {
    await this.goto("/input/form-inputs");
    await this.page.locator('[id$="-email"]').fill("qa@example.com");
    await this.page.locator('[id$="-captcha-image"]').click();
    await this.page.locator('input[type="image"][alt="Submit"]').click();
    await expect(this.page.locator('[id$="-result"]')).toContainText(
      "qa@example.com",
      {
        timeout: 10_000,
      },
    );
  }

  async inputFormInputsNegative(): Promise<void> {
    await this.goto("/input/form-inputs");
    await this.page.locator('[id$="-email"]').fill("qa@example.com");
    await this.page.locator('[id$="-ssn"]').fill("12345");
    await this.page.locator('[id$="-captcha-image"]').click();
    await this.page.locator('input[type="image"][alt="Submit"]').click();
    await expect(
      this.page.locator('[id$="-validation-summary"]'),
    ).toContainText("SSN must be in format XXX-XX-XXXX", { timeout: 10_000 });
    await expect(this.page.locator('[id$="-result"]')).toHaveCount(0);
  }

  async comboboxPrimary(): Promise<void> {
    await this.goto("/combobox");
    await this.page
      .getByTestId("subject-details-modal-site-input")
      .selectOption("site-2");
    await this.page.getByTestId("form-type-input").click();
    await this.page.getByTestId("form-type-input").selectOption("user-profile");
    await expect(
      this.page.getByRole("heading", { name: "Loaded Forms" }),
    ).toBeVisible({ timeout: 8_000 });
    await expect(
      this.page.getByRole("heading", {
        name: "User Profile Form",
        exact: true,
      }),
    ).toBeVisible({ timeout: 10_000 });
  }

  async unicodeComboboxPrimary(): Promise<void> {
    await this.goto("/unicode-combobox");
    const trigger = this.page.getByTestId("unicode-combobox");
    await trigger.click();

    await this.page
      .locator('#unicode-combobox-dropdown input[role="combobox"]')
      .fill("Pi");
    await this.page.locator('[id^="unicode-option-pi-"]').first().click();

    const selectedPanel = this.page
      .locator("div")
      .filter({
        has: this.page.getByRole("heading", {
          name: "Selected Symbol:",
          exact: true,
        }),
      })
      .first();
    await expect(selectedPanel).toContainText("Pi π");
    await expect(trigger).toContainText("Pi π");
  }

  async xpathBreakingPrimary(): Promise<void> {
    await this.goto("/xpath-breaking");
    await this.page.locator("#btn-nightmare").click();
    const selectedInfo = this.page
      .locator("section")
      .filter({
        has: this.page.getByRole("heading", {
          name: "Selected Element Information",
        }),
      })
      .first();
    await expect(selectedInfo).toBeVisible();
    await expect(selectedInfo).toContainText(
      "NIGHTMARE ELEMENT: All problematic characters combined",
    );
  }

  async listCardPrimary(): Promise<void> {
    await this.goto("/list-card");
    await expect(this.page.getByText(/Page 1 of \d+/)).toBeVisible();
    await this.page.getByRole("button", { name: "Next" }).click();
    await expect(this.page.getByText(/Page 2 of \d+/)).toBeVisible();
  }

  async piiControlsPrimary(): Promise<void> {
    await this.goto("/pii-controls");
    await expect(
      this.page.locator('[data-test="pii-controls-heading"]'),
    ).toBeVisible();

    await this.page
      .locator('[data-test="native-pii-select"]')
      .selectOption("noah");
    await expect(
      this.page.locator('[data-test="native-pii-selection"]'),
    ).toContainText("Passport N2468013");

    await this.page.locator('[data-test="custom-pii-dropdown-button"]').click();
    await this.page.locator('[data-test="custom-pii-option-maya"]').click();
    await expect(
      this.page.locator('[data-test="custom-pii-selection"]'),
    ).toContainText("US00-0001-2345-6789");

    await this.page
      .locator('[data-test="email-pii-select"]')
      .selectOption("iris.patel@example.net");
    await expect(
      this.page.locator('[data-test="email-pii-selection"]'),
    ).toContainText("iris.patel@example.net");

    await this.page.locator('[data-test="phone-pii-dropdown-button"]').click();
    await this.page.locator('[data-test="phone-pii-option-maya"]').click();
    await expect(
      this.page.locator('[data-test="phone-pii-selection"]'),
    ).toContainText("+1 (415) 555-0148");

    await this.page
      .locator('[data-test="mixed-contact-dropdown-button"]')
      .click();
    await this.page
      .locator('[data-test="mixed-contact-option-email-only"]')
      .click();
    await expect(
      this.page.locator('[data-test="mixed-contact-selection"]'),
    ).toContainText("maya.chen@example.com");

    await this.page
      .locator('[data-test="mixed-contact-dropdown-button"]')
      .click();
    await this.page
      .locator('[data-test="mixed-contact-option-phone-name"]')
      .click();
    await expect(
      this.page.locator('[data-test="mixed-contact-selection"]'),
    ).toContainText("+1 (212) 555-0199");

    await this.page.locator('[data-test="pii-action-button-iris"]').click();
    await expect(
      this.page.locator('[data-test="pii-button-result"]'),
    ).toContainText("+1 (212) 555-0199");

    await this.page.locator('[data-test="pii-checkbox-email-consent"]').check();
    await this.page.locator('[data-test="pii-radio-emergency"]').check();
    await expect(
      this.page.locator('[data-test="pii-control-state"]'),
    ).toContainText("maya.chen@example.com");
    await expect(
      this.page.locator('[data-test="pii-control-state"]'),
    ).toContainText("Emergency phone +1 (206) 555-0175");
  }

  async shadowBookBorrowPrimary(): Promise<void> {
    await this.goto("/shadow-book-borrow");
    await expect(
      this.page.locator('[data-test="shadow-book-borrow-heading"]'),
    ).toBeVisible();

    const host = this.page.locator('[data-test="shadow-book-borrow-host"]');
    await expect(host).toBeVisible();

    await host.evaluate((element) => {
      const shadowRoot = (element as HTMLElement).shadowRoot;
      if (!shadowRoot) {
        throw new Error("Shadow book borrow root was not found.");
      }

      const setValue = (selector: string, value: string) => {
        const input = shadowRoot.querySelector(selector) as
          | HTMLInputElement
          | HTMLSelectElement
          | null;
        if (!input) {
          throw new Error(`Unable to find ${selector} inside shadow root.`);
        }
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };

      setValue('[data-test="shadow-borrower-name"]', "Avery Stone");
      setValue(
        '[data-test="shadow-borrower-email"]',
        "avery.stone@example.com",
      );
      setValue('[data-test="shadow-borrower-phone"]', "+1 (503) 555-0134");
      setValue('[data-test="shadow-library-card"]', "LIB-2026-0184");
      setValue('[data-test="shadow-book-title"]', "Clean Code");
      setValue('[data-test="shadow-borrow-date"]', "2026-05-27");
      setValue('[data-test="shadow-due-date"]', "2026-06-10");

      const terms = shadowRoot.querySelector(
        '[data-test="shadow-borrow-terms"]',
      ) as HTMLInputElement | null;
      if (!terms) {
        throw new Error("Unable to find terms checkbox inside shadow root.");
      }
      terms.checked = true;
      terms.dispatchEvent(new Event("change", { bubbles: true }));

      const form = shadowRoot.querySelector(
        '[data-test="shadow-book-borrow-form"]',
      ) as HTMLFormElement | null;
      if (!form) {
        throw new Error("Unable to find borrow form inside shadow root.");
      }
      form.requestSubmit();
    });

    const result = this.page.locator('[data-test="shadow-book-borrow-result"]');
    await expect(result).toContainText("Avery Stone");
    await expect(result).toContainText("avery.stone@example.com");
    await expect(result).toContainText("+1 (503) 555-0134");
    await expect(result).toContainText("Clean Code");
  }

  async uniqueTestDataPrimary(): Promise<void> {
    await this.goto("/unique-test-data");
    await this.page.locator('[data-test="1004"]').fill("123");
    await this.page.locator('[data-test="2000"]').click();
    await this.page.getByRole("button", { name: "Submit" }).click();
    await expect(this.page.locator('[data-test="1006"]')).toContainText("123");
  }

  async uniqueTestDataNegative(): Promise<void> {
    await this.goto("/unique-test-data");
    const firstInput = this.page.locator('[data-test="1004"]');
    await firstInput.fill("abc123");
    await expect(firstInput).toHaveValue("");
  }

  async settingsPrimary(): Promise<void> {
    await this.goto("/settings");
    const key = `qa-key-${Date.now()}`;
    const value = "qa-value";

    await this.page.getByPlaceholder("Key").fill(key);
    await this.page.getByPlaceholder("Value").fill(value);
    await this.page.getByRole("button", { name: "Add" }).click();
    await this.page
      .getByRole("button", { name: /Save All Attributes/ })
      .click();

    await expect(this.page.locator("text=Saved")).toBeVisible();
    await expect(this.page.locator(`input[value="${key}"]`)).toBeVisible();
  }

  async agGridPrimary(): Promise<void> {
    await this.goto("/ag-grid");
    const [download] = await Promise.all([
      this.page.waitForEvent("download", { timeout: 20_000 }),
      this.page.getByTestId("export-csv-btn").click(),
    ]);
    expect(download.suggestedFilename().toLowerCase()).toContain(".csv");
  }

  async tinymceShadowDomPrimary(): Promise<void> {
    await this.goto("/tinymce-shadow-dom");
    const editorContainer = this.page.locator(
      '[data-test="tinymce-editor-container"]',
    );
    await expect(editorContainer).toBeVisible({ timeout: 45_000 });

    const submitButton = this.page.locator('[data-test="tinymce-submit-btn"]');
    await expect(submitButton).toBeVisible({ timeout: 45_000 });

    const dialogPromise = new Promise<string>((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
    await submitButton.click({ timeout: 30_000 });
    expect(await dialogPromise).toMatch(
      /Form submitted successfully|Submission failed!/,
    );
  }

  async dynamicIdLocatorPrimary(): Promise<void> {
    await this.goto("/dynamic-id-locator");
    const before = await this.page
      .locator("#user-role-select")
      .evaluate((el) => el.getAttribute("id"));
    await this.page.getByRole("button", { name: "Regenerate IDs" }).click();
    await expect(this.page.locator("text=Current ID:").first()).toContainText(
      "combobox-input-",
    );
    expect(before).toBe("user-role-select");
  }

  async scenarioTogglePrimary(): Promise<void> {
    await this.goto("/scenario-toggle");
    const statuses = this.page.locator('[data-testid^="status-"]');
    const scenarioCount = await statuses.count();
    expect(scenarioCount).toBeGreaterThan(0);

    await this.page.getByTestId("disable-all-btn").click();
    for (let i = 0; i < scenarioCount; i += 1) {
      await expect(statuses.nth(i)).toHaveText("Disabled");
    }

    await this.page.getByTestId("enable-all-btn").click();
    for (let i = 0; i < scenarioCount; i += 1) {
      await expect(statuses.nth(i)).toHaveText("Enabled");
    }
  }

  async formBuilderHtml5Primary(): Promise<void> {
    await this.goto("/form-builder-html5");
    const source = this.page.getByTestId("section-contact").first();
    const target = this.page.getByTestId("drop-zone-empty");

    const dataTransfer = await this.page.evaluateHandle(
      () => new DataTransfer(),
    );
    await source.dispatchEvent("dragstart", { dataTransfer });
    await target.dispatchEvent("dragover", { dataTransfer });
    await target.dispatchEvent("drop", { dataTransfer });

    await expect(this.page.getByTestId("drop-zone-empty")).toHaveCount(0);
    await expect(
      this.page.getByRole("button", { name: "Show Live Form Preview" }),
    ).toBeVisible();
  }

  async challengingFormPrimary(): Promise<void> {
    await this.goto("/challenging-form");
    await this.page.getByPlaceholder("Enter your full name").fill("QA User");
    await this.page.getByPlaceholder("Enter your email").fill("qa@example.com");
    await this.page
      .getByPlaceholder("Enter your phone number")
      .fill("1234567890");

    await this.page.getByRole("button", { name: "Submit Form" }).click();
    const successHeading = this.page.getByRole("heading", {
      name: "Form Submitted Successfully! ✅",
      exact: true,
    });
    const resultPanel = successHeading.locator("xpath=ancestor::div[1]");
    await expect(resultPanel).toBeVisible();
    await expect(resultPanel).toContainText("Name: QA User");
    await expect(resultPanel).toContainText("Email: qa@example.com");
    await expect(resultPanel).toContainText("Phone: 1234567890");
  }

  async challengingFormNegative(): Promise<void> {
    await this.goto("/challenging-form");
    await this.page.getByRole("button", { name: "Submit Form" }).click();
    const successHeading = this.page.getByRole("heading", {
      name: "Form Submitted Successfully! ✅",
      exact: true,
    });
    const resultPanel = successHeading.locator("xpath=ancestor::div[1]");
    await expect(resultPanel).toBeVisible();
    await expect(resultPanel).toContainText("Name:");
    await expect(resultPanel).toContainText("Email:");
  }

  async ctrlClickTablePrimary(): Promise<void> {
    await this.goto("/ctrl-click-table");
    const row = this.page.locator('[data-test="table2-row-1"]');
    await row.dblclick();

    await expect(
      this.page.locator('[data-test="row-edit-modal"]'),
    ).toBeVisible();
    await this.page
      .locator('[data-test="modal-field-product"]')
      .fill("Updated Product 1");
    await this.page.locator('[data-test="modal-save-btn"]').click();

    await expect(this.page.locator('[data-test="table2-row-1"]')).toContainText(
      "Updated Product 1",
    );
  }
}
