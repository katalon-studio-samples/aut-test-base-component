# Pharmacy workflow prototype

Open `/truephamacy-workflow` from **Pharmacy Workflow** in the sidebar. This prototype recreates the visible product, cart and return workflow from the Cardinal recordings in `Desktop/Cadinal ` using synthetic data.

The catalog contains 5,000 deterministic products and displays 200 rows per page by default (25 pages, no virtualization). **Items per page** also supports 5, 10, 50, 100 and 500 rows. Every catalog column supports ascending/descending sorting across all filtered products before pagination. Quantity, stock and cost use numeric order; Favorites sorts by selected state. Headers expose the active direction through `aria-sort`.

Each generated product has distinct CIN/NDC/GTIN identifiers and demo invoices and can enter the existing cart/return flow.

## Try the flow

1. Search for **care**, enter a quantity for **Demo Care Cream**, and choose **Add to cart**.
2. Open **View cart**. Edit quantity, PO number, memo and **Do not substitute**. **Analyze cart** checks available stock; **Submit cart** confirms a browser-local practice submission.
3. Choose **Create return request**. Select **Ordered in error**, enter a numeric serial and the product's demo GTIN `00000000001001`.
4. Choose **Match to invoice**, select `INV-DEMO-1001-1`, then apply. Add a second row to exercise Each/Case changes or a different invoice.
5. Submit the return and open **Return history**. **Invoices & credits** shows the remaining returnable quantities. **Reset demo data** starts again.

For a non-serialized flow, search for **cleanser** and add it directly to a return request. Enter a quantity instead of serial/GTIN.

## Observed reference and prototype decisions

The readable recordings from 2026-10-13 at 11:39, 11:43 and 12:06 show product search/results, quantity entry, cart editing, PO/memo, substitution controls, serialized and non-serialized return cards, required reasons/comments, dynamic serial/unit/GTIN rows, invoice fields/matching and an unsaved-progress warning. Sampled frames from the 11:53 recording were black, so that recording was not used as evidence.

The prototype adds a deterministic invoice picker, local submission receipts/history, invoice-balance enforcement, and simplified validation so the whole flow can be exercised. These are demo rules, not verified Cardinal business rules: Each = 1 unit, Case = 4 units, serial = 1–20 digits, GTIN = 8–14 digits, non-serialized quantity = 1–99. Prices, stock, identifiers, accounts and invoices are synthetic; source recordings and their production data are not copied into the repository.

## State and navigation

Cart, favorites and submitted return history persist in `sessionStorage` for the current tab. Draft returns are in memory. Leaving a dirty return draft through app navigation or browser Back/Forward opens **Progress will not be saved**; cancel preserves rows and discard follows the intended navigation. Reload/close uses the browser's native unsaved-changes prompt. Accepted reload discards the draft.

All business actions run locally with no ordering/returns backend. The existing site Traffic Agent loader remains available under its normal configuration, so this fixture can also exercise replay capture. Tables scroll horizontally on narrow screens.

## Verification

Run `npx playwright test tests/specs/regression/pharmacy-workflow.regression.spec.ts --project=chromium`.

Coverage includes the complete serialized flow, cart persistence, return history/reset, invalid fields and duplicate serials, aggregate invoice balances, non-serialized returns, navigation warning/cancel/discard, filters, pagination, empty results and local cart submission.

Validated locally: 11 Chromium scenarios (complete flow, sorting and responsive layout), 6 WebKit scenarios (complete flow and responsive layout), production Vite build, and lint for changed workflow modules. App-wide TypeScript checking has existing failures in other pages; no diagnostics were reported for these workflow modules.

Responsive layout is checked at 1440, 1024, 768, 390 and 320 px. The workflow uses its actual container width for breakpoints so the app sidebar cannot squeeze desktop controls out of view. Return reason/comment fields share one baseline and 40 px control height; narrow screens stack full-width fields. Order menus stay inside the page, long tables scroll within their frames, picker dialogs have a reachable sticky close header, and measured banner height keeps the logo and app controls clear. Cart actions and pagination remain above the catalog table.

The catalog has a checkbox at the start of each row. Selecting a row defaults its quantity to 1 and preserves an entered quantity; deselecting clears it. **Select all** applies to in-stock products on the current page only; selections on other pages are preserved when navigating or toggling this checkbox, and shows a mixed state for partial selection on the current page. Out-of-stock rows cannot be selected. **Add to cart** adds selected products together and clears the selection after success.
