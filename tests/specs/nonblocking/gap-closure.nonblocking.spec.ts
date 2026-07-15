import { test } from "../../fixtures/app.fixtures";

test.describe("@regression @nonblocking Gap Closure External and Dynamic", () => {
  test("@regression @nonblocking @dynamic abTesting-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.abTestingPrimary();
  });

  test("@regression @nonblocking @external brokenImages-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.brokenImagesPrimary();
  });

  test("@regression @nonblocking @external iframesCellphoneDemo-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.iframesCellphoneDemoPrimary();
  });

  test("@regression @nonblocking @external iframesVinothDemo-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.iframesVinothDemoPrimary();
  });

  test("@regression @nonblocking @external iframesDocsKatalon-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.iframesDocsKatalonPrimary();
  });

  test("@regression @nonblocking @external richTextEditor-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.richTextEditorPrimary();
  });

  test("@regression @nonblocking @external tinymceShadowDom-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.tinymceShadowDomPrimary();
  });

  test("@regression @nonblocking @dynamic dynamicIdLocator-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.dynamicIdLocatorPrimary();
  });

  test("@regression @nonblocking @dynamic challengingForm-primary", async ({
    gapFlows,
  }) => {
    await gapFlows.challengingFormPrimary();
  });

  test("@regression @nonblocking @dynamic challengingForm-negative", async ({
    gapFlows,
  }) => {
    await gapFlows.challengingFormNegative();
  });
});
