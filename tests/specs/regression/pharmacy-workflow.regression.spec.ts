import { test, expect, Page, Locator } from "@playwright/test";
const BASE = "/truephamacy-workflow";
const cream = "Demo Care Cream · 30 g";
const invoice = "INV-DEMO-1001-1";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("katalon-client-code");
  });
  await page.route("**/libs/traffic-agent/**", (route) =>
    route.fulfill({ contentType: "text/javascript", body: "" }),
  );
});
async function addCream(page: Page) {
  await page.goto(`${BASE}/search?q=care`);
  await page
    .getByRole("spinbutton", { name: `Quantity for ${cream}`, exact: true })
    .fill("2");
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await page.getByRole("button", { name: "View cart", exact: true }).click();
  await page
    .getByRole("button", { name: "Create return request", exact: true })
    .click();
  await expect(page.getByTestId("return-card-care-cream")).toBeVisible();
}
async function matchRow(page: Page, row: Locator, id = invoice) {
  await row.getByRole("button", { name: /Match.*to invoice/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("radio", { name: `Select invoice ${id}`, exact: true })
    .check();
  await dialog.getByRole("button", { name: "Apply invoice match" }).click();
  await expect(dialog).not.toBeVisible();
}
test("complete search/cart/serialized-return/invoice/history flow @regression", async ({
  page,
}) => {
  await page.goto(`${BASE}/search?q=care`);
  await page
    .getByRole("spinbutton", { name: `Quantity for ${cream}`, exact: true })
    .fill("2");
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await page.getByRole("button", { name: "View cart", exact: true }).click();
  await page
    .getByRole("spinbutton", { name: `Cart quantity for ${cream}` })
    .fill("3");
  await page.getByLabel("PO number", { exact: true }).fill("PO-LOCAL-TEST");
  await page
    .getByRole("switch", { name: `Do not substitute ${cream}` })
    .click();
  await page.reload();
  await expect(
    page.getByRole("spinbutton", { name: `Cart quantity for ${cream}` }),
  ).toHaveValue("3");
  await expect(page.getByLabel("PO number", { exact: true })).toHaveValue(
    "PO-LOCAL-TEST",
  );
  await expect(
    page.getByRole("switch", { name: `Do not substitute ${cream}` }),
  ).toHaveAttribute("aria-checked", "true");
  await page
    .getByRole("button", { name: "Create return request", exact: true })
    .click();
  const card = page.getByTestId("return-card-care-cream");
  await card.getByLabel("Return reason").selectOption("Ordered in error");
  await card.getByRole("button", { name: "Add new row" }).click();
  const rows = card.getByTestId(/^return-row-/);
  for (let i = 0; i < 2; i++) {
    await rows
      .nth(i)
      .getByRole("textbox", { name: /Serial for/ })
      .fill(`10000${i + 1}`);
    await rows
      .nth(i)
      .getByRole("textbox", { name: /GTIN for/ })
      .fill("00000000001001");
  }
  await rows
    .nth(0)
    .getByRole("combobox", { name: /Unit for/ })
    .selectOption("Case");
  await matchRow(page, rows.nth(0));
  await matchRow(page, rows.nth(1));
  await expect(card).toContainText("$64.75");
  await page.getByLabel("Request comment").fill("Local validation request");
  await page
    .getByRole("button", { name: "Submit return request", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Return request submitted",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".wf-success")).toContainText("5 units");
  await page.getByRole("button", { name: "View return history" }).click();
  await expect(page.getByRole("table")).toContainText("RGA-DEMO-");
  await page.reload();
  await expect(page.getByRole("table")).toContainText("$64.75");
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await page.getByRole("button", { name: "Reset all demo data" }).click();
  await page.goto(`${BASE}/returns/history`);
  await expect(
    page.getByText("No return requests have been submitted yet."),
  ).toBeVisible();
});
test("serialized validation rejects missing reason, invalid GTIN and duplicate serials @regression", async ({
  page,
}) => {
  await addCream(page);
  const card = page.getByTestId("return-card-care-cream");
  const row = card.getByTestId(/^return-row-/).first();
  await page
    .getByRole("button", { name: "Submit return request", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Choose a return reason");
  await card.getByLabel("Return reason").selectOption("Damaged packaging");
  await row.getByRole("button", { name: /Match.*to invoice/ }).click();
  await expect(page.getByRole("alert")).toContainText("Serial must contain");
  await row.getByRole("textbox", { name: /Serial for/ }).fill("100001");
  await row.getByRole("textbox", { name: /GTIN for/ }).fill("123");
  await row.getByRole("button", { name: /Match.*to invoice/ }).click();
  await expect(page.getByRole("alert")).toContainText("GTIN must contain");
  await row.getByRole("textbox", { name: /GTIN for/ }).fill("00000000001001");
  await card.getByRole("button", { name: "Add new row" }).click();
  const second = card.getByTestId(/^return-row-/).nth(1);
  await second.getByRole("textbox", { name: /Serial for/ }).fill("100001");
  await second
    .getByRole("textbox", { name: /GTIN for/ })
    .fill("00000000001001");
  await second.getByRole("button", { name: /Match.*to invoice/ }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Serial numbers must be unique",
  );
});
test("non-serialized returns enforce aggregate invoice balance and persist consumption @regression", async ({
  page,
}) => {
  await page.goto(`${BASE}/returns/return-request`);
  await page.getByRole("button", { name: "Add product", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", {
      name: "Add Demo Gentle Cleanser · 120 ml to return",
      exact: true,
    })
    .click();
  const card = page.getByTestId("return-card-cleanser");
  await card.getByLabel("Return reason").selectOption("Other");
  const row = card.getByTestId(/^return-row-/).first();
  await row.getByRole("spinbutton").fill("10");
  await matchRow(page, row, "INV-DEMO-1003-1");
  await card.getByRole("button", { name: "Add new row" }).click();
  const second = card.getByTestId(/^return-row-/).nth(1);
  await second.getByRole("spinbutton").fill("13");
  await second.getByRole("button", { name: /Match.*to invoice/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("radio", { name: "Select invoice INV-DEMO-1003-1", exact: true })
    .check();
  await dialog.getByRole("button", { name: "Apply invoice match" }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "exceeds the remaining",
  );
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await second.getByRole("spinbutton").fill("12");
  await matchRow(page, second, "INV-DEMO-1003-1");
  await page
    .getByRole("button", { name: "Submit return request", exact: true })
    .click();
  await expect(page.locator(".wf-success")).toContainText("$192.50");
  await page.getByRole("button", { name: "Create another return" }).click();
  await page.getByRole("button", { name: "Add product", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", {
      name: "Add Demo Gentle Cleanser · 120 ml to return",
      exact: true,
    })
    .click();
  await card
    .getByTestId(/^return-row-/)
    .first()
    .getByRole("button", { name: /Match.*to invoice/ })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("radio", { name: "Select invoice INV-DEMO-1003-1", exact: true })
    .check();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Apply invoice match" })
    .click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "exceeds the remaining",
  );
});
test("unsaved draft guards app navigation and browser Back; cancel preserves rows @regression", async ({
  page,
}) => {
  await addCream(page);
  const serial = page
    .getByTestId("return-card-care-cream")
    .getByRole("textbox", { name: /Serial for/ });
  await serial.fill("991122");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Progress will not be saved" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Go back and submit changes" })
    .click();
  await expect(serial).toHaveValue("991122");
  await page.goBack();
  await expect(
    page.getByRole("dialog", { name: "Progress will not be saved" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/returns\/return-request/);
  await page
    .getByRole("button", { name: "Go back and submit changes" })
    .click();
  await expect(serial).toHaveValue("991122");
  await page.goBack();
  await page.getByRole("button", { name: "Leave and discard changes" }).click();
  await expect(page).toHaveURL(/\/cart/);
  await page
    .getByRole("button", { name: "Create return request", exact: true })
    .click();
  await expect(
    page
      .getByTestId("return-card-care-cream")
      .getByRole("textbox", { name: /Serial for/ }),
  ).toHaveValue("");
});
test("search filters, pagination, empty results and cart submission work locally @regression", async ({
  page,
}) => {
  await page.goto(BASE);
  await expect(
    page
      .getByRole("table", { name: "Demo product catalog" })
      .locator("tbody tr"),
  ).toHaveCount(200);
  await expect(
    page.getByText("5000 products in the demo catalog"),
  ).toBeVisible();
  await expect(page.getByLabel("Items per page", { exact: true })).toHaveValue(
    "200",
  );
  await expect(page.getByText("Page 1 of 25", { exact: true })).toBeVisible();
  await page.getByLabel("Items per page", { exact: true }).selectOption("10");
  await page.getByRole("button", { name: "Next product page" }).click();
  await expect(page.getByText("Page 2 of 500")).toBeVisible();
  await page.getByLabel("Category", { exact: true }).selectOption("Cold chain");
  await expect(page.getByText("2 products in the demo catalog")).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search products", exact: true })
    .fill("does-not-exist");
  await page
    .getByRole("button", { name: "Search products", exact: true })
    .click();
  await expect(page.getByText("No products match your search.")).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page
    .getByRole("spinbutton", { name: `Quantity for ${cream}`, exact: true })
    .fill("2");
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await page.getByRole("button", { name: "View cart" }).click();
  await page.getByRole("button", { name: "Submit cart", exact: true }).click();
  await page.getByRole("button", { name: "Confirm local submission" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Practice cart submitted locally",
  );
});

test("all eight catalog columns sort both directions across the paginated 5,000-product catalog @regression", async ({
  page,
}) => {
  await page.goto(BASE);
  const table = page.getByRole("table", { name: "Demo product catalog" });
  await page
    .getByRole("spinbutton", { name: `Quantity for ${cream}`, exact: true })
    .fill("2");
  await page
    .getByRole("spinbutton", {
      name: "Quantity for Demo Care Gel · 60 g",
      exact: true,
    })
    .fill("10");
  await page
    .getByRole("button", { name: `Favorite ${cream}`, exact: true })
    .click();
  const columns = [
    "Qty",
    "Product name",
    "Stock",
    "NDC",
    "CIN",
    "Packaging",
    "Unit cost",
    "Favorites",
  ];
  for (const [index, label] of columns.entries()) {
    const header = table.getByRole("columnheader").nth(index + 1);
    const button = header.getByRole("button", {
      name: `Sort products by ${label}`,
      exact: true,
    });
    await button.click();
    await expect(header).toHaveAttribute("aria-sort", "ascending");
    for (const descending of [false, true]) {
      if (descending) await button.click();
      await expect(header).toHaveAttribute(
        "aria-sort",
        descending ? "descending" : "ascending",
      );
      const values = await table.locator("tbody tr").evaluateAll(
        (rows, col) =>
          rows.map((row) => {
            const cell = row.querySelectorAll("td")[col + 1];
            if (col === 0)
              return Number(cell.querySelector("input")!.value || 0);
            if (col === 1) return cell.querySelector("strong")!.textContent!;
            if (col === 2)
              return Number(
                cell.querySelector("small")!.textContent!.split(" ")[0],
              );
            if (col === 6)
              return Number(cell.textContent!.replace(/[^\d.]/g, ""));
            if (col === 7)
              return Number(
                cell.querySelector("button")!.getAttribute("aria-pressed") ===
                  "true",
              );
            return cell.textContent!.trim();
          }),
        index,
      );
      expect(values).toHaveLength(200);
      for (let i = 1; i < values.length; i++) {
        const a = values[i - 1],
          b = values[i];
        const order =
          typeof a === "number" && typeof b === "number"
            ? a - b
            : String(a).localeCompare(String(b), undefined, { numeric: true });
        if (descending) expect(order).toBeGreaterThanOrEqual(0);
        else expect(order).toBeLessThanOrEqual(0);
      }
    }
  }
  await expect(
    page.getByRole("spinbutton", {
      name: `Quantity for ${cream}`,
      exact: true,
    }),
  ).toHaveValue("2");
  await page.getByLabel("Items per page", { exact: true }).selectOption("10");
  await page.getByRole("button", { name: "Next product page" }).click();
  await expect(page.getByText("Page 2 of 500")).toBeVisible();
  await table
    .getByRole("button", { name: "Sort products by Stock", exact: true })
    .click();
  await expect(page.getByText("Page 1 of 500")).toBeVisible();
  await table
    .getByRole("button", { name: "Sort products by Stock", exact: true })
    .click();
  await expect(
    table.locator("tbody tr").first().locator("td").nth(3),
  ).toContainText("120 units available");
});

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`workflow fields, menus and dialogs fit ${width}px @regression`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${BASE}/search?q=care`);
    const fits = async (locator: Locator) => {
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    };
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width);
    const banner = page.locator("#katalon-config-banner");
    const brand = page.locator(".wf-brand");
    expect((await brand.boundingBox())!.y).toBeGreaterThanOrEqual(
      (await banner.boundingBox())!.height,
    );
    if (width < 768) {
      await page
        .getByRole("button", { name: "Toggle menu", exact: true })
        .click();
      await expect(page.locator(".app-side-nav")).toHaveClass(/translate-x-0/);
      await page
        .getByRole("button", { name: "Toggle menu", exact: true })
        .click();
    }
    await fits(
      page.getByRole("searchbox", { name: "Search products", exact: true }),
    );
    expect(
      (await page
        .getByRole("searchbox", { name: "Search products", exact: true })
        .boundingBox())!.width,
    ).toBeGreaterThan(150);
    const category = page.getByLabel("Category", { exact: true });
    const categoryBox = (await category.boundingBox())!;
    const filterBox = (await page.locator(".wf-filterbar").boundingBox())!;
    expect(categoryBox.x + categoryBox.width).toBeLessThanOrEqual(
      filterBox.x + filterBox.width,
    );
    await page.locator(".wf-nav-menu summary").click();
    await fits(page.locator(".wf-nav-menu > div"));
    await page.locator(".wf-nav-menu summary").click();
    const add = page.getByRole("button", { name: "Add to cart", exact: true });
    expect((await add.boundingBox())!.y).toBeLessThan(
      (await page
        .getByRole("table", { name: "Demo product catalog" })
        .boundingBox())!.y,
    );
    await page
      .getByRole("spinbutton", { name: `Quantity for ${cream}`, exact: true })
      .fill("2");
    await add.click();
    await page.getByRole("button", { name: "View cart", exact: true }).click();
    await fits(page.getByLabel("PO number", { exact: true }));
    await fits(page.getByLabel("PO memo", { exact: true }));
    await page
      .getByRole("button", { name: "Create return request", exact: true })
      .click();
    const card = page.getByTestId("return-card-care-cream");
    const reason = card.getByRole("combobox", { name: /Return reason/ });
    const comment = card.getByRole("textbox", {
      name: "Product comment",
      exact: true,
    });
    const reasonBox = (await reason.boundingBox())!,
      commentBox = (await comment.boundingBox())!;
    expect(reasonBox.height).toBe(commentBox.height);
    if (width >= 1024) expect(reasonBox.y).toBe(commentBox.y);
    else {
      expect(reasonBox.x).toBe(commentBox.x);
      expect(reasonBox.width).toBe(commentBox.width);
    }
    await fits(reason);
    await fits(comment);
    await page
      .getByRole("button", { name: "Add product", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await fits(dialog);
    const dialogBox = (await dialog.boundingBox())!;
    expect(dialogBox.y).toBeGreaterThanOrEqual(0);
    expect(dialogBox.y + dialogBox.height).toBeLessThanOrEqual(845);
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await dialog.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await dialog
      .getByRole("button", { name: "Close dialog", exact: true })
      .click();
    await expect(dialog).not.toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width);
    await page
      .getByRole("button", {
        name: "Dismiss configuration banner",
        exact: true,
      })
      .click();
    await expect
      .poll(() =>
        page.evaluate(() => document.getElementById("root")!.style.paddingTop),
      )
      .toBe("0px");
  });
}

test("row selection and select all add in-stock products across pages to the cart @regression", async ({
  page,
}) => {
  await page.goto(BASE);
  const all = page.getByRole("checkbox", {
    name: "Select all in-stock products on this page",
    exact: true,
  });
  const row = page.getByRole("checkbox", {
    name: `Select ${cream}`,
    exact: true,
  });
  const quantity = page.getByRole("spinbutton", {
    name: `Quantity for ${cream}`,
    exact: true,
  });
  await row.check();
  await expect(quantity).toHaveValue("1");
  await expect(all).toBeChecked({ indeterminate: true });
  await quantity.fill("2");
  await all.check();
  await expect(quantity).toHaveValue("2");
  await expect(all).toBeChecked();
  const selected = page.getByText(/^\d+ products selected$/);
  const count = Number((await selected.textContent())!.split(" ")[0]);
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(200);
  const outOfStock = page
    .getByRole("table", { name: "Demo product catalog" })
    .locator("tbody tr")
    .filter({ hasText: "OUT OF STOCK" });
  expect(await outOfStock.count()).toBeGreaterThan(0);
  for (const checkbox of await outOfStock.getByRole("checkbox").all()) {
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).not.toBeChecked();
  }
  await page.getByRole("button", { name: "Next product page" }).click();
  await expect(page.getByText("Page 2 of 25", { exact: true })).toBeVisible();
  await expect(all).not.toBeChecked();
  await expect(selected).toHaveText(`${count} products selected`);
  const secondPageCount = await page
    .getByRole("table", { name: "Demo product catalog" })
    .locator('tbody input[type="checkbox"]:enabled')
    .count();
  await all.check();
  const combinedCount = count + secondPageCount;
  await expect(selected).toHaveText(`${combinedCount} products selected`);
  await page.getByRole("button", { name: "Previous product page" }).click();
  await expect(all).toBeChecked();
  await expect(row).toBeChecked();
  await expect(quantity).toHaveValue("2");
  await all.uncheck();
  await expect(selected).toHaveText(`${secondPageCount} products selected`);
  await page.getByRole("button", { name: "Next product page" }).click();
  await expect(all).toBeChecked();
  await page.getByRole("button", { name: "Previous product page" }).click();
  await row.check();
  await quantity.fill("2");
  await all.check();
  await expect(selected).toHaveText(`${combinedCount} products selected`);
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    `${combinedCount} products added to cart.`,
  );
  await expect(selected).toHaveText("0 products selected");
  const cart = await page.evaluate(
    () => JSON.parse(sessionStorage.getItem("truephamacy-workflow-v1")!).cart,
  );
  expect(cart).toHaveLength(combinedCount);
  expect(
    cart.find((line: { productId: string }) => line.productId === "care-cream")
      .quantity,
  ).toBe("2");
  expect(
    cart.every((line: { quantity: string }) => Number(line.quantity) > 0),
  ).toBe(true);
});
