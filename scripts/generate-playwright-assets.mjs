import { mkdirSync, writeFileSync } from "node:fs";

/** @type {const} */
const routeDefinitions = [
  {
    id: "home",
    path: "/",
    title: "Home",
    primaryAction: "Open a feature card and navigate to its destination route.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "nativeElement",
    path: "/native-element",
    title: "Native HTML Elements",
    primaryAction: "Interact with representative native form controls and verify state updates.",
  },
  {
    id: "about",
    path: "/about",
    title: "About",
    primaryAction: "Verify static informational content renders for automation onboarding.",
  },
  {
    id: "forms",
    path: "/forms",
    title: "Forms",
    primaryAction: "Submit the login form with valid values and verify successful submission flow.",
    validationAction: "Submit with invalid values and verify validation errors are shown.",
    smoke: true,
    automated: ["route-load", "primary", "negative"],
  },
  {
    id: "msuSimulationForm",
    path: "/msu-simulation-form",
    title: "MSU Simulation Form",
    primaryAction: "Use list/dropdown controls and confirm selected value state updates.",
  },
  {
    id: "tables",
    path: "/tables",
    title: "Tables",
    primaryAction: "Sort table columns and verify row ordering/state changes.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "dragDrop",
    path: "/drag-drop",
    title: "Drag and Drop",
    primaryAction: "Perform drag-and-drop interaction and verify list state remains consistent.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "dynamicElements",
    path: "/dynamic-elements",
    title: "Dynamic Elements",
    primaryAction: "Trigger dynamic reload and verify loading indicator and content lifecycle.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "fileUpload",
    path: "/file-upload",
    title: "File Upload",
    primaryAction: "Upload a file and verify uploaded file list metadata.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "fileUploadEs",
    path: "/file-upload/es",
    title: "File Upload (ES DOM)",
    primaryAction: "Upload file(s) and validate custom ES DOM uploader status updates.",
  },
  {
    id: "fileDownload",
    path: "/file-download",
    title: "File Download",
    primaryAction: "Initiate file download and validate download event/artifact is produced.",
    external: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "iframes",
    path: "/iframes",
    title: "Iframes",
    primaryAction: "Interact with core same-origin iframe content and verify parent receives message.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "iframes1",
    path: "/iframes-1",
    title: "Iframes Nested Level 1",
    primaryAction: "Load nested iframe level 1 and verify embedded page renders successfully.",
  },
  {
    id: "iframes2",
    path: "/iframes-2",
    title: "Iframes Nested Level 2",
    primaryAction: "Validate nested iframe level 2 table interactions render in embedded context.",
  },
  {
    id: "contextMenu",
    path: "/context-menu",
    title: "Context Menu",
    primaryAction: "Open context menu via right click and verify menu options appear.",
  },
  {
    id: "multiTieredMenu",
    path: "/multi-tiered-menu",
    title: "Multi Tiered Menu",
    primaryAction: "Navigate hierarchical menu and verify leaf click confirmation dialog.",
  },
  {
    id: "hover",
    path: "/hover",
    title: "Hover",
    primaryAction: "Hover on image cards and verify contextual captions appear/disappear.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "notifications",
    path: "/notifications",
    title: "Notifications",
    primaryAction: "Create notification toast and verify display in notification container.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "toastDelayScenario",
    path: "/toast-delay-scenario",
    title: "Toast Delay Scenario",
    primaryAction: "Trigger delayed toast scenario and validate delayed/auto-close transitions.",
  },
  {
    id: "abTesting",
    path: "/ab-testing",
    title: "A/B Testing",
    primaryAction: "Load active variant and verify variant-specific content and click counter update.",
    dynamic: true,
  },
  {
    id: "auth",
    path: "/auth",
    title: "Authentication",
    primaryAction: "Login with valid credentials and verify authenticated state.",
    validationAction: "Login with invalid credentials and verify auth error is shown.",
    smoke: true,
    automated: ["route-load", "primary", "negative"],
  },
  {
    id: "sauceLogin",
    path: "/sauce-login",
    title: "Sauce Login",
    primaryAction: "Login with standard user and add/remove product in cart.",
    validationAction: "Attempt locked user login and verify lockout error message.",
    smoke: true,
    automated: ["route-load", "primary", "negative"],
  },
  {
    id: "brokenImages",
    path: "/broken-images",
    title: "Broken Images",
    primaryAction: "Validate page surfaces mixed valid/broken image scenarios for detection logic.",
    external: true,
  },
  {
    id: "checkboxes",
    path: "/checkboxes",
    title: "Checkboxes",
    primaryAction: "Toggle all checkboxes and verify checked state transitions.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "exitIntent",
    path: "/exit-intent",
    title: "Exit Intent",
    primaryAction: "Trigger mouse-leave modal and verify exit intent dialog appears once.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "slider",
    path: "/slider",
    title: "Slider",
    primaryAction: "Move slider control and verify displayed value updates correctly.",
  },
  {
    id: "alerts",
    path: "/alerts",
    title: "Alerts",
    primaryAction: "Handle JS alert/confirm/prompt flows and verify result container text.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "keyPress",
    path: "/key-press",
    title: "Key Press",
    primaryAction: "Send keyboard input and verify last key and history updates.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "shadowDom",
    path: "/shadow-dom",
    title: "Shadow DOM",
    primaryAction: "Click button inside shadow root and verify host page dialog response.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "openPopup",
    path: "/open-popup",
    title: "Open Popup",
    primaryAction: "Open child popup form and verify parent page receives posted data.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "openNewTab",
    path: "/open-new-tab",
    title: "Open New Tab",
    primaryAction: "Trigger new tab/popup action and verify browser popup event is emitted.",
    smoke: true,
    automated: ["route-load", "primary"],
  },
  {
    id: "popupForm",
    path: "/popup-form",
    title: "Popup Form",
    primaryAction: "Submit popup form and verify postMessage payload format before close.",
  },
  {
    id: "keyValueForm",
    path: "/key-value-form",
    title: "Key Value Form",
    primaryAction: "Add key-value pairs and submit to summary table view.",
    validationAction: "Attempt submit without required pair and verify submit button remains disabled.",
  },
  {
    id: "iframesCellphoneDemo",
    path: "/iframes/cellphone-demo",
    title: "Iframes Cellphone Demo",
    primaryAction: "Load external cellphone demo iframe and validate iframe is attached.",
    external: true,
  },
  {
    id: "iframesVinothDemo",
    path: "/iframes/vinoth-demo",
    title: "Iframes Vinoth Demo",
    primaryAction: "Load external vinoth demo iframe and validate frame element availability.",
    external: true,
  },
  {
    id: "iframesDocsKatalon",
    path: "/iframes/docs-katalon",
    title: "Iframes Docs Katalon",
    primaryAction: "Load external docs iframe and verify document frame is present.",
    external: true,
  },
  {
    id: "iframesSameDomain",
    path: "/iframes/same-domain",
    title: "Iframes Same Domain",
    primaryAction: "Open same-domain iframe and verify iframe source path/query behavior.",
  },
  {
    id: "richTextEditor",
    path: "/rich-text-editor",
    title: "Rich Text Editor",
    primaryAction: "Type rich text content and verify editor output/preview state.",
    external: true,
  },
  {
    id: "inputCheckbox",
    path: "/input/checkbox",
    title: "Input Checkbox",
    primaryAction: "Toggle checkbox input group and verify summary output after action button.",
  },
  {
    id: "inputText",
    path: "/input/text",
    title: "Input Text",
    primaryAction: "Fill text fields and verify output values are rendered.",
    validationAction: "Submit without mandatory text and verify error message is shown.",
  },
  {
    id: "inputRadioSearchSubmit",
    path: "/input/radio-search-submit",
    title: "Input Radio Search Submit",
    primaryAction: "Search and filter product list by radio/category controls then submit.",
  },
  {
    id: "inputFormInputs",
    path: "/input/form-inputs",
    title: "Form Input Types",
    primaryAction: "Submit full multi-input form with valid values and verify submission payload.",
    validationAction: "Submit with invalid or missing required values and verify validation errors.",
  },
  {
    id: "combobox",
    path: "/combobox",
    title: "Combo Box",
    primaryAction: "Select option from combobox and verify selected display state.",
  },
  {
    id: "unicodeCombobox",
    path: "/unicode-combobox",
    title: "Unicode Combo Box",
    primaryAction: "Filter unicode options and select symbol while preserving selected value.",
  },
  {
    id: "xpathBreaking",
    path: "/xpath-breaking",
    title: "XPath Breaking",
    primaryAction: "Click complex selector elements and verify selected element info updates.",
  },
  {
    id: "listCard",
    path: "/list-card",
    title: "List Card",
    primaryAction: "Filter card list by attributes and validate pagination/selection behavior.",
  },
  {
    id: "uniqueTestData",
    path: "/unique-test-data",
    title: "Numeric Input",
    primaryAction: "Add numeric rows and submit to verify numeric-only payload output.",
    validationAction: "Type non-numeric input and verify component blocks invalid characters.",
  },
  {
    id: "settings",
    path: "/settings",
    title: "TrueTest Settings",
    primaryAction: "Save key-value attributes and verify persistence/message feedback.",
  },
  {
    id: "agGrid",
    path: "/ag-grid",
    title: "AG Grid",
    primaryAction: "Interact with AG Grid filters/editable cells and validate grid state changes.",
  },
  {
    id: "tinymceShadowDom",
    path: "/tinymce-shadow-dom",
    title: "TinyMCE Shadow DOM",
    primaryAction: "Enter TinyMCE content inside nested shadow DOM and verify submit outcome.",
    external: true,
  },
  {
    id: "dynamicIdLocator",
    path: "/dynamic-id-locator",
    title: "Dynamic ID Locator",
    primaryAction: "Regenerate dynamic IDs and validate stable selector demo remains usable.",
    dynamic: true,
  },
  {
    id: "scenarioToggle",
    path: "/scenario-toggle",
    title: "Scenario Toggle",
    primaryAction: "Toggle scenario enabled/bypassed states and verify history/stat counters update.",
  },
  {
    id: "formBuilderHtml5",
    path: "/form-builder-html5",
    title: "Form Builder HTML5",
    primaryAction: "Drag section/components into form builder and verify preview state.",
  },
  {
    id: "challengingForm",
    path: "/challenging-form",
    title: "Challenging Form",
    primaryAction: "Fill challenging dynamic form and submit using resilient locators.",
    validationAction: "Submit incomplete challenging form and verify required controls enforce constraints.",
    dynamic: true,
  },
  {
    id: "ctrlClickTable",
    path: "/ctrl-click-table",
    title: "Ctrl Click Table",
    primaryAction: "Multi-select rows with Ctrl/Cmd and edit table row via double-click modal.",
  },
];

