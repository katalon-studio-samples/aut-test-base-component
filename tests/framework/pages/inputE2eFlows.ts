import { expect, type Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";

interface ProductRowData {
  name: string;
  category: string;
  rating: number;
}

export class InputE2eFlows extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private async goto(path: string): Promise<void> {
    await this.gotoPath(path);
    await this.dismissKatalonConfigBannerIfPresent();
  }

  private async readProductRows(): Promise<ProductRowData[]> {
    return this.page.locator('tr[data-product-id]').evaluateAll((rows) =>
      rows.map((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        const rawRating = cells[4]?.textContent?.trim() || "";
        return {
          name: cells[1]?.textContent?.trim() || "",
          category: cells[2]?.textContent?.trim() || "",
          rating: Number.parseFloat(rawRating.replace("★", "")),
        };
      }),
    );
  }

  async checkboxDefaultSelectionSummary(): Promise<void> {
    await this.goto("/input/checkbox");
    await this.page.locator('input[type="button"][value="Show Selection"]').click();

    const result = this.page.locator('[id$="-result"]');
    await expect(result).toContainText("Receive newsletter: Yes");
    await expect(result).toContainText("Enable notifications: No");
    await expect(result).toContainText("Accept terms and conditions: No");
  }

  async checkboxToggleSelectionSummary(): Promise<void> {
    await this.goto("/input/checkbox");
    await this.page.getByLabel("Receive newsletter").uncheck();
    await this.page.getByLabel("Enable notifications").check();
    await this.page.getByLabel("Accept terms and conditions").check();
    await this.page.locator('input[type="button"][value="Show Selection"]').click();

    const result = this.page.locator('[id$="-result"]');
    await expect(result).toContainText("Receive newsletter: No");
    await expect(result).toContainText("Enable notifications: Yes");
    await expect(result).toContainText("Accept terms and conditions: Yes");
  }

  async radioSearchFilteredResults(): Promise<void> {
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

    const rows = await this.readProductRows();
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.name.toLowerCase()).toContain("wireless");
      expect(row.category).toBe("Electronics");
      expect(row.rating).toBeGreaterThanOrEqual(4);
    }
  }

  async radioSearchNoResultState(): Promise<void> {
    await this.goto("/input/radio-search-submit");
    await this.page.getByTestId("search-input").fill("product-not-found-xyz");
    await this.page
      .locator('input[type="submit"][value="Search Products"]')
      .click();

    await expect(
      this.page.getByRole("heading", { name: /Search Results \(0 products found\)/ }),
    ).toBeVisible();
    await expect(this.page.getByText("No products found matching your criteria.")).toBeVisible();
    await expect(this.page.locator('tr[data-product-id]')).toHaveCount(0);
  }

  async radioSearchAutocompleteKeyboardFlow(): Promise<void> {
    await this.goto("/input/radio-search-submit");
    await this.page.getByLabel("Autocomplete Search").check();

    const searchInput = this.page.getByTestId("search-input");
    await searchInput.fill("wire");
    await expect(this.page.getByTestId("suggestions-container")).toBeVisible();

    await searchInput.press("ArrowDown");
    await searchInput.press("Enter");
    await expect(searchInput).toHaveValue(/wire/i);

    await this.page
      .locator('input[type="submit"][value="Search Products"]')
      .click();

    const rows = await this.readProductRows();
    expect(rows.length).toBeGreaterThan(0);
  }

  async radioSearchResetRestoresDefaults(): Promise<void> {
    await this.goto("/input/radio-search-submit");
    const searchInput = this.page.getByTestId("search-input");

    await this.page.getByLabel("Autocomplete Search").check();
    await searchInput.fill("Wireless");
    await searchInput.press("Escape");
    await this.page.getByLabel("Accessories").check();
    await this.page.getByLabel("Under $30").check();
    await this.page.getByLabel("4.5+ Stars").check();
    await this.page.locator('input[type="button"][value="Reset Filters"]').click();

    await expect(this.page.getByLabel("Regular Search")).toBeChecked();
    await expect(this.page.getByLabel("All Categories")).toBeChecked();
    await expect(this.page.getByLabel("All Prices")).toBeChecked();
    await expect(this.page.getByLabel("Any Rating")).toBeChecked();
    await expect(searchInput).toHaveValue("");
    await expect(this.page.getByRole("heading", { name: "All Products" })).toBeVisible();
  }

  async formInputsValidSubmission(): Promise<void> {
    await this.goto("/input/form-inputs");
    await this.page.getByLabel("Email Address: *").fill("input.e2e@example.com");

    const submitButton = this.page.locator('input[type="image"][alt="Submit"]');
    await expect(submitButton).toBeDisabled();

    await this.page.locator('[id$="-captcha-image"]').click();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    const result = this.page.locator('[id$="-result"]');
    await expect(result).toContainText('"email": "input.e2e@example.com"', {
      timeout: 12_000,
    });
    await expect(result).toContainText('"submittedAt"');
  }

  async formInputsValidationSummary(): Promise<void> {
    await this.goto("/input/form-inputs");
    await this.page.getByLabel("Email Address: *").fill("qa@example.com");
    await this.page.locator('[id$="-ssn"]').fill("12345");
    await this.page.locator('[id$="-phone"]').fill("abc");
    await this.page.locator('[id$="-ipv4"]').fill("999.999.10.10");
    await this.page
      .locator('[id$="-linkedin"]')
      .fill("https://example.com/not-linkedin");
    await this.page.locator('[id$="-captcha-image"]').click();
    await this.page.locator('input[type="image"][alt="Submit"]').click();

    const summary = this.page.locator('[id$="-validation-summary"]');
    await expect(summary).toBeVisible({ timeout: 12_000 });
    await expect(summary).toContainText("SSN must be in format XXX-XX-XXXX");
    await expect(summary).toContainText("Please enter a valid phone number");
    await expect(summary).toContainText(
      "Please enter a valid IPv4 address (e.g., 192.168.1.1)",
    );
    await expect(summary).toContainText("Please enter a valid LinkedIn profile URL");
    await expect(this.page.locator('[id$="-result"]')).toHaveCount(0);
  }

  async formInputsPasswordMismatchValidation(): Promise<void> {
    await this.goto("/input/form-inputs");
    await this.page.getByLabel("Email Address: *").fill("qa@example.com");
    await this.page.getByLabel("Change Password").check();
    await this.page
      .locator('input[type="password"][id$="-password"]:not([id*="confirm"])')
      .fill("Password1");
    await this.page
      .locator('input[type="password"][id$="-confirm-password"]')
      .fill("Password2");
    await this.page.locator('[id$="-captcha-image"]').click();
    await this.page.locator('input[type="image"][alt="Submit"]').click();

    await expect(this.page.locator('[id$="-confirm-password-error"]')).toContainText(
      "Passwords do not match",
      { timeout: 12_000 },
    );
    await expect(this.page.locator('[id$="-result"]')).toHaveCount(0);
  }

  async formInputsTrackingToggleExclusivity(): Promise<void> {
    await this.goto("/input/form-inputs");
    const dontTrack = this.page.getByLabel("Don't track me");
    const track = this.page.getByLabel("Enable tracking for me");
    const emailInput = this.page.locator('[id$="-email"]');

    await dontTrack.check();
    await expect(dontTrack).toBeChecked();
    await expect(track).not.toBeChecked();
    await expect(emailInput).toHaveClass(/katalon-excluded/);

    await track.check();
    await expect(track).toBeChecked();
    await expect(dontTrack).not.toBeChecked();
    await expect(emailInput).toHaveClass(/katalon-included/);
  }
}
