# Traffic Agent Iframe Fixture

Route URL: `/traffic-agent-iframe-fixture`

This page validates Traffic Agent event capture across parent and iframe contexts for GitHub product issue #1005.

Covered controls and contexts:

- Parent page: button, text input, select, debug log controls.
- Initial same-origin iframe: button, link, text input, textarea, checkbox, radio group, select, file input, submit button.
- Dynamic same-origin iframe: created by `Add dynamic iframe`, with button, input, select, file input, and a remove button.
- Iframe reload/navigation: `Reload iframe` swaps the initial iframe between version 1 and version 2 content.
- Already-instrumented iframe: sets `window.__trafficAgentIframeFixtureAlreadyLoaded = true` and uses unique control ids/action event ids.
- Nested same-origin iframe: parent iframe contains a child iframe whose controls report depth 2.
- Cross-origin iframe: embeds `https://example.com/`; the parent catches and logs skipped DOM access.
- iPipeline-like modal flow: `Open attachments modal` renders `CossScreenFrame`, which contains `iFrameModal` with `beneficiaryOption`, upload, and preview controls.

How to use:

1. Open `/traffic-agent-iframe-fixture`.
2. Interact with parent controls and each iframe section.
3. Compare Traffic Agent capture output with the on-page debug panel.
4. Use `Clear debug log`, `Export debug log JSON`, and `Show fixture state` while testing.

Expected debug log behavior:

- Same-origin iframe events post messages to the parent and appear in the debug panel.
- Each event includes timestamp, frame name, frame depth, action type, target tag, stable id/name/text, and safe values.
- File inputs log only the number of selected files, never file content.
- Cross-origin DOM access is skipped and logged without breaking parent or same-origin controls.
