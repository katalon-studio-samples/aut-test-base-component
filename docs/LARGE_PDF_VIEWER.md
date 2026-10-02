# Large PDF Viewer fixture

Open `/large-pdf-viewer` (also supports the application's `.html`, `.php`, `.asp`, `.aspx`, and `.jsp` route aliases), or choose **Content → Large PDF Viewer**.

1. Start Traffic Agent / Session Replay with your test environment and client code using the existing Settings page.
2. Choose **38 pages — large document** and click **Open document**.
3. Wait for **38 pages ready**, then scroll, click Next/Previous, enter a page number, and change Zoom.
4. Leave the viewer open through a recorder checkpoint, then reload or close/reopen the document. Inspect the recorded iframe attachment/checkpoint and resulting replay chunks.
5. Compare with **2 pages — small comparison** to isolate payload-size effects.

## Why this fixture uses inline images

Read-only inspection of the referenced replay found two large Brotli chunks: **12,433,862 bytes → 19,040,882 bytes JSONL** and **11,783,723 bytes → 17,619,076 bytes JSONL**. Each contains one rrweb mutation (`type: 3`, `source: 0`, `isAttachIframe: true`) attaching a complete iframe document. The documents contain **38 / 36 `<img class="img-responsive">` page images with inline `data:image/png;base64,...` sources**. The captured viewer uses a scrolling raster image stack.

This fixture reproduces that DOM and payload mechanism with generated synthetic pages. It includes navigation and zoom controls for repeatable interactions. It generates the complete page stack in a deferred iframe script before the iframe load event, so the recorder can attach the populated document at once. Images stay mounted even when offscreen. There is no new dependency or large binary fixture committed to the repository.

Each page is drawn onto an offscreen canvas and immediately serialized as a PNG data URL on an `<img>`; canvases are never attached to the document. Deterministic scan noise keeps the images large after compression. Rendering all pages before iframe load deliberately causes a short synchronous initialization cost, matching the large iframe attachment scenario.

The displayed MiB count measures ASCII image-source attributes only. PNG encoding varies by browser, so exact byte counts differ. The regression test independently validates all images decode, counts 38 pages, and checks that the actual serialized image attributes still exceed **8 MiB after Brotli quality-6 compression**. This measures fixture payload size, rather than proving the production recorder upload, processor splitting, or S3 delivery. Those flows should be tested with the configured Traffic Agent.

## Validation

```sh
npm ci
npm run dev
npx playwright install
npx playwright test tests/specs/regression/large-pdf-viewer.regression.spec.ts
```

For an already running server:

```sh
BASE_URL=http://127.0.0.1:5187 npx playwright test tests/specs/regression/large-pdf-viewer.regression.spec.ts
```

Only synthetic page content is generated. No customer PNGs, document text, or downloaded replay chunks are bundled.
