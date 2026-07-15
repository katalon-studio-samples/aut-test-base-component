# Playwright Framework (POM)

## Overview

This repository now includes a native Playwright + TypeScript automation framework built with a layered POM design:

- `tests/framework/base`: base page abstractions
- `tests/framework/components`: reusable UI components/helpers
- `tests/framework/pages`: route page objects and seed feature page objects
- `tests/fixtures`: typed `AppFixtures` composition root
- `tests/specs`: smoke, regression, and nonblocking suites
- `tests/contracts`: route/function metadata contracts and generated route specs

## Execution Model

- PR: `@smoke` suite on Chromium/Firefox/WebKit
- Nightly/manual: `@regression` (blocking deterministic) + `@nonblocking` (external/dynamic)

### Tags

- `@smoke`
- `@regression`
- `@nonblocking`
- `@external`
- `@dynamic`

## Commands

```bash
npm run test:e2e
npm run test:e2e:smoke
npm run test:e2e:regression
npm run test:e2e:nonblocking
npm run test:e2e:all
npm run test:e2e:report
npm run test:manual:generate
```

`test:e2e:all` runs deterministic regression first, then runs `@nonblocking` in non-gating mode.

## Testcase Catalog

Generated deliverables:

- `docs/testing/functional-test-catalog.csv`
- `docs/testing/functional-coverage-summary.md`
- `docs/testing/manual-test-cases/manual-test-catalog.csv`
- `docs/testing/manual-test-cases/manual-test-catalog.smoke.csv`
- `docs/testing/manual-test-cases/manual-test-catalog.regression.csv`
- `docs/testing/manual-test-cases/manual-test-catalog.nonblocking.csv`
- `docs/testing/manual-test-cases/manual-coverage-summary.md`

Automated catalogs are generated from:

```bash
node scripts/generate-playwright-assets.mjs
```

Manual test catalogs are generated from:

```bash
npm run test:manual:generate
```

## Environment

- Default local base URL: `http://127.0.0.1:5173`
- Override with `BASE_URL` to target deployed environments
- If `BASE_URL` is not provided, Playwright auto-starts the local Vite server
