(() => {
  "use strict";

  const MESSAGE_SOURCE = "traffic-agent-inherited-origin-fixture";
  const canonicalOrigin = window.location.origin;
  let runSequence = 0;
  let runId = createRunId();
  let actionLog = [];
  const frameDiagnostics = new Map();

  const elements = {
    fixtureHost: document.querySelector("#fixture-host"),
    fixtureState: document.querySelector("#fixture-state"),
    frameCount: document.querySelector("#frame-count"),
    frameInventoryBody: document.querySelector("#frame-inventory-body"),
    actionLogBody: document.querySelector("#action-log-body"),
    actionLogCount: document.querySelector("#action-log-count"),
    createFixtures: document.querySelector("#create-fixtures"),
    clearLog: document.querySelector("#clear-log"),
    runRepeatedActions: document.querySelector("#run-repeated-actions"),
    repeatCount: document.querySelector("#repeat-count"),
    repeatDelay: document.querySelector("#repeat-delay"),
    trafficAgentStatus: document.querySelector("#traffic-agent-status"),
  };

  function createRunId() {
    runSequence += 1;
    return `run-${Date.now()}-${runSequence}`;
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function updateEnvironment(createdAt = "Not created") {
    setText("#environment-url", window.location.href);
    setText("#environment-origin", window.location.origin);
    setText("#environment-run-id", runId);
    setText("#environment-created-at", createdAt);
    setText("#environment-user-agent", navigator.userAgent);
    setText("#environment-is-top", String(window.top === window.self));
    setText("#environment-agent-status", elements.trafficAgentStatus.value);
  }

  function actionTypeFor(target, eventType) {
    if (target instanceof HTMLButtonElement) return "button-click";
    if (target instanceof HTMLInputElement && target.type === "checkbox") return "checkbox-change";
    if (target instanceof HTMLInputElement && target.type === "text") return "text-input";
    return eventType;
  }

  function formatMarker(event) {
    return `${event.runId} | ${event.frameId} | ${event.actionType} | action-${event.actionCount} | ${event.timestamp}`;
  }

  function recordTopAction(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest("#top-frame-controls")) return;

    const allowed =
      (event.type === "click" && target instanceof HTMLButtonElement) ||
      (event.type === "input" && target instanceof HTMLInputElement && target.type === "text") ||
      (event.type === "change" && target instanceof HTMLInputElement && target.type === "checkbox");
    if (!allowed) return;

    const countElement = document.querySelector("#top-action-count");
    const lastActionElement = document.querySelector("#top-last-action");
    const actionCount = Number(countElement.textContent) + 1;
    const fixtureEvent = {
      runId,
      frameId: "top",
      actionType: actionTypeFor(target, event.type),
      actionCount,
      timestamp: new Date().toISOString(),
      href: window.location.href,
      origin: window.location.origin,
    };

    countElement.textContent = String(actionCount);
    lastActionElement.textContent = formatMarker(fixtureEvent);
    appendAction(fixtureEvent);
  }

  function appendAction(event) {
    actionLog.unshift(event);
    renderActionLog();
  }

  function renderActionLog() {
    elements.actionLogCount.textContent = `${actionLog.length} action${actionLog.length === 1 ? "" : "s"}`;
    if (!actionLog.length) {
      elements.actionLogBody.innerHTML = '<tr class="empty-row"><td colspan="6">No actions recorded.</td></tr>';
      return;
    }

    elements.actionLogBody.replaceChildren(
      ...actionLog.map((event) => {
        const row = document.createElement("tr");
        [event.timestamp, event.runId, event.frameId, event.actionType, String(event.actionCount), event.origin].forEach(
          (value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
          },
        );
        return row;
      }),
    );
  }

  function renderFrameInventory() {
    const frames = [...frameDiagnostics.values()];
    elements.frameCount.textContent = `${frames.length} frame${frames.length === 1 ? "" : "s"}`;
    if (!frames.length) {
      elements.frameInventoryBody.innerHTML =
        '<tr class="empty-row"><td colspan="7">Create the iframe fixtures to collect diagnostics.</td></tr>';
      return;
    }

    elements.frameInventoryBody.replaceChildren(
      ...frames.map((frame) => {
        const row = document.createElement("tr");
        const values = [
          frame.frameId,
          frame.kind,
          String(frame.depth),
          frame.parentCanAccess ? "yes" : "no",
          frame.href,
          frame.origin,
          frame.expectedOrigin,
        ];
        values.forEach((value, index) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          if (index === 3) cell.className = frame.parentCanAccess ? "access-yes" : "access-no";
          row.append(cell);
        });
        return row;
      }),
    );
  }

  function childStyles() {
    return `
      :root { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #172033; }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 16px; background: #fff; }
      h2 { margin: 0; font-size: 1.05rem; }
      .diagnostics { display: grid; gap: 4px; margin: 10px 0 14px; padding: 10px; border-radius: 8px; background: #eef4f8; font: 11px/1.45 SFMono-Regular, Consolas, monospace; overflow-wrap: anywhere; }
      .controls { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end; }
      label { display: grid; gap: 5px; color: #4c5e71; font-size: 12px; font-weight: 700; }
      input[type=text] { min-width: 0; padding: 8px; border: 1px solid #aebdca; border-radius: 6px; }
      button { min-height: 36px; padding: 7px 10px; border: 0; border-radius: 6px; color: white; background: #245f96; font-weight: 750; cursor: pointer; }
      .checkbox { display: flex; align-items: center; gap: 6px; min-height: 36px; padding: 0 8px; border: 1px solid #c7d2dd; border-radius: 6px; }
      .markers { grid-column: 1 / -1; display: grid; grid-template-columns: 105px 1fr; gap: 6px; }
      .marker { min-width: 0; padding: 8px; border-radius: 6px; background: #f3f6f9; }
      .marker span { display: block; color: #708092; font-size: 10px; font-weight: 800; text-transform: uppercase; }
      .marker output, .marker strong { display: block; margin-top: 3px; overflow-wrap: anywhere; font: 11px/1.4 SFMono-Regular, Consolas, monospace; }
      .nested-host { margin-top: 14px; padding-top: 12px; border-top: 1px solid #dce4eb; }
      .nested-status { margin: 0 0 8px; color: #506377; font-size: 11px; }
      iframe { display: block; width: 100%; height: 335px; border: 1px solid #b9c6d2; border-radius: 8px; background: #fff; }
      @media (max-width: 600px) { .controls { grid-template-columns: 1fr; } .markers { grid-column: auto; grid-template-columns: 1fr; } }
    `;
  }

  function buildFrameDocument(config) {
    const serializedConfig = JSON.stringify(config).replace(/</g, "\\u003c");
    return `<!doctype html>
      <html lang="en">
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${childStyles()}</style></head>
        <body>
          <h2>${config.title}</h2>
          <div class="diagnostics" data-testid="${config.frameId}-diagnostics">
            <div>frame: <strong>${config.frameId}</strong></div>
            <div>href: <span id="frame-href"></span></div>
            <div>origin: <span id="frame-origin"></span></div>
            <div>expected: <span id="frame-expected-origin"></span></div>
          </div>
          <div class="controls" data-frame-id="${config.frameId}">
            <label for="${config.frameId}-text-input">Text input
              <input id="${config.frameId}-text-input" data-testid="${config.frameId}-text-input" type="text" autocomplete="off">
            </label>
            <button id="${config.frameId}-action-button" data-testid="${config.frameId}-action-button" type="button">Record click</button>
            <label class="checkbox" for="${config.frameId}-checkbox">
              <input id="${config.frameId}-checkbox" data-testid="${config.frameId}-checkbox" type="checkbox"> Checkbox
            </label>
            <div class="markers">
              <div class="marker"><span>Action count</span><strong id="${config.frameId}-action-count" data-testid="${config.frameId}-action-count">0</strong></div>
              <div class="marker"><span>Last action</span><output id="${config.frameId}-last-action" data-testid="${config.frameId}-last-action">No actions yet</output></div>
            </div>
          </div>
          ${config.nestedChild ? '<div class="nested-host"><p id="nested-access-status" class="nested-status">Creating nested frame…</p><div id="nested-frame-host"></div></div>' : ""}
          <script>(${frameBootstrap.toString()})(${serializedConfig});</script>
        </body>
      </html>`;
  }

  function frameBootstrap(config) {
    const MESSAGE_SOURCE = "traffic-agent-inherited-origin-fixture";
    const hrefElement = document.querySelector("#frame-href");
    const originElement = document.querySelector("#frame-origin");
    const expectedOriginElement = document.querySelector("#frame-expected-origin");
    const countElement = document.querySelector(`#${config.frameId}-action-count`);
    const lastActionElement = document.querySelector(`#${config.frameId}-last-action`);
    let actionCount = 0;

    hrefElement.textContent = window.location.href;
    originElement.textContent = window.location.origin;
    expectedOriginElement.textContent = config.expectedOrigin;

    window.top.postMessage(
      {
        source: MESSAGE_SOURCE,
        type: "frame-diagnostic",
        payload: {
          runId: config.runId,
          frameId: config.frameId,
          kind: config.kind,
          depth: config.depth,
          parentCanAccess: true,
          href: window.location.href,
          origin: window.location.origin,
          expectedOrigin: config.expectedOrigin,
        },
      },
      "*",
    );

    const emitAction = (actionType) => {
      actionCount += 1;
      const payload = {
        runId: config.runId,
        frameId: config.frameId,
        actionType,
        actionCount,
        timestamp: new Date().toISOString(),
        href: window.location.href,
        origin: window.location.origin,
      };
      countElement.textContent = String(actionCount);
      lastActionElement.textContent = `${payload.runId} | ${payload.frameId} | ${payload.actionType} | action-${payload.actionCount} | ${payload.timestamp}`;
      window.top.postMessage({ source: MESSAGE_SOURCE, type: "fixture-action", payload }, "*");
    };

    document.querySelector(`#${config.frameId}-text-input`).addEventListener("input", () => emitAction("text-input"));
    document.querySelector(`#${config.frameId}-action-button`).addEventListener("click", () => emitAction("button-click"));
    document.querySelector(`#${config.frameId}-checkbox`).addEventListener("change", () => emitAction("checkbox-change"));

    if (!config.nestedChild) return;

    const nestedFrame = document.createElement("iframe");
    nestedFrame.id = `${config.nestedChild.frameId}-iframe`;
    nestedFrame.name = config.nestedChild.frameId;
    nestedFrame.title = config.nestedChild.title;
    nestedFrame.dataset.testid = `${config.nestedChild.frameId}-iframe`;
    const nestedDocument = config.nestedChild.documentHtml;
    const nestedHost = document.querySelector("#nested-frame-host");
    const nestedStatus = document.querySelector("#nested-access-status");

    if (config.nestedChild.kind === "srcdoc") {
      nestedFrame.srcdoc = nestedDocument;
      nestedHost.append(nestedFrame);
    } else {
      nestedHost.append(nestedFrame);
      const childDocument = nestedFrame.contentDocument;
      if (childDocument) {
        childDocument.open();
        childDocument.write(nestedDocument);
        childDocument.close();
      }
    }

    const parentCanAccess = Boolean(nestedFrame.contentDocument);
    nestedStatus.textContent = `Parent contentDocument access: ${parentCanAccess ? "yes" : "no"}`;
  }

  function createCard(frameId, label, isNested = false) {
    const card = document.createElement("article");
    card.className = `fixture-card${isNested ? " nested" : ""}`;
    card.innerHTML = `<div class="fixture-card-header"><span>${label}</span><code>${frameId}</code></div>`;
    return card;
  }

  function appendAboutBlankFrame(config, label, nestedChild) {
    const card = createCard(config.frameId, label, Boolean(nestedChild));
    const iframe = document.createElement("iframe");
    iframe.id = `${config.frameId}-iframe`;
    iframe.name = config.frameId;
    iframe.title = label;
    iframe.dataset.testid = `${config.frameId}-iframe`;
    card.append(iframe);
    elements.fixtureHost.append(card);

    const frameDocument = iframe.contentDocument;
    const parentCanAccess = Boolean(frameDocument);
    if (!frameDocument) {
      frameDiagnostics.set(config.frameId, {
        ...config,
        href: "unavailable",
        origin: "unavailable",
        parentCanAccess,
      });
      renderFrameInventory();
      return;
    }

    frameDocument.open();
    frameDocument.write(buildFrameDocument({ ...config, nestedChild }));
    frameDocument.close();
  }

  function appendSrcdocFrame(config, label, nestedChild) {
    const card = createCard(config.frameId, label, Boolean(nestedChild));
    const iframe = document.createElement("iframe");
    iframe.id = `${config.frameId}-iframe`;
    iframe.name = config.frameId;
    iframe.title = label;
    iframe.dataset.testid = `${config.frameId}-iframe`;
    iframe.srcdoc = buildFrameDocument({ ...config, nestedChild });
    card.append(iframe);
    elements.fixtureHost.append(card);
  }

  function frameConfig(frameId, title, kind, depth) {
    return { runId, frameId, title, kind, depth, expectedOrigin: canonicalOrigin };
  }

  function nestedChildConfig(frameId, title, kind) {
    const config = frameConfig(frameId, title, kind, 2);
    return { ...config, documentHtml: buildFrameDocument(config) };
  }

  function createFixtures() {
    runId = createRunId();
    actionLog = [];
    frameDiagnostics.clear();
    elements.fixtureHost.replaceChildren();
    setText("#top-action-count", "0");
    setText("#top-last-action", "No actions yet");
    document.querySelector("#top-text-input").value = "";
    document.querySelector("#top-checkbox").checked = false;
    renderActionLog();
    renderFrameInventory();

    appendAboutBlankFrame(
      frameConfig("about-blank-direct", "Direct about:blank", "about:blank", 1),
      "Direct about:blank",
    );
    appendSrcdocFrame(frameConfig("srcdoc-direct", "Direct srcdoc", "srcdoc", 1), "Direct srcdoc");
    appendAboutBlankFrame(
      frameConfig("about-blank-nested-parent", "about:blank nested parent", "about:blank", 1),
      "Nested about:blank → srcdoc",
      nestedChildConfig("about-blank-to-srcdoc-child", "Nested srcdoc child", "srcdoc"),
    );
    appendSrcdocFrame(
      frameConfig("srcdoc-nested-parent", "srcdoc nested parent", "srcdoc", 1),
      "Nested srcdoc → about:blank",
      nestedChildConfig("srcdoc-to-about-blank-child", "Nested about:blank child", "about:blank"),
    );

    for (let sibling = 1; sibling <= 3; sibling += 1) {
      appendAboutBlankFrame(
        frameConfig(`about-blank-sibling-${sibling}`, `about:blank sibling ${sibling}`, "about:blank", 1),
        `Sibling about:blank ${sibling}`,
      );
    }

    const createdAt = new Date().toISOString();
    updateEnvironment(createdAt);
    elements.fixtureState.textContent = "Created";
    elements.fixtureState.className = "status status-ready";
  }

  function collectAccessibleDocuments(rootDocument = document) {
    const documents = [rootDocument];
    rootDocument.querySelectorAll("iframe").forEach((iframe) => {
      try {
        if (iframe.contentDocument) documents.push(...collectAccessibleDocuments(iframe.contentDocument));
      } catch {
        // Diagnostics will show inaccessible frames; no cross-origin frames are intentionally used.
      }
    });
    return documents;
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function runRepeatedActions() {
    const iterations = Math.max(1, Math.min(100, Number(elements.repeatCount.value) || 1));
    const delayMs = Math.max(0, Math.min(10000, Number(elements.repeatDelay.value) || 0));
    const documents = collectAccessibleDocuments();

    elements.runRepeatedActions.disabled = true;
    elements.fixtureState.textContent = "Running repeated actions";
    elements.fixtureState.className = "status status-running";

    for (let iteration = 1; iteration <= iterations; iteration += 1) {
      documents.forEach((frameDocument) => {
        const frameId = frameDocument.querySelector("[data-frame-id]")?.dataset.frameId;
        if (!frameId) return;
        const textInput = frameDocument.querySelector(`[data-testid="${frameId}-text-input"]`);
        const checkbox = frameDocument.querySelector(`[data-testid="${frameId}-checkbox"]`);
        const button = frameDocument.querySelector(`[data-testid="${frameId}-action-button"]`);

        if (textInput) {
          textInput.value = `${runId}-iteration-${iteration}`;
          textInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change", { bubbles: true }));
        }
        button?.click();
      });
      if (delayMs && iteration < iterations) await delay(delayMs);
    }

    elements.runRepeatedActions.disabled = false;
    elements.fixtureState.textContent = "Created";
    elements.fixtureState.className = "status status-ready";
  }

  window.addEventListener("message", (event) => {
    const message = event.data;
    if (!message || message.source !== MESSAGE_SOURCE || typeof message.payload !== "object") return;
    if (message.payload.runId !== runId) return;

    if (message.type === "frame-diagnostic") {
      frameDiagnostics.set(message.payload.frameId, message.payload);
      renderFrameInventory();
    }
    if (message.type === "fixture-action") appendAction(message.payload);
  });

  document.addEventListener("click", recordTopAction);
  document.addEventListener("input", recordTopAction);
  document.addEventListener("change", recordTopAction);
  elements.createFixtures.addEventListener("click", createFixtures);
  elements.clearLog.addEventListener("click", () => {
    actionLog = [];
    renderActionLog();
  });
  elements.runRepeatedActions.addEventListener("click", runRepeatedActions);
  elements.trafficAgentStatus.addEventListener("change", () => updateEnvironment(document.querySelector("#environment-created-at").textContent));

  updateEnvironment();
})();
