# Inherited-Origin Iframe Session Replay Fixture

Static QA fixture for verifying that Katalon TrueTest Traffic Agent and Session Replay use the canonical top-page origin for uploads triggered by accessible inherited-origin iframes.

The fixture does not simulate or directly call the Katalon `/record` API. Inspect real Traffic Agent requests externally with Browser DevTools or Playwright.

## Run locally

Serve the repository over HTTP; do not open `index.html` with `file://`.

From the repository root:

```bash
npx serve public
```

Open:

```text
http://localhost:3000/traffic-agent-inherited-origin-fixture/
```

The existing Vite development server also serves this directory:

```bash
npm run dev
```

Then open `http://localhost:5173/traffic-agent-inherited-origin-fixture/index.html`. Vite's SPA fallback handles the directory-only path as the main React application, so include `index.html` during local Vite testing.

## Configure Traffic Agent

1. Add the tester-approved Traffic Agent snippet at the single marked placeholder in `index.html`:

   ```html
   <!-- INSERT KATALON TRAFFIC AGENT SNIPPET HERE -->
   ```

2. Configure the deployed fixture domain as an allowed data-tracking domain for the intended QA or Staging client.
3. Do not commit client codes, credentials, tokens, or production URLs.
4. Load the top page and wait for the product's normal startup period.
5. Select the neutral dashboard value `configured by tester`; this is a tester annotation, not automatic detection.
6. Click **Create/Recreate iframe fixtures**. The snippet must exist only in the top page; child frames rely on normal accessible-iframe bootstrap behavior.

## Deploy to QA or Staging

Deploy the contents of this directory as static files under an HTTPS origin, for example:

```text
https://qa-fixtures.example.test/traffic-agent-inherited-origin-fixture/
```

Preserve the relative paths among `index.html`, `styles.css`, and `app.js`. Configure the exact HTTPS origin as an allowed data-tracking domain before testing. Avoid production domains and production Traffic Agent configuration.

## Scenarios

- Top-frame controls.
- Direct JavaScript-created `about:blank` iframe with no `src` attribute.
- Direct `srcdoc` iframe.
- Nested `about:blank` parent creating a `srcdoc` child.
- Nested `srcdoc` parent dynamically creating and populating an `about:blank` child.
- Three sibling JavaScript-created `about:blank` iframes.
- Repeated input, checkbox, and click actions across every accessible frame.

No iframe has a `sandbox` attribute, cross-origin URL, `data:` URL, or manually injected Traffic Agent snippet.

## QA workflow

1. Open DevTools and enable **Preserve log** in the Network panel.
2. Filter requests by `/record` or the supported Session Replay endpoint.
3. Click **Create/Recreate iframe fixtures** to begin a fresh run ID.
4. Interact with each frame or use **Run repeated actions** for intermittent-failure testing.
5. Correlate the action log's run ID, frame ID, action count, timestamp, actual frame origin, and canonical expected top-page origin with captured requests.
6. Confirm the frame inventory reports parent `contentDocument` access and preserves the browser's actual `window.location.origin`, including the literal value `null` if the browser reports it.

Expected frame IDs:

- `top`
- `about-blank-direct`
- `srcdoc-direct`
- `about-blank-nested-parent`
- `about-blank-to-srcdoc-child`
- `srcdoc-nested-parent`
- `srcdoc-to-about-blank-child`
- `about-blank-sibling-1`, `about-blank-sibling-2`, and `about-blank-sibling-3`

The dashboard never claims that Traffic Agent is loaded because this fixture has no reliable supported signal for that state.
