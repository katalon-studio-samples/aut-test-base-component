import { expect, test, type Page } from "@playwright/test";

const STATE_KEY = "relatedTabSignerWorkflow.state";
const CHANNEL_NAME = "related-tab-signer-workflow";
const signed = (id: string) => ({ id, name: `Signer ${id}`, signed: true });

async function sign(page: Page, id: string) {
  await page.getByTestId(`signer-${id}-full-name`).fill(`Signer ${id}`);
  await page.getByTestId(`signer-${id}-agree`).check();
  await page.getByTestId(`signer-${id}-sign`).click();
  await expect(page.getByTestId("signer-saved-status")).toContainText("Signed");
}

for (const id of ["1", "2"]) {
  test(`fresh standalone signer ${id} publishes a complete workflow @regression`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/tab-workflow-test/signer.html?signer=${id}`);
    await sign(page, id);
    const state = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!),
      STATE_KEY,
    );
    expect(Object.keys(state)).toEqual(["1", "2", "3"]);
    await page.goto("/tab-workflow-test");
    await expect(page.getByTestId(`signer-${id}-status`)).toHaveText("Signed");
    await expect(
      page.getByTestId(`signer-${id === "1" ? "2" : "1"}-status`),
    ).toHaveText("Pending");
    await expect(
      page.getByTestId("continue-related-tab-workflow"),
    ).toBeDisabled();
    expect(errors).toEqual([]);
  });
}

const storedCases = [
  {
    label: "partial signed state",
    value: JSON.stringify({ "1": signed("1") }),
    signer1: "Signed",
  },
  { label: "null", value: "null", signer1: "Pending" },
  { label: "array", value: "[]", signer1: "Pending" },
  { label: "invalid JSON", value: "{", signer1: "Pending" },
  {
    label: "invalid entries",
    value: JSON.stringify({ "1": { signed: "false" }, "2": null, "3": [] }),
    signer1: "Pending",
  },
];
for (const { label, value, signer1 } of storedCases) {
  test(`main recovers from stored ${label} on load and reload @regression`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: STATE_KEY, value },
    );
    await page.goto("/tab-workflow-test");
    for (let load = 0; load < 2; load++) {
      await expect(page.getByTestId("signer-1-status")).toHaveText(signer1);
      await expect(page.getByTestId("signer-2-status")).toHaveText("Pending");
      await expect(page.getByTestId("signer-3-status")).toHaveText("Pending");
      await expect(
        page.getByTestId("right-click-navigation-link"),
      ).toBeVisible();
      if (load === 0) await page.reload();
    }
    expect(errors).toEqual([]);
  });
}

test("same-domain Sign and Return keep main usable @regression", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/tab-workflow-test");
  const [signer] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByTestId("open-signer-1-same-domain-tab").click(),
  ]);
  await sign(signer, "1");
  await signer.getByTestId("signer-1-return-main").click();
  await expect(page.getByTestId("signer-1-status")).toHaveText("Signed");
  await page.getByTestId("right-click-navigation-link").click();
  await expect(page).toHaveURL(/right-click-destination/);
  expect(errors).toEqual([]);
});

test("partial cross-tab updates preserve signatures and explicit reset @regression", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/tab-workflow-test");
  const sender = await context.newPage();
  await sender.goto("/tab-workflow-test/signer.html");
  await sender.evaluate(
    ({ key, entry }) =>
      localStorage.setItem(key, JSON.stringify({ "1": entry })),
    { key: STATE_KEY, entry: signed("1") },
  );
  await expect(page.getByTestId("signer-1-status")).toHaveText("Signed");
  await sender.evaluate(
    ({ key, entry }) =>
      localStorage.setItem(key, JSON.stringify({ "2": entry, "1": null })),
    { key: STATE_KEY, entry: signed("2") },
  );
  await expect(page.getByTestId("signer-1-status")).toHaveText("Signed");
  await expect(page.getByTestId("signer-2-status")).toHaveText("Signed");
  await sender.evaluate(
    ({ name, entry }) => {
      const channel = new BroadcastChannel(name);
      channel.postMessage({ type: "state-sync", state: null });
      channel.postMessage({ type: "state-sync", state: { "3": entry } });
      channel.close();
    },
    { name: CHANNEL_NAME, entry: signed("3") },
  );
  await expect(page.getByTestId("continue-related-tab-workflow")).toBeEnabled();
  await page.reload();
  await expect(page.getByTestId("continue-related-tab-workflow")).toBeEnabled();
  await page.getByTestId("reset-related-tab-workflow").click();
  await page.reload();
  for (const id of ["1", "2", "3"]) {
    await expect(page.getByTestId(`signer-${id}-status`)).toHaveText("Pending");
  }
  await expect(
    page.getByTestId("continue-related-tab-workflow"),
  ).toBeDisabled();
  expect(errors).toEqual([]);
});

test("removing saved state in another tab clears the workflow without restoring the key @regression", async ({
  page,
  context,
}) => {
  await page.goto("/tab-workflow-test");
  const sender = await context.newPage();
  await sender.goto("/tab-workflow-test/signer.html");
  await sign(sender, "1");
  await expect(page.getByTestId("signer-1-status")).toHaveText("Signed");
  await sender.evaluate((key) => localStorage.removeItem(key), STATE_KEY);
  for (const id of ["1", "2", "3"]) {
    await expect(page.getByTestId(`signer-${id}-status`)).toHaveText("Pending");
  }
  expect(
    await page.evaluate((key) => localStorage.getItem(key), STATE_KEY),
  ).toBeNull();
});