const pascalCase = (value) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .replace(/(^\w|\s\w)/g, (match) => match.trim().toUpperCase())
    .replace(/\s+/g, "");

const unique = (array) => [...new Set(array)];

const buildTags = (definition) => {
  const base = definition.smoke
    ? ["@smoke", "@regression"]
    : ["@regression"];

  if (definition.external) {
    base.push("@external", "@nonblocking");
  }

  if (definition.dynamic) {
    base.push("@dynamic", "@nonblocking");
  }

  return unique(base);
};

const toPriority = (definition) => {
  if (definition.smoke) return "P0";
  if (definition.external || definition.dynamic) return "P2";
  return "P1";
};

const buildFunctionSpecs = (definition) => {
  const tags = buildTags(definition);

  const routeLoadSpec = {
    id: `${definition.id}-route-load`,
    name: `${definition.title} route loads`,
    description: `Navigate to ${definition.path} and ensure page shell renders.`,
    preconditions: "Application is reachable and user is on base URL.",
    steps: `Navigate to ${definition.path}.`,
    expectedResult: `Page URL resolves to ${definition.path} and the page heading/content is visible.`,
    tags,
    automationStatus: "Automated",
    priority: toPriority(definition),
  };

  const primarySpec = {
    id: `${definition.id}-primary`,
    name: `${definition.title} primary function`,
    description: definition.primaryAction,
    preconditions: `Route ${definition.path} is loaded successfully.`,
    steps: definition.primaryAction,
    expectedResult: "Expected UI state change occurs and can be asserted deterministically.",
    tags,
    automationStatus: "Automated",
    priority: toPriority(definition),
  };

  const specs = [routeLoadSpec, primarySpec];

  if (definition.validationAction) {
    specs.push({
      id: `${definition.id}-negative`,
      name: `${definition.title} negative validation`,
      description: definition.validationAction,
      preconditions: `Route ${definition.path} is loaded and invalid/edge input can be provided.`,
      steps: definition.validationAction,
      expectedResult: "Validation or guarded behavior is triggered with clear user feedback.",
      tags,
      automationStatus: "Automated",
      priority: definition.smoke ? "P0" : "P1",
    });
  }

  return specs;
};

