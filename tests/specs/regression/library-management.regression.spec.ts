import { test, expect, Page } from "@playwright/test";
const BASE = "/traffic-agent-performance";
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const list: string[] = [];
  errors.set(page, list);
  page.on("pageerror", (e) => list.push(e.message));
  await page.addInitScript(() => {
    localStorage.setItem("katalon-client-code", "DO-NOT-LOAD");
    localStorage.setItem("katalon-env", "qa");
    localStorage.setItem("urlExtension", ".php");
    localStorage.setItem("theme", "light");
  });
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
});
async function open(page: Page) {
  await page.goto(BASE);
  await expect(page.locator("#lib-books-table tbody tr")).toHaveCount(300);
}
async function register(page: Page) {
  await page
    .getByRole("button", { name: "Register reader", exact: true })
    .click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Reader name").fill("New local reader");
  await d.getByLabel("Reader email").fill("ban-doc-moi@example.test");
  await d.getByLabel("Reader phone").fill("0000000088");
  await d.getByLabel("Card expiry date").fill("2027-10-13");
  await d.getByRole("radio", { name: "Student", exact: true }).check();
  await d.getByRole("checkbox", { name: "Technology", exact: true }).check();
  await d
    .getByLabel("Preferred branches")
    .selectOption(["Central", "Mobile library"]);
  await d.getByRole("switch").click();
  await d.getByLabel("Local card photo").setInputFiles({
    name: "anh-the.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jzMkAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(d.locator(".lib-reader-photo")).toBeVisible();
  await d.getByRole("button", { name: "Save reader", exact: true }).click();
  await expect(page.locator("#lib-reader-row-DG1001")).toContainText(
    "Disabled",
  );
  return "DG1001";
}

test("all query modes bypass SDK; deterministic business DOM and nested contexts are ready @regression", async ({
  page,
}) => {
  const sdkRequests: string[] = [];
  page.on("request", (r) => {
    if (/\/libs\/traffic-agent\/|truetest-sdk/.test(r.url()))
      sdkRequests.push(r.url());
  });
  for (const path of [
    BASE,
    `${BASE}?mode=agent&clientCode=DO-NOT-LOAD`,
    `${BASE}?mode=replay&env=qa`,
    `${BASE}.html?mode=agent`,
  ]) {
    await page.goto(path);
    await expect(page.locator("#lib-books-table tbody tr")).toHaveCount(300);
    expect(new URL(page.url()).pathname).toBe(path.split("?")[0]);
    expect(await page.evaluate(() => "TrueTest" in window)).toBe(false);
    await expect(page.locator("#katalon-config-banner")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /^(Prepare|Start|Stop)$/ }),
    ).toHaveCount(0);
  }
  await expect(page.locator("#lib-readers-table tbody tr")).toHaveCount(50);
  await expect(page.locator("#lib-loans-table tbody tr")).toHaveCount(50);
  await expect(
    page.frameLocator("#lib-receipt-frame").locator("#receipt-reader option"),
  ).toHaveCount(51);
  await expect(
    page
      .frameLocator("#lib-receipt-frame")
      .frameLocator("#receipt-rules")
      .getByRole("checkbox"),
  ).toBeVisible();
  await expect(
    page
      .locator("#lib-shadow-lookup")
      .getByRole("textbox", { name: "Quick lookup keyword" }),
  ).toBeVisible();
  const count = await page.evaluate(
    () => document.querySelectorAll("*").length,
  );
  expect(count).toBeGreaterThanOrEqual(9500);
  expect(count).toBeLessThanOrEqual(12000);
  await page
    .getByRole("navigation", { name: "Library navigation" })
    .getByRole("link", { name: /Readers/ })
    .click();
  await expect(page.locator("#lib-readers")).toBeInViewport();
  await expect(page.locator("#lib-books-table tbody tr")).toHaveCount(300);
  expect(sdkRequests).toEqual([]);
});

