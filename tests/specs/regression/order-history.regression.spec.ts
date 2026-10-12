import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Functional baseline must not send fixture traffic to a customer AUT.
  await page.route("https://static*.katalon.com/**", (route) => route.abort());
  await page.goto("/truephamacy-order");
});

test("@regression order history searches, combines filters and sorts", async ({
  page,
}) => {
  const rows = page.locator("#order-history-table tbody tr.order-row");
  await expect(
    page.getByRole("heading", { name: "Order history", exact: true }),
  ).toBeVisible();
  await expect(rows).toHaveCount(25);
  await page.getByLabel("Search orders").fill("DEMO-000042");
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText("DEMO-000042");
  await page.getByLabel("Search orders").fill("");
  await page
    .getByLabel("Order status", { exact: true })
    .selectOption("Shipped");
  await page.getByLabel("Order type", { exact: true }).selectOption("REGULAR");
  await expect(rows).not.toHaveCount(0);
  const matches = await rows.evaluateAll((nodes) =>
    nodes.every(
      (n) =>
        n.textContent?.includes("Shipped") &&
        n.textContent?.includes("REGULAR"),
    ),
  );
  expect(matches).toBe(true);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page
    .getByRole("button", { name: "Sort by Order #", exact: true })
    .click();
  await expect(rows.first()).toContainText("DEMO-000001");
  await page
    .getByRole("button", { name: "Sort by Order #", exact: true })
    .click();
  await expect(rows.first()).toContainText("DEMO-000250");
  await page.getByLabel("From date").fill("2027-01-01");
  await expect(page.getByText("No orders match your filters.")).toBeVisible();
});

test("@regression row edits survive search, sort and pagination", async ({
  page,
}) => {
  await page.getByLabel("Search orders").fill("DEMO-000042");
  await page.getByLabel("PO # for DEMO-000042", { exact: true }).fill("MY-PO");
  await page.getByLabel("Quantity for DEMO-000042", { exact: true }).fill("17");
  await page
    .getByLabel("Notes for DEMO-000042", { exact: true })
    .fill("Replay input check");
  await page.getByLabel("Select DEMO-000042", { exact: true }).check();
  await page.getByLabel("Search orders").fill("");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await page
    .getByRole("button", { name: "Sort by Order #", exact: true })
    .click();
  await page.getByLabel("Search orders").fill("MY-PO");
  await expect(
    page.getByLabel("Quantity for DEMO-000042", { exact: true }),
  ).toHaveValue("17");
  await expect(
    page.getByLabel("Notes for DEMO-000042", { exact: true }),
  ).toHaveValue("Replay input check");
  await expect(
    page.getByLabel("Select DEMO-000042", { exact: true }),
  ).toBeChecked();
});

test("@regression random row count is bounded and all rows mount in the DOM", async ({
  page,
}) => {
  const rows = page.locator("#order-history-table tbody tr.order-row");
  await page.getByLabel("Minimum rows").fill("120");
  await page.getByLabel("Maximum rows").fill("130");
  await page
    .getByRole("button", { name: "Randomize rows", exact: true })
    .click();
  await page.getByLabel("Render all rows (no pagination)").check();
  const count = await rows.count();
  expect(count).toBeGreaterThanOrEqual(120);
  expect(count).toBeLessThanOrEqual(130);
  await expect(
    page.locator("#order-history-table tbody input[type=text]"),
  ).toHaveCount(count * 2);
  await page.getByLabel("Row count", { exact: true }).fill("1000");
  await page
    .getByRole("button", { name: "Generate rows", exact: true })
    .click();
  await expect(rows).toHaveCount(1000);
  await page.getByLabel("Minimum rows").fill("140");
  await page
    .getByRole("button", { name: "Randomize rows", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Minimum rows must not exceed maximum rows",
  );
  await expect(rows).toHaveCount(1000);
});

test("@regression pagination, date bounds and row-count validation", async ({
  page,
}) => {
  const rows = page.locator("#order-history-table tbody tr.order-row");
  await page.getByLabel("Items per page", { exact: true }).selectOption("10");
  await expect(rows).toHaveCount(10);
  const first = await rows.first().getAttribute("data-order-id");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  expect(await rows.first().getAttribute("data-order-id")).not.toBe(first);
  await page
    .getByRole("button", { name: "Previous page", exact: true })
    .click();
  expect(await rows.first().getAttribute("data-order-id")).toBe(first);
  await page.getByLabel("From date").fill("2026-10-07");
  await page.getByLabel("To date").fill("2026-10-07");
  await expect(rows).toHaveCount(9);
  await expect(
    page.getByRole("button", { name: "Next page", exact: true }),
  ).toBeDisabled();
  for (const value of ["0", "1.5", "10001", ""]) {
    await page.getByLabel("Row count", { exact: true }).fill(value);
    await page
      .getByRole("button", { name: "Generate rows", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText("Enter a whole number");
    await expect(rows).toHaveCount(9);
  }
});

test("@regression production loader uses the canonical host and route extensions work", async ({
  page,
}) => {
  const scripts: string[] = [];
  await page.route("https://static*.katalon.com/**", (route) => {
    scripts.push(route.request().url());
    return route.fulfill({
      contentType: "application/javascript",
      body: "/* loader test stub */",
    });
  });
  await page.goto("/truephamacy-order.html?env=prod&clientCode=DEMO-LOADER-ONLY");
  await expect(
    page.getByRole("heading", { name: "Order history", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      scripts.some((url) =>
        url.startsWith(
          "https://static.katalon.com/libs/traffic-agent/v1/traffic-agent.min.js",
        ),
      ),
    )
    .toBe(true);
  expect(scripts.every((url) => !url.includes("static.prod.katalon.com"))).toBe(
    true,
  );
  await expect(
    page.locator('script[client-code="DEMO-LOADER-ONLY"]'),
  ).toHaveCount(1);
  await page
    .getByRole("link", { name: "Back to base component", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("link", { name: "TruePhamacy", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "TruePhamacy", exact: true }).click();
  await expect(page).toHaveURL(/\/truephamacy-order(?:\.html)?$/);
  await expect(page.locator(".truephamacy-brand")).toHaveText("TruePhamacy");
  await page.getByLabel("Render all rows (no pagination)").check();
  await page.locator("tr.order-row summary").first().click();
  const content = await page.locator("body").textContent();
  expect(content).not.toMatch(/vantus|cardinal\s*health|orderexpress|performance fixture/i);
});
