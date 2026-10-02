import { brotliCompressSync, constants } from "node:zlib";
import { test, expect } from "@playwright/test";

test("@regression large raster document exceeds 8 MiB after compression", async ({
  page,
}, testInfo) => {
  await page.goto("/large-pdf-viewer");
  await page
    .getByRole("button", { name: "Open document", exact: true })
    .click();
  const frame = page.frameLocator('[data-test="pdf-viewer-frame"]');
  await expect(frame.getByRole("status")).toContainText("38 pages ready", {
    timeout: 30_000,
  });
  await expect(frame.locator("#viewer img")).toHaveCount(38);
  const payload = await frame.locator("#viewer img").evaluateAll((images) =>
    JSON.stringify(
      images.map((image) => ({
        src: image.getAttribute("src"),
        complete: (image as HTMLImageElement).complete,
        width: (image as HTMLImageElement).naturalWidth,
      })),
    ),
  );
  const images = JSON.parse(payload) as {
    src: string;
    complete: boolean;
    width: number;
  }[];
  expect(
    images.every(
      (image) =>
        image.src.startsWith("data:image/png;base64,") &&
        image.complete &&
        image.width === 600,
    ),
  ).toBeTruthy();
  // Measure the actual attribute data, independently of the viewer's displayed byte counter.
  const compressed = brotliCompressSync(payload, {
    params: { [constants.BROTLI_PARAM_QUALITY]: 6 },
  });
  console.info(
    `Raster payload: ${Buffer.byteLength(payload)} raw bytes; ${compressed.byteLength} Brotli bytes`,
  );
  expect(compressed.byteLength).toBeGreaterThan(8 * 1024 * 1024);
  await testInfo.attach("payload-size", {
    body: JSON.stringify({
      rawBytes: Buffer.byteLength(payload),
      brotliBytes: compressed.byteLength,
    }),
    contentType: "application/json",
  });
  await frame.getByRole("button", { name: "Next", exact: true }).click();
  await expect(frame.getByLabel("Page", { exact: true })).toHaveValue("2");
  await frame.getByLabel("Page", { exact: true }).fill("38");
  await frame.getByLabel("Page", { exact: true }).press("Tab");
  await expect(
    frame.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  await frame.getByLabel("Zoom").selectOption("1.5");
  await expect(frame.locator("#page-38")).toHaveCSS("width", "900px");
  await frame.getByRole("button", { name: "First page", exact: true }).click();
  await expect(frame.getByLabel("Page", { exact: true })).toHaveValue("1");
  await page.screenshot({ path: testInfo.outputPath("large-pdf-viewer.png") });
});

test("@smoke @regression small comparison supports reload, close and URL aliases", async ({
  page,
}) => {
  await page.goto("/large-pdf-viewer.html");
  await page.getByLabel("Document size").selectOption("2");
  await page
    .getByRole("button", { name: "Open document", exact: true })
    .click();
  const frame = page.frameLocator('[data-test="pdf-viewer-frame"]');
  await expect(frame.getByRole("status")).toContainText("2 pages ready");
  await expect(frame.locator("img")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Reload document", exact: true })
    .click();
  await expect(frame.getByRole("status")).toContainText("2 pages ready");
  await expect(frame.getByLabel("Page", { exact: true })).toHaveValue("1");
  await page
    .getByRole("button", { name: "Close document", exact: true })
    .click();
  await expect(page.locator('[data-test="pdf-viewer-frame"]')).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Close document", exact: true }),
  ).toBeDisabled();
});
