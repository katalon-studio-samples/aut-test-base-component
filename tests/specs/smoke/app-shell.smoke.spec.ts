import { test, expect } from "../../fixtures/app.fixtures";

test.describe("@smoke @regression App Shell", () => {
  test("@smoke @regression home landing content and side navigation", async ({
    page,
    seedPages,
    components,
  }) => {
    await seedPages.home.goto();
    await seedPages.home.expectLandingContent();

    await components.sideNav.expectNavItemVisible("/forms");
    await components.sideNav.navigate("/forms");
    await expect(page).toHaveURL(/\/forms$/);
  });

  test("@smoke @regression theme toggle and URL extension switching", async ({
    page,
    routePages,
    components,
  }) => {
    await routePages.home.goto();

    const html = page.locator("html");
    const beforeClass = await html.getAttribute("class");
    await components.themeToggle.toggleTheme();
    const afterClass = await html.getAttribute("class");
    expect(afterClass).not.toBe(beforeClass);

    await components.themeToggle.selectUrlExtension(".html");
    await components.sideNav.navigate("/about");
    await expect(page).toHaveURL(/\/about\.html$/);

    await components.themeToggle.selectUrlExtension("No Extension");
    await components.sideNav.navigate("/forms");
    await expect(page).toHaveURL(/\/forms$/);
  });
});