const routeSpecs = routeDefinitions.map((definition) => ({
  id: definition.id,
  path: definition.path,
  title: definition.title,
  deterministic: !(definition.external || definition.dynamic),
  functions: buildFunctionSpecs(definition),
}));

const routeSpecsTs = `import type { RouteSpec } from "./specs";

export const ROUTE_SPECS: RouteSpec[] = ${JSON.stringify(routeSpecs, null, 2)};
`;

const canonicalRoutesTs = `export interface CanonicalRoute {
  id: string;
  path: string;
  title: string;
}

export const CANONICAL_ROUTES: CanonicalRoute[] = ${JSON.stringify(
  routeDefinitions.map((route) => ({
    id: route.id,
    path: route.path,
    title: route.title,
  })),
  null,
  2,
)};
`;

const routeClasses = routeDefinitions
  .map((route) => {
    const className = `${pascalCase(route.id)}Page`;
    return `export class ${className} extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "${route.path}", "${route.title}");
  }
}`;
  })
  .join("\n\n");

const routePageTypes = routeDefinitions
  .map((route) => {
    const className = `${pascalCase(route.id)}Page`;
    return `  ${route.id}: ${className};`;
  })
  .join("\n");

const routePageFactory = routeDefinitions
  .map((route) => {
    const className = `${pascalCase(route.id)}Page`;
    return `  ${route.id}: new ${className}(page),`;
  })
  .join("\n");