test("catalog search/filter/sort, local cover, validation, add/edit and bulk shelf actions @regression", async ({
  page,
}) => {
  await open(page);
  await page.getByLabel("Search books", { exact: true }).fill("S0002");
  await expect(page.locator("#lib-books-table tbody tr")).toHaveCount(1);
  await page.getByLabel("Genre", { exact: true }).selectOption("Science");
  await expect(page.locator("#lib-book-row-S0002")).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page
    .getByLabel("Availability", { exact: true })
    .selectOption("unavailable");
  const unavailable = await page
    .locator("#lib-books-table tbody tr .lib-status-tooltip")
    .allTextContents();
  expect(unavailable.every((t) => t.startsWith("0 copies"))).toBe(true);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  for (const label of [
    "Book ID",
    "Book title",
    "Author",
    "Genre",
    "ISBN",
    "Year",
    "Shelf location",
    "Total copies",
    "Available",
  ]) {
    const button = page.getByRole("button", {
      name: `Sort books by ${label}`,
      exact: true,
    });
    await button.click();
    const th = button.locator("..");
    const current = await th.getAttribute("aria-sort");
    await button.click();
    await expect(th).toHaveAttribute(
      "aria-sort",
      current === "ascending" ? "descending" : "ascending",
    );
  }
  await page
    .getByRole("button", { name: "View book details S0001", exact: true })
    .click();
  let d = page.getByRole("dialog");
  await expect(d.locator("img")).toHaveAttribute(
    "src",
    "/library/covers/cover-0.svg",
  );
  await expect(d.locator("tbody tr")).toHaveCount(2);
  await expect(d.getByText("Damaged, out of circulation")).toBeVisible();
  await d.getByRole("button", { name: "Close dialog" }).click();
  await page
    .getByRole("button", { name: "Edit book details S0002", exact: true })
    .click();
  d = page.getByRole("dialog");
  await d
    .getByLabel("Book title", { exact: true })
    .fill("Updated session book");
  await d.getByRole("button", { name: "Save book", exact: true }).click();
  await expect(page.locator("#lib-book-row-S0002")).toContainText(
    "Updated session book",
  );
  await page.getByRole("button", { name: "Add book", exact: true }).click();
  d = page.getByRole("dialog");
  await d.getByRole("button", { name: "Save book", exact: true }).click();
  await expect(d.getByRole("alert")).toBeVisible();
  await d.getByLabel("Book title", { exact: true }).fill("New local title");
  await d.getByLabel("Author", { exact: true }).fill("Sample author");
  await d.getByLabel("ISBN (13 digits)", { exact: true }).fill("9780000000102");
  await d.getByLabel("Total copies").fill("3");
  await d.getByRole("button", { name: "Save book", exact: true }).click();
  await expect(page.locator("#lib-books-table tbody tr")).toHaveCount(301);
  await expect(page.getByTestId("lib-stat-books")).toHaveText("301");
  await page
    .getByRole("checkbox", { name: "Select book S0003", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Select book S0004", exact: true })
    .check();
  await page.getByRole("button", { name: "Book actions", exact: true }).click();
  await page
    .getByRole("menuitem", { name: "Move selected books to a shelf" })
    .click();
  d = page.getByRole("dialog");
  await d.getByLabel("Destination shelf").selectOption("C2 · Art");
  await d.getByRole("button", { name: "Confirm shelf move" }).click();
  await expect(page.locator("#lib-book-row-S0003")).toContainText("C2 · Art");
  await expect(page.locator("#lib-book-row-S0004")).toContainText("C2 · Art");
});

test("reader registration/photo, loan eligibility, stock/cards, renewals and return conditions @regression", async ({
  page,
}) => {
  await open(page);
  const reader = await register(page);
  const before = Number(await page.getByTestId("lib-stat-loans").textContent());
  await page
    .getByLabel("Borrowing reader", { exact: true })
    .selectOption("DG017");
  await page
    .getByLabel("Select books for the slip", { exact: true })
    .selectOption(["S0001"]);
  await page
    .getByRole("button", { name: "Confirm borrowing", exact: true })
    .click();
  await expect(page.locator("#lib-circulation .lib-error")).toContainText(
    "The reader card has expired",
  );
  await expect(page.getByTestId("lib-stat-loans")).toHaveText(String(before));
  await page
    .getByLabel("Borrowing reader", { exact: true })
    .selectOption(reader);
  await page
    .getByRole("button", { name: "Confirm borrowing", exact: true })
    .click();
  await expect(page.getByTestId("lib-stat-loans")).toHaveText(
    String(before + 1),
  );
  await expect(page.locator("#lib-reader-row-DG1001 td").nth(6)).toHaveText(
    "1",
  );
  await expect(
    page.locator("#lib-book-row-S0001 .lib-status-tooltip"),
  ).toContainText("0 copies");
  const first = page.locator("#lib-loans-table tbody tr").first();
  await first.getByRole("button", { name: /Renew loan/ }).click();
  await expect(first).toContainText("03/11/2026");
  await expect(
    first.getByRole("button", { name: /Renew loan/ }),
  ).toBeDisabled();
  await page.getByRole("slider", { name: "Active loan limit" }).focus();
  await page.getByRole("slider", { name: "Active loan limit" }).press("Home");
  await page
    .getByLabel("Select books for the slip", { exact: true })
    .selectOption(["S0002"]);
  await page
    .getByRole("button", { name: "Confirm borrowing", exact: true })
    .click();
  await expect(page.locator("#lib-circulation .lib-error")).toContainText(
    "Loan limit reached:",
  );
  await first.getByRole("button", { name: /Return loan/ }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm return" })
    .click();
  await expect(page.getByTestId("lib-stat-loans")).toHaveText(String(before));
  await expect(
    page.locator("#lib-book-row-S0001 .lib-status-tooltip"),
  ).toContainText("1 copies");
  await page
    .getByRole("button", { name: "Confirm borrowing", exact: true })
    .click();
  await expect(page.getByTestId("lib-stat-loans")).toHaveText(
    String(before + 1),
  );
  const second = page.locator("#lib-loans-table tbody tr").first();
  await second.getByRole("button", { name: /Return loan/ }).click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Return condition").selectOption("damaged");
  await d.getByLabel("Return notes").fill("Torn cover; send for repair.");
  await d.getByRole("button", { name: "Confirm return" }).click();
  await expect(
    page.locator("#lib-book-row-S0002 .lib-status-tooltip"),
  ).toContainText("2 copies");
  await expect(page.getByTestId("lib-stat-loans")).toHaveText(String(before));
  await page
    .getByRole("button", { name: "Update reader DG1001", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("switch")).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await expect(
    page.getByRole("dialog").locator(".lib-reader-photo"),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close dialog" })
    .click();
});

test("nested shadow lookup, reservations, HTML5 and mouse drag, shelf classification and hover menu @regression", async ({
  page,
}) => {
  await open(page);
  const initial = Number(
    await page.getByTestId("lib-stat-reservations").textContent(),
  );
  const shadow = page.locator("#lib-shadow-lookup");
  await shadow
    .getByRole("textbox", { name: "Quick lookup keyword" })
    .fill("S0002");
  await shadow
    .getByRole("button", { name: "Reserve S0002", exact: true })
    .click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Reserving reader").selectOption("DG003");
  await d.getByRole("button", { name: "Confirm reservation" }).click();
  await expect(page.getByTestId("lib-stat-reservations")).toHaveText(
    String(initial + 1),
  );
  const card = page.locator("#lib-reservation-DC1001");
  await card.dragTo(page.getByTestId("lib-board-held").locator("h3"));
  await expect(
    page.getByTestId("lib-board-held").locator("#lib-reservation-DC1001"),
  ).toHaveCount(1);
  await expect(
    page.locator("#lib-book-row-S0002 .lib-status-tooltip"),
  ).toContainText("2 copies");
  const token = page.locator("#lib-pointer-DC1001");
  await token.scrollIntoViewIfNeeded();
  const src = (await token.boundingBox())!,
    target = (await page.locator("#lib-pointer-target-ready").boundingBox())!;
  await page.mouse.move(src.x + src.width / 2, src.y + src.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    target.x + target.width / 2,
    target.y + target.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
  await expect(
    page.getByTestId("lib-board-ready").locator("#lib-reservation-DC1001"),
  ).toHaveCount(1);
  await page.locator("#lib-classify-book").selectOption("S0001");
  await page
    .locator("#lib-shelf-drag-book")
    .dragTo(page.locator("#lib-shelf-target-3"));
  await expect(page.locator("#lib-book-row-S0001")).toContainText(
    "B2 · Technology",
  );
  await expect(page.locator("#lib-book-row-S0001")).toContainText("Technology");
  await page.getByRole("button", { name: "Collection", exact: true }).hover();
  await page
    .locator(".lib-menu-tree")
    .getByRole("button", { name: "Technology", exact: false })
    .hover();
  await page
    .locator(".lib-menu-tree")
    .getByRole("link", { name: /B2 · Technology/ })
    .click();
  await expect(page.getByLabel("Genre", { exact: true })).toHaveValue(
    "Technology",
  );
  await expect(page.getByLabel("Bookshelf", { exact: true })).toHaveValue(
    "B2 · Technology",
  );
  await expect(page.locator("#lib-book-row-S0001")).toBeVisible();
  await page
    .getByLabel("Borrowing reader", { exact: true })
    .selectOption("DG003");
  await page
    .getByLabel("Select books for the slip", { exact: true })
    .selectOption(["S0002"]);
  await page
    .getByRole("button", { name: "Confirm borrowing", exact: true })
    .click();
  await expect(page.getByTestId("lib-stat-reservations")).toHaveText(
    String(initial),
  );
  await expect(page.locator("#lib-reservation-DC1001")).toHaveCount(0);
});

test("settings, custom slider, rich text preview and native dialogs change local business state @regression", async ({
  page,
}) => {
  await open(page);
  const dialogs: string[] = [];
  page.on("dialog", async (d) => {
    dialogs.push(d.type());
    await d.accept(d.type() === "prompt" ? "New reading shelf" : undefined);
  });
  expect(dialogs).toEqual([]);
  await page.locator("#lib-default-days").focus();
  await page.locator("#lib-default-days").press("Home");
  for (let i = 0; i < 9; i++)
    await page.locator("#lib-default-days").press("ArrowRight");
  await expect(page.locator("#lib-default-days")).toHaveValue("10");
  await page.getByRole("button", { name: "Apply default loan period" }).click();
  await expect(page.getByLabel("Due date", { exact: true })).toHaveValue(
    "2026-10-23",
  );
  const slider = page.getByRole("slider", { name: "Active loan limit" });
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "10");
  const track = page.locator("#lib-limit-track");
  const trackBox = (await track.boundingBox())!;
  await track.click({ position: { x: trackBox.width * 0.75, y: 4 } });
  await expect(slider).toHaveAttribute("aria-valuenow", "8");
  await page.getByLabel("Closing time").fill("19:30");
  await expect(page.locator(".lib-topbar")).toContainText("19:30");
  const editor = page.getByRole("textbox", {
    name: "Library announcement content",
  });
  await editor.fill("New announcement: open on weekends.");
  await editor.press("ControlOrMeta+A");
  const alreadyBold = await editor.locator("strong,b").count();
  await page.getByRole("button", { name: "Bold", exact: true }).click();
  if (alreadyBold) {
    await expect(editor.locator("strong,b")).toHaveCount(0);
    await page.getByRole("button", { name: "Bold", exact: true }).click();
  }
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(page.locator("#lib-preview-panel")).toContainText(
    "New announcement: open on weekends.",
  );
  await expect(
    page.locator("#lib-preview-panel strong,#lib-preview-panel b"),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.locator("#lib-books-table tbody tr")).toHaveCount(300);
  await page.getByRole("button", { name: "View alerts" }).click();
  await page.getByRole("button", { name: "Confirm library closure" }).click();
  await expect(page.locator(".lib-topbar")).toContainText("Closed");
  await page.getByRole("button", { name: "Open library", exact: true }).click();
  await expect(page.locator(".lib-topbar")).toContainText("Open");
  await page.getByRole("button", { name: "Enter shelf name" }).click();
  await expect(page.locator("#lib-book-row-S0001")).toContainText(
    "New reading shelf",
  );
  expect(dialogs).toEqual(["alert", "confirm", "prompt"]);
  await page.getByRole("button", { name: "Reset sample data" }).click();
  await expect(page.locator("#lib-book-row-S0001")).toContainText(
    "A1 · Literature",
  );
  await expect(page.locator("#lib-default-days")).toHaveValue("14");
});

test("same-origin borrowing slip and nested confirmation update main stock, readers and cards @regression", async ({
  page,
}) => {
  await open(page);
  const before = Number(await page.getByTestId("lib-stat-loans").textContent());
  const frame = page.frameLocator("#lib-receipt-frame");
  await frame.getByLabel("Reader on slip").selectOption("DG003");
  await frame.getByLabel("Books on slip").selectOption(["S0001"]);
  await expect(
    frame.getByRole("button", { name: "Confirm borrowing slip" }),
  ).toBeDisabled();
  const nested = frame.frameLocator("#receipt-rules");
  await nested.getByRole("checkbox").check();
  await nested.getByRole("button", { name: "Confirm rules read" }).click();
  await frame.getByRole("button", { name: "Confirm borrowing slip" }).click();
  await expect(frame.getByRole("status")).toContainText("Loaned 1 books");
  await expect(page.getByTestId("lib-stat-loans")).toHaveText(
    String(before + 1),
  );
  await expect(
    page.locator("#lib-book-row-S0001 .lib-status-tooltip"),
  ).toContainText("0 copies");
  await expect(page.locator("#lib-reader-row-DG003 td").nth(6)).toHaveText("2");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator(".library-app")).toHaveClass(/lib-dark/);
  await expect
    .poll(() => frame.locator("html").getAttribute("data-theme"))
    .toBe("dark");
  await expect
    .poll(() => nested.locator("html").getAttribute("data-theme"))
    .toBe("dark");
});

for (const width of [1440, 768, 390, 320])
  test(`library responsive layout ${width}px keeps all sections and fields mounted @regression`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await open(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(page.locator("#lib-catalog")).toHaveCount(1);
    await expect(page.locator("#lib-settings")).toHaveCount(1);
    await page
      .getByRole("button", { name: "Register reader", exact: true })
      .click();
    const d = page.getByRole("dialog");
    const box = (await d.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(await d.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
      true,
    );
    await d.getByRole("button", { name: "Close dialog" }).click();
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(page.locator("#lib-books-table tbody tr")).toHaveCount(300);
  });
