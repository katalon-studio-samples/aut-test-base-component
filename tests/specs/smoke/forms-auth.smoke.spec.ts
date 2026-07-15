import { test, expect } from "../../fixtures/app.fixtures";

test.describe("@smoke @regression Forms and Auth", () => {
  test("@smoke @regression forms page validation and valid submit", async ({
    page,
    seedPages,
  }) => {
    await seedPages.forms.goto();
    await seedPages.forms.submitInvalidForm();
    await seedPages.forms.expectValidationErrors();

    await seedPages.forms.submitValidForm();
    await expect(page.locator('[data-test="submit-button"]')).toHaveText(
      "Sign In",
      { timeout: 10_000 },
    );
    await seedPages.forms.expectFormSubmittedWithoutValidationErrors();
  });

  test("@smoke @regression auth page invalid and valid login", async ({
    seedPages,
    page,
  }) => {
    await seedPages.auth.goto();
    await seedPages.auth.login("wrong-user", "wrong-pass");
    await seedPages.auth.expectAuthError();

    await seedPages.auth.login("admin", "admin");
    await seedPages.auth.expectAuthenticatedState();

    await page.locator('[data-test="logout-button"]').click();
    await expect(page.locator('[data-test="auth-form"]')).toBeVisible();
  });

  test("@smoke @regression sauce login locked user and successful cart flow", async ({
    seedPages,
    page,
  }) => {
    await seedPages.sauceLogin.goto();
    await seedPages.sauceLogin.login("locked_out_user", "secret_sauce");
    await seedPages.sauceLogin.expectErrorContains("locked out");

    await seedPages.sauceLogin.login("standard_user", "secret_sauce");
    await seedPages.sauceLogin.expectProductsPage();

    await seedPages.sauceLogin.toggleFirstProductInCart();
    await seedPages.sauceLogin.expectFirstProductMarkedAsInCart();

    await page.locator('[data-test="logout-button"]').click();
    await expect(page.locator('[data-test="auth-form"]')).toBeVisible();
  });
});
