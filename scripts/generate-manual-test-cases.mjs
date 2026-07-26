import { mkdirSync, writeFileSync } from "node:fs";
import { ROUTE_SPECS } from "../tests/contracts/routeSpecs.ts";

const OUTPUT_DIR = "docs/testing/manual-test-cases";

const csvEscape = (value) => {
  const raw = String(value ?? "");
  if (raw.includes('"') || raw.includes(",") || raw.includes("\n")) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
};

const toCaseToken = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

const normalizeSentence = (value) => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    return "";
  }
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const buildManualSteps = (routePath, functionSteps) => {
  const step1 = `Open route ${routePath}.`;
  const step2 = normalizeSentence(functionSteps);
  const step3 = "Validate the UI/system response against expected behavior.";
  return [step1, step2, step3].join(" ");
};

const allCases = ROUTE_SPECS.flatMap((route) =>
  route.functions.map((fn, index) => ({
    caseId: `MTC-${toCaseToken(route.id)}-${String(index + 1).padStart(3, "0")}`,
    route: route.path,
    routeId: route.id,
    functionId: fn.id,
    functionName: fn.name,
    preconditions: normalizeSentence(fn.preconditions),
    steps: buildManualSteps(route.path, fn.steps),
    expectedResult: normalizeSentence(fn.expectedResult),
    tags: fn.tags.join(" "),
    priority: fn.priority,
    automationStatus: fn.automationStatus,
    executionClass: fn.tags.includes("@nonblocking") ? "Nonblocking" : "Blocking",
    suites: {
      smoke: fn.tags.includes("@smoke"),
      regression: fn.tags.includes("@regression") && !fn.tags.includes("@nonblocking"),
      nonblocking: fn.tags.includes("@nonblocking"),
      all: true,
    },
  })),
);

const headers = [
  "Case ID",
  "Route",
  "Function",
  "Preconditions",
  "Manual Steps",
  "Expected Result",
  "Tags",
  "Priority",
  "Execution Class",
  "Automation Status",
  "Automation Mapping",
];

const toCsvRows = (cases) => [
  headers.join(","),
  ...cases.map((entry) =>
    [
      entry.caseId,
      entry.route,
      entry.functionName,
      entry.preconditions,
      entry.steps,
      entry.expectedResult,
      entry.tags,
      entry.priority,
      entry.executionClass,
      entry.automationStatus,
      `${entry.routeId}.${entry.functionId}`,
    ]
      .map(csvEscape)
      .join(","),
  ),
];

const suites = [
  { key: "all", file: "manual-test-catalog.csv", label: "All" },
  { key: "smoke", file: "manual-test-catalog.smoke.csv", label: "Smoke" },
  { key: "regression", file: "manual-test-catalog.regression.csv", label: "Regression (Blocking)" },
  { key: "nonblocking", file: "manual-test-catalog.nonblocking.csv", label: "Nonblocking" },
];

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const suite of suites) {
  const subset = allCases.filter((entry) => entry.suites[suite.key]);
  const rows = toCsvRows(subset);
  writeFileSync(`${OUTPUT_DIR}/${suite.file}`, `${rows.join("\n")}\n`);
}

const now = new Date().toISOString();
const summary = `# Manual Test Coverage

- Generated at: ${now}
- Total manual cases: ${allCases.length}
- Smoke manual cases: ${allCases.filter((entry) => entry.suites.smoke).length}
- Regression manual cases (blocking): ${allCases.filter((entry) => entry.suites.regression).length}
- Nonblocking manual cases: ${allCases.filter((entry) => entry.suites.nonblocking).length}

Generated from:

- tests/contracts/routeSpecs.ts
`;

writeFileSync(`${OUTPUT_DIR}/manual-coverage-summary.md`, summary);

const readme = `# Manual Test Cases

This folder contains manual test-case catalogs generated from the Playwright function contracts.

## Files

- manual-test-catalog.csv
- manual-test-catalog.smoke.csv
- manual-test-catalog.regression.csv
- manual-test-catalog.nonblocking.csv
- manual-coverage-summary.md

## Source of Truth

- tests/contracts/routeSpecs.ts

## Regenerate

\`\`\`bash
npm run test:manual:generate
\`\`\`
`;

writeFileSync(`${OUTPUT_DIR}/README.md`, readme);

console.log(`Manual test catalogs generated in ${OUTPUT_DIR}`);
