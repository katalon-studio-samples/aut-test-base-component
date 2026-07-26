import { test } from "../../fixtures/app.fixtures";

test.describe("@regression Input Pages E2E", () => {
  test("@regression input-checkbox default summary", async ({ inputFlows }) => {
    await inputFlows.checkboxDefaultSelectionSummary();
  });

  test("@regression input-checkbox toggle summary", async ({ inputFlows }) => {
    await inputFlows.checkboxToggleSelectionSummary();
  });

  test("@regression input-radio-search-submit filtered results", async ({
    inputFlows,
  }) => {
    await inputFlows.radioSearchFilteredResults();
  });

  test("@regression input-radio-search-submit no result state", async ({
    inputFlows,
  }) => {
    await inputFlows.radioSearchNoResultState();
  });

  test("@regression input-radio-search-submit autocomplete keyboard flow", async ({
    inputFlows,
  }) => {
    await inputFlows.radioSearchAutocompleteKeyboardFlow();
  });

  test("@regression input-radio-search-submit reset restores defaults", async ({
    inputFlows,
  }) => {
    await inputFlows.radioSearchResetRestoresDefaults();
  });

  test("@regression input-form-inputs valid submission", async ({ inputFlows }) => {
    await inputFlows.formInputsValidSubmission();
  });

  test("@regression input-form-inputs validation summary", async ({ inputFlows }) => {
    await inputFlows.formInputsValidationSummary();
  });

  test("@regression input-form-inputs password mismatch validation", async ({
    inputFlows,
  }) => {
    await inputFlows.formInputsPasswordMismatchValidation();
  });

  test("@regression input-form-inputs tracking mode exclusivity", async ({
    inputFlows,
  }) => {
    await inputFlows.formInputsTrackingToggleExclusivity();
  });
});
