import { test, expect } from "../../fixtures/app.fixtures";
import { ROUTE_SPECS } from "../../contracts/routeSpecs";

const escapePathForRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

for (const route of ROUTE_SPECS) {
  const routeLoadSpec = route.functions.find((fn) => fn.id.endsWith("route-load"));
  const tags = routeLoadSpec?.tags?.join(" ") || "@regression";

  test(`${tags} route load: ${route.path}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(new RegExp(`${escapePathForRegex(route.path)}$`));
  });
}
