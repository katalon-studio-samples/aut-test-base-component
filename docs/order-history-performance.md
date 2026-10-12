# TruePhamacy order history

Open `/truephamacy-order` (also `.html`, `.php`, `.asp`, `.aspx`, `.jsp`) or use **TruePhamacy** in the Basic menu. This page has its own full-width order history layout.

The page has white navigation, a blue account/search bar, order status/type/purchase order filters, a date range, a horizontally scrollable table and pagination. The table has Order #, Confirmation #, Order type, Order method, Order date, Total, PO # and Order status columns. It also includes Quantity and Notes.

Only synthetic account and order values are included. The page uses generic TruePhamacy branding and sample data.

## Workloads

- Starts with 250 deterministic orders and 25 mounted rows.
- Search across order #, confirmation #, PO #, notes and order method. Combine status, type, PO substring and inclusive date filters.
- Click a column heading to sort ascending/descending. Order date starts descending.
- Edit PO #, quantity and notes, or select a row. Edits and selections survive sorting, filtering and pagination during the current visit. Reloading or generating a new dataset resets them.
- Expand an order # to add visible detail content and exercise DOM mutations.
- Choose 10, 25, 50, 100, 1,000 or 10,000 items per page. Pagination limits mounted DOM, not just visibility.
- Generate an exact count or randomize an inclusive minimum/maximum count (1–10,000). Order contents remain deterministic for repeatable comparisons.
- Enable **Render all rows (no pagination)** to mount every matching order and its four inputs. There is no virtualization. Clear filters before comparing DOM sizes. The scroll container limits the viewport, not the mounted row count.

At 10,000 unfiltered rows, the fixture mounts 40,000 inputs and approximately 420,000 table elements. This is an intentional stress workload; it can introduce substantial baseline application cost. Quantity and notes are test inputs and do not change order totals or contact an ordering service.

## Traffic Agent and Session Replay

Use the existing loader with a **test AUT's client code** and an environment query parameter, for example:

```text
/truephamacy-order?env=qa&clientCode=<TEST_AUT_CLIENT_CODE>
/truephamacy-order?env=staging&clientCode=<TEST_AUT_CLIENT_CODE>
/truephamacy-order?env=prod&clientCode=<TEST_AUT_CLIENT_CODE>
```

The explicit `prod` environment now maps to `https://static.katalon.com`, matching the loader's default production host. QA/staging hosts retain their existing behavior. No AUT client code is configured by default.

Enable traffic collection and Session Replay on that test tracking environment and ensure it permits the fixture origin. The repository loader remembers environment and client code in `katalon-env` and `katalon-client-code` localStorage. A loaded script or the configuration banner alone does not confirm successful traffic delivery or recording.

For an agent-off baseline, use a fresh browser context with no client code in the URL/localStorage. To clear a previously configured context, remove `katalon-client-code` and `katalon-env`, then reload without query parameters. The SDK still loads, but the collector is only appended when a client code is configured. Clear those settings before switching AUTs.

1. Use `npm run build` and `npm run preview -- --host 127.0.0.1 --port 4173` for measurements. The development server includes React StrictMode and development overhead.
2. In a fresh context, open the fixture without the agent. Set the row count and render mode; clear filters. Record an input/search/sort/scroll interaction in browser DevTools Performance.
3. Repeat in another fresh context with the test AUT enabled, using the same dataset size, render mode and interaction sequence. Test collection alone and collection plus replay by configuring the test tracking environment between runs.
4. Test 100, 1,000, 5,000 and 10,000 mounted rows. Measure typing response, long tasks, DOM size and heap. Also compare paginated mode with the same dataset size.
5. Type distinctive sample notes, edit a PO # and quantity, select a row, expand details, filter/sort and paginate. Confirm traffic events arrive and open the newly recorded replay to verify those interactions, honoring the AUT's input masking settings.

This fixture provides a repeatable workload. A successful fixture test does not by itself establish the cause of the performance issues in another application. Actual traffic ingestion, Session Replay persistence and agent-on/off performance require a configured test AUT and separate measurements.

## Verification

```sh
npm run build
npx eslint src/pages/OrderHistoryPage.tsx src/pages/order-history src/App.tsx src/components/SideNav.tsx tests/specs/regression/order-history.regression.spec.ts
npx playwright test tests/specs/regression/order-history.regression.spec.ts tests/specs/smoke/app-shell.smoke.spec.ts
```

The fixture tests stub the remote agent scripts; they verify the loader URL and UI behavior without sending synthetic traffic to a real AUT.