const routePagesTs = `import type { Page } from "@playwright/test";
import { BaseRoutePage } from "../base/BaseRoutePage";

${routeClasses}

export interface RoutePages {
${routePageTypes}
}

export const createRoutePages = (page: Page): RoutePages => ({
${routePageFactory}
});
`;

const csvEscape = (value) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const csvHeader = [
  "Case ID",
  "Route",
  "Function",
  "Preconditions",
  "Steps",
  "Expected Result",
  "Tags",
  "Automation Status",
  "Priority",
];

const csvRows = [csvHeader.join(",")];

routeSpecs.forEach((routeSpec) => {
  routeSpec.functions.forEach((functionSpec, index) => {
    const caseId = `TC-${routeSpec.id.toUpperCase()}-${String(index + 1).padStart(3, "0")}`;
    const row = [
      caseId,
      routeSpec.path,
      functionSpec.name,
      functionSpec.preconditions,
      functionSpec.steps,
      functionSpec.expectedResult,
      functionSpec.tags.join(" "),
      functionSpec.automationStatus,
      functionSpec.priority,
    ];

    csvRows.push(row.map(csvEscape).join(","));
  });
});

const coverageSummaryMd = `# Playwright Functional Coverage\n\n- Canonical routes: ${routeDefinitions.length}\n- Total function test cases: ${routeSpecs.reduce((sum, route) => sum + route.functions.length, 0)}\n- Automated cases in seed phase: ${routeSpecs
  .flatMap((route) => route.functions)
  .filter((fn) => fn.automationStatus === "Automated").length}\n\nGenerated from scripts/generate-playwright-assets.mjs.\n`;

mkdirSync("tests/contracts", { recursive: true });
mkdirSync("tests/framework/pages", { recursive: true });
mkdirSync("docs/testing", { recursive: true });

writeFileSync("tests/contracts/routeSpecs.ts", routeSpecsTs);
writeFileSync("tests/contracts/canonicalRoutes.ts", canonicalRoutesTs);
writeFileSync("tests/framework/pages/routePages.ts", routePagesTs);
writeFileSync("docs/testing/functional-test-catalog.csv", `${csvRows.join("\n")}\n`);
writeFileSync("docs/testing/functional-coverage-summary.md", coverageSummaryMd);

console.log("Generated route specs, route pages, and functional test catalog.");
