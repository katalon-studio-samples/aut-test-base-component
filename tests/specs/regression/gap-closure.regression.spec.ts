import { test } from "../../fixtures/app.fixtures";

test.describe("@regression Gap Closure Deterministic Functions", () => {
  test("@regression nativeElement-primary", async ({ gapFlows }) => {
    await gapFlows.nativeElementPrimary();
  });

  test("@regression about-primary", async ({ gapFlows }) => {
    await gapFlows.aboutPrimary();
  });

  test("@regression msuSimulationForm-primary", async ({ gapFlows }) => {
    await gapFlows.msuSimulationFormPrimary();
  });

  test("@regression fileUploadEs-primary", async ({ gapFlows }) => {
    await gapFlows.fileUploadEsPrimary("README.md");
  });

  test("@regression iframes1-primary", async ({ gapFlows }) => {
    await gapFlows.iframes1Primary();
  });

  test("@regression iframes2-primary", async ({ gapFlows }) => {
    await gapFlows.iframes2Primary();
  });

  test("@regression contextMenu-primary", async ({ gapFlows }) => {
    await gapFlows.contextMenuPrimary();
  });

  test("@regression multiTieredMenu-primary", async ({ gapFlows }) => {
    await gapFlows.multiTieredMenuPrimary();
  });

  test("@regression toastDelayScenario-primary", async ({ gapFlows }) => {
    await gapFlows.toastDelayScenarioPrimary();
  });

  test("@regression slider-primary", async ({ gapFlows }) => {
    await gapFlows.sliderPrimary();
  });

  test("@regression popupForm-primary", async ({ gapFlows }) => {
    await gapFlows.popupFormPrimary();
  });

  test("@regression keyValueForm-primary", async ({ gapFlows }) => {
    await gapFlows.keyValueFormPrimary();
  });

  test("@regression keyValueForm-negative", async ({ gapFlows }) => {
    await gapFlows.keyValueFormNegative();
  });

  test("@regression iframesSameDomain-primary", async ({ gapFlows }) => {
    await gapFlows.iframesSameDomainPrimary();
  });

  test("@regression inputCheckbox-primary", async ({ gapFlows }) => {
    await gapFlows.inputCheckboxPrimary();
  });

  test("@regression inputText-primary", async ({ gapFlows }) => {
    await gapFlows.inputTextPrimary();
  });

  test("@regression inputText-negative", async ({ gapFlows }) => {
    await gapFlows.inputTextNegative();
  });

  test("@regression inputRadioSearchSubmit-primary", async ({ gapFlows }) => {
    await gapFlows.inputRadioSearchSubmitPrimary();
  });

  test("@regression inputFormInputs-primary", async ({ gapFlows }) => {
    await gapFlows.inputFormInputsPrimary();
  });

  test("@regression inputFormInputs-negative", async ({ gapFlows }) => {
    await gapFlows.inputFormInputsNegative();
  });

  test("@regression combobox-primary", async ({ gapFlows }) => {
    await gapFlows.comboboxPrimary();
  });

  test("@regression unicodeCombobox-primary", async ({ gapFlows }) => {
    await gapFlows.unicodeComboboxPrimary();
  });

  test("@regression xpathBreaking-primary", async ({ gapFlows }) => {
    await gapFlows.xpathBreakingPrimary();
  });

  test("@regression listCard-primary", async ({ gapFlows }) => {
    await gapFlows.listCardPrimary();
  });

  test("@regression piiControls-primary", async ({ gapFlows }) => {
    await gapFlows.piiControlsPrimary();
  });

  test("@regression shadowBookBorrow-primary", async ({ gapFlows }) => {
    await gapFlows.shadowBookBorrowPrimary();
  });

  test("@regression uniqueTestData-primary", async ({ gapFlows }) => {
    await gapFlows.uniqueTestDataPrimary();
  });

  test("@regression uniqueTestData-negative", async ({ gapFlows }) => {
    await gapFlows.uniqueTestDataNegative();
  });

  test("@regression settings-primary", async ({ gapFlows }) => {
    await gapFlows.settingsPrimary();
  });

  test("@regression agGrid-primary", async ({ gapFlows }) => {
    await gapFlows.agGridPrimary();
  });

  test("@regression scenarioToggle-primary", async ({ gapFlows }) => {
    await gapFlows.scenarioTogglePrimary();
  });

  test("@regression formBuilderHtml5-primary", async ({ gapFlows }) => {
    await gapFlows.formBuilderHtml5Primary();
  });

  test("@regression ctrlClickTable-primary", async ({ gapFlows }) => {
    await gapFlows.ctrlClickTablePrimary();
  });
});
