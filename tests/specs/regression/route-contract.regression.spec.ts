import { test, expect } from "../../fixtures/app.fixtures";

test.describe("@regression Route Metadata Contract", () => {
  test("@regression all canonical routes are represented and unique", async ({
    routeSpecs,
  }) => {
    expect(routeSpecs).toHaveLength(58);

    const uniquePaths = new Set(routeSpecs.map((route) => route.path));
    expect(uniquePaths.size).toBe(58);

    for (const route of routeSpecs) {
      expect(route.functions.length).toBeGreaterThanOrEqual(2);
      const hasRouteLoad = route.functions.some((fn) =>
        fn.id.endsWith("route-load"),
      );
      expect(hasRouteLoad).toBeTruthy();
    }
  });
});
