import { test, expect } from "../../fixtures/app.fixtures";

const caseIds = [
  "T01",
  "T02",
  "T03",
  "T04",
  "T05",
  "T06",
  "T07",
  "T08",
  "T09",
  "T10",
  "T11",
  "S01",
  "S02",
  "S03",
  "S04",
  "S05",
];

const textValues: Record<string, string> = {
  T01: "Print & Complete",
  T02: " Print & Complete ",
  T03: " Print & Complete\n",
  T04: "Line 1 & Continue\r\nLine 2",
  T05: " Save < Exit ",
  T06: " Save > Exit ",
  T08: "Print & Complete",
  T10: "Fish &amp; Chips",
  T11: "A &#38; B",
};

test.describe("@regression Product 2476 XML-sensitive fixtures", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/product-2476-xml-values");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "XML-sensitive tracking fixtures",
    );
  });

  test("route and all unique fixture targets load", async ({ page }) => {
    await expect(page).toHaveURL(/\/product-2476-xml-values$/);

    const renderedIds = await page
      .locator("[data-case-id]")
      .evaluateAll((elements) =>
        elements.map(
          (element) => (element as HTMLElement).dataset.caseId ?? "",
        ),
      );

    expect(renderedIds).toEqual(caseIds);
    expect(new Set(renderedIds).size).toBe(caseIds.length);
  });

  test("tracked DOM fields preserve exact XML-sensitive values", async ({
    page,
  }) => {
    for (const [caseId, expectedValue] of Object.entries(textValues)) {
      const actualValue = await page
        .locator(`[data-case-id="${caseId}"]`)
        .evaluate((element) => element.textContent);
      expect(actualValue).toBe(expectedValue);
    }

    await expect(page.locator('[data-case-id="T07"]')).toHaveAttribute(
      "title",
      "Review & Sign < Continue",
    );
    await expect(page.locator('[data-case-id="T07"]')).toHaveAttribute(
      "aria-label",
      "Review & Sign < Continue",
    );
    await expect(page.locator('[data-case-id="T09"]')).toHaveAttribute(
      "data-comparison",
      "A < B",
    );
    await expect(page.locator('[data-case-id="T09"]')).toHaveAttribute(
      "title",
      "Compare A < B",
    );

    await expect(page.locator('[data-case-id="S03"]')).toHaveAttribute(
      "aria-label",
      "Email *",
    );
    await expect(page.locator('[data-case-id="S03"]')).toHaveAttribute(
      "placeholder",
      "Email *",
    );
    await expect(page.locator('[data-case-id="S04"]')).toHaveAttribute(
      "id",
      "DomainPolicy_InsuredSuffix",
    );
    await expect(page.locator('[data-case-id="S04"]')).toHaveAttribute(
      "aria-label",
      "Select...",
    );
    await expect(page.locator('[data-case-id="S05"]')).toHaveAttribute(
      "id",
      "123-xml2476-phone",
    );
    await expect(page.locator('[data-case-id="S05"]')).toHaveAttribute(
      "placeholder",
      "1234567890",
    );

    await expect(
      page.locator(
        '.selector2476-shell[data-scope=\'QA "quoted" space\'] > .selector2476-direct-child[data-state="ready to track"] > [data-case-id="S01"]',
      ),
    ).toHaveCount(1);
    await expect(page.locator('[data-case-id="S02"]')).toHaveAttribute(
      "class",
      "xml2476-dynamic-target replaceable-id replaceable-class",
    );
  });

  test("click order is logged and tracked values never mutate", async ({
    page,
  }) => {
    const before = await page
      .locator("[data-case-id]")
      .evaluateAll((elements) =>
        elements.map((element) => ({
          id: (element as HTMLElement).dataset.caseId,
          textContent: element.textContent,
          attributes: Array.from(element.attributes).map((attribute) => [
            attribute.name,
            attribute.value,
          ]),
        })),
      );

    for (const caseId of caseIds) {
      await page.locator(`[data-case-id="${caseId}"]`).click();
    }

    const loggedIds = await page
      .locator('[data-test="xml2476-click-log"] [data-click-case-id]')
      .evaluateAll((items) =>
        items.map((item) => item.getAttribute("data-click-case-id")),
      );
    expect(loggedIds).toEqual(caseIds);

    const after = await page.locator("[data-case-id]").evaluateAll((elements) =>
      elements.map((element) => ({
        id: (element as HTMLElement).dataset.caseId,
        textContent: element.textContent,
        attributes: Array.from(element.attributes).map((attribute) => [
          attribute.name,
          attribute.value,
        ]),
      })),
    );
    expect(after).toEqual(before);
  });

  test("browser verification utility reports every fixture as matching", async ({
    page,
  }) => {
    const verification = await page.evaluate(() =>
      window.verifyXml2476Fixtures?.(),
    );

    expect(verification).toHaveLength(caseIds.length);
    expect(verification?.every((item) => item.matches)).toBe(true);

    await page.locator('[data-test="verify-xml2476-fixtures"]').click();
    await expect(
      page.locator('[data-test="xml2476-verification-status"]'),
    ).toHaveText("All fixture values match.");
  });
});
