import { useCallback, useEffect, useRef, useState } from "react";

type FixtureEvent = {
  eventId: string;
  timestamp: string;
  frameName: string;
  frameDepth: number;
  actionType: string;
  targetTag: string;
  targetId?: string;
  targetName?: string;
  targetText?: string;
  value?: string;
};

type FixtureMessage = {
  source: "traffic-agent-iframe-fixture";
  event: FixtureEvent;
};

const isFixtureMessage = (value: unknown): value is FixtureMessage => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { source?: unknown; event?: unknown };
  return (
    candidate.source === "traffic-agent-iframe-fixture" &&
    !!candidate.event &&
    typeof candidate.event === "object"
  );
};

const escapeHtmlAttribute = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const fixtureScript = ({
  frameName,
  frameDepth,
  alreadyLoaded = false,
}: {
  frameName: string;
  frameDepth: number;
  alreadyLoaded?: boolean;
}) => `
  ${alreadyLoaded ? "window.__trafficAgentIframeFixtureAlreadyLoaded = true;" : ""}
  let eventSequence = 0;
  const safeValue = (target) => {
    if (!target) return undefined;
    if (target.type === "file") {
      return target.files && target.files.length ? target.files.length + " file(s) selected" : "";
    }
    if (target.type === "password") return "[redacted]";
    if (target.type === "checkbox" || target.type === "radio") return String(target.checked);
    if ("value" in target) return String(target.value || "");
    return undefined;
  };
  const targetLabel = (target) => {
    const text = (target.innerText || target.textContent || "").trim().replace(/\\s+/g, " ");
    return text.slice(0, 80);
  };
  const emit = (actionType, target) => {
    const event = {
      eventId: "${frameName}-" + (++eventSequence),
      timestamp: new Date().toISOString(),
      frameName: "${frameName}",
      frameDepth: ${frameDepth},
      actionType,
      targetTag: target && target.tagName ? target.tagName.toLowerCase() : "document",
      targetId: target && target.id ? target.id : undefined,
      targetName: target && target.name ? target.name : undefined,
      targetText: targetLabel(target),
      value: safeValue(target)
    };
    window.top.postMessage({ source: "traffic-agent-iframe-fixture", event }, "*");
  };
  document.addEventListener("click", (event) => emit("click", event.target), true);
  document.addEventListener("input", (event) => emit("input", event.target), true);
  document.addEventListener("change", (event) => emit("change", event.target), true);
  document.addEventListener("submit", (event) => {
    event.preventDefault();
    emit("submit", event.target);
  }, true);
  emit("loaded", document.body);
`;

const coreControlsHtml = ({
  prefix,
  title,
  includeTextarea = true,
  includeCheckboxRadio = true,
  includeLink = true,
  includeSubmit = true,
}: {
  prefix: string;
  title: string;
  includeTextarea?: boolean;
  includeCheckboxRadio?: boolean;
  includeLink?: boolean;
  includeSubmit?: boolean;
}) => `
  <form id="${prefix}-form" name="${prefix}-form-name" data-testid="${prefix}-form">
    <h2>${title}</h2>
    <div class="field">
      <button id="${prefix}-button" name="${prefix}-button-name" type="button" data-testid="${prefix}-button">
        ${title} Button
      </button>
    </div>
    ${
      includeLink
        ? `<div class="field">
            <a id="${prefix}-link" name="${prefix}-link-name" href="#${prefix}-link-target" data-testid="${prefix}-link">
              ${title} Link
            </a>
          </div>`
        : ""
    }
    <div class="field">
      <label for="${prefix}-input">Text input</label>
      <input id="${prefix}-input" name="${prefix}-input-name" data-testid="${prefix}-input" type="text" />
    </div>
    ${
      includeTextarea
        ? `<div class="field">
            <label for="${prefix}-textarea">Textarea</label>
            <textarea id="${prefix}-textarea" name="${prefix}-textarea-name" data-testid="${prefix}-textarea"></textarea>
          </div>`
        : ""
    }
    ${
      includeCheckboxRadio
        ? `<fieldset class="field">
            <legend>Binary options</legend>
            <label for="${prefix}-checkbox">
              <input id="${prefix}-checkbox" name="${prefix}-checkbox-name" data-testid="${prefix}-checkbox" type="checkbox" />
              Checkbox
            </label>
            <label for="${prefix}-radio-alpha">
              <input id="${prefix}-radio-alpha" name="${prefix}-radio-group" data-testid="${prefix}-radio-alpha" type="radio" value="alpha" />
              Radio Alpha
            </label>
            <label for="${prefix}-radio-beta">
              <input id="${prefix}-radio-beta" name="${prefix}-radio-group" data-testid="${prefix}-radio-beta" type="radio" value="beta" />
              Radio Beta
            </label>
          </fieldset>`
        : ""
    }
    <div class="field">
      <label for="${prefix}-select">Select</label>
      <select id="${prefix}-select" name="${prefix}-select-name" data-testid="${prefix}-select">
        <option value="">Choose one</option>
        <option value="${prefix}-one">Option One</option>
        <option value="${prefix}-two">Option Two</option>
      </select>
    </div>
    <div class="field">
      <label for="${prefix}-file">File input</label>
      <input id="${prefix}-file" name="${prefix}-file-name" data-testid="${prefix}-file" type="file" />
    </div>
    ${
      includeSubmit
        ? `<div class="field">
            <button id="${prefix}-submit" name="${prefix}-submit-name" type="submit" data-testid="${prefix}-submit">
              Submit ${title}
            </button>
          </div>`
        : ""
    }
  </form>
`;

const baseFrameDocument = ({
  frameName,
  frameDepth,
  body,
  alreadyLoaded,
}: {
  frameName: string;
  frameDepth: number;
  body: string;
  alreadyLoaded?: boolean;
}) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      body { color: #111827; font-family: Arial, sans-serif; margin: 0; padding: 16px; background: #fff; }
      h2 { font-size: 18px; margin: 0 0 12px; }
      .field { margin-bottom: 12px; }
      label, legend { display: block; font-weight: 600; margin-bottom: 4px; }
      input, select, textarea, button { font: inherit; }
      input[type="text"], select, textarea { border: 1px solid #9ca3af; border-radius: 4px; padding: 6px 8px; width: min(420px, 100%); }
      button { background: #1d4ed8; border: 0; border-radius: 4px; color: #fff; cursor: pointer; padding: 7px 10px; }
      fieldset { border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; }
      a { color: #1d4ed8; }
      .note { color: #4b5563; font-size: 13px; margin: 0 0 12px; }
    </style>
  </head>
  <body>
    ${body}
    <script>${fixtureScript({ frameName, frameDepth, alreadyLoaded })}</script>
  </body>
</html>`;

const buildCoreFrameDocument = ({
  prefix,
  title,
  frameName,
  frameDepth,
  alreadyLoaded = false,
  versionLabel,
}: {
  prefix: string;
  title: string;
  frameName: string;
  frameDepth: number;
  alreadyLoaded?: boolean;
  versionLabel?: string;
}) =>
  baseFrameDocument({
    frameName,
    frameDepth,
    alreadyLoaded,
    body: `
      ${versionLabel ? `<p id="${prefix}-version" class="note" data-testid="${prefix}-version">${versionLabel}</p>` : ""}
      ${
        alreadyLoaded
          ? `<p id="${prefix}-marker" class="note" data-testid="${prefix}-marker">
              Marker: window.__trafficAgentIframeFixtureAlreadyLoaded = true
            </p>`
          : ""
      }
      ${coreControlsHtml({ prefix, title })}
    `,
  });

const buildNestedFrameDocument = () => {
  const childDocument = baseFrameDocument({
    frameName: "nested-child-frame",
    frameDepth: 2,
    body: coreControlsHtml({
      prefix: "nested-child",
      title: "Nested Child",
      includeTextarea: false,
      includeCheckboxRadio: false,
      includeLink: false,
      includeSubmit: false,
    }),
  });

  return baseFrameDocument({
    frameName: "nested-parent-frame",
    frameDepth: 1,
    body: `
      <h2>Nested Same-Origin Iframe</h2>
      <p class="note">The child frame below reports events with depth 2.</p>
      <iframe
        id="nested-child-frame"
        name="nested-child-frame"
        title="Nested child iframe"
        data-testid="nested-child-frame"
        srcdoc="${escapeHtmlAttribute(childDocument)}"
        style="width: 100%; height: 360px; border: 1px solid #9ca3af;"
      ></iframe>
    `,
  });
};

const buildModalFlowDocument = () => {
  const modalDocument = baseFrameDocument({
    frameName: "iFrameModal",
    frameDepth: 2,
    body: `
      <h2>Attachments Modal</h2>
      <div class="field">
        <label for="beneficiary-option">Beneficiary option</label>
        <select id="beneficiary-option" name="beneficiaryOption" data-testid="beneficiary-option">
          <option value="">Select beneficiary option</option>
          <option value="1445-beneficiary-insurance-option">1445 Beneficiary Insurance Option</option>
        </select>
      </div>
      <div class="field">
        <label for="modal-upload-file">Upload File</label>
        <input id="modal-upload-file" name="modalUploadFile" data-testid="modal-upload-file" type="file" />
      </div>
      <div class="field">
        <button id="modal-upload-button" name="modalUploadButton" type="button" data-testid="modal-upload-button">
          Upload File
        </button>
      </div>
      <div class="field">
        <button id="modal-preview-uploaded-file" name="previewUploadedFile" type="button" data-testid="modal-preview-uploaded-file">
          Preview Uploaded File
        </button>
      </div>
    `,
  });

  return baseFrameDocument({
    frameName: "CossScreenFrame",
    frameDepth: 1,
    body: `
      <h2>Application Frame</h2>
      <p class="note">Application iframe id/name: CossScreenFrame. Modal iframe id/name: iFrameModal.</p>
      <iframe
        id="iFrameModal"
        name="iFrameModal"
        title="iPipeline-like attachments modal iframe"
        data-testid="iframe-modal"
        srcdoc="${escapeHtmlAttribute(modalDocument)}"
        style="width: 100%; height: 420px; border: 1px solid #9ca3af;"
      ></iframe>
    `,
  });
};

const initialIframeDocument = buildCoreFrameDocument({
  prefix: "existing-iframe",
  title: "Existing Iframe",
  frameName: "existing-same-origin-frame",
  frameDepth: 1,
  versionLabel: "Iframe version 1",
});

const reloadedIframeDocument = buildCoreFrameDocument({
  prefix: "existing-iframe-v2",
  title: "Existing Iframe Reloaded",
  frameName: "existing-same-origin-frame-v2",
  frameDepth: 1,
  versionLabel: "Iframe version 2",
});

const alreadyLoadedIframeDocument = buildCoreFrameDocument({
  prefix: "already-loaded-iframe",
  title: "Already Instrumented Iframe",
  frameName: "already-loaded-frame",
  frameDepth: 1,
  alreadyLoaded: true,
  versionLabel: "Already-instrumented iframe",
});

const dynamicFrameDocument = (index: number) =>
  buildCoreFrameDocument({
    prefix: `dynamic-iframe-${index}`,
    title: `Dynamic Iframe ${index}`,
    frameName: `dynamic-same-origin-frame-${index}`,
    frameDepth: 1,
    versionLabel: `Dynamic iframe ${index}`,
  });

const nestedIframeDocument = buildNestedFrameDocument();
const modalFlowDocument = buildModalFlowDocument();

const targetText = (target: HTMLElement) =>
  (target.innerText || target.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);

const getSafeValue = (target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
  if (target instanceof HTMLInputElement && target.type === "file") {
    return target.files?.length ? `${target.files.length} file(s) selected` : "";
  }

  if (target instanceof HTMLInputElement && target.type === "password") {
    return "[redacted]";
  }

  if (target instanceof HTMLInputElement && ["checkbox", "radio"].includes(target.type)) {
    return String(target.checked);
  }

  return target.value;
};

export const TrafficAgentIframeFixturePage = () => {
  const [debugEvents, setDebugEvents] = useState<FixtureEvent[]>([]);
  const [dynamicFrameIds, setDynamicFrameIds] = useState<number[]>([]);
  const [nextDynamicFrameId, setNextDynamicFrameId] = useState(1);
  const [iframeVersion, setIframeVersion] = useState(1);
  const [existingIframeLoaded, setExistingIframeLoaded] = useState(false);
  const [nestedIframeLoaded, setNestedIframeLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [crossOriginPresent, setCrossOriginPresent] = useState(true);
  const eventSequence = useRef(0);

  const appendEvent = useCallback((event: FixtureEvent) => {
    setDebugEvents((currentEvents) => [event, ...currentEvents].slice(0, 250));
  }, []);

  const logParentEvent = useCallback(
    (
      actionType: string,
      target: HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    ) => {
      appendEvent({
        eventId: `parent-${++eventSequence.current}`,
        timestamp: new Date().toISOString(),
        frameName: "parent-page",
        frameDepth: 0,
        actionType,
        targetTag: target.tagName.toLowerCase(),
        targetId: target.id || undefined,
        targetName: target.name || undefined,
        targetText: targetText(target),
        value:
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
            ? getSafeValue(target)
            : undefined,
      });
    },
    [appendEvent],
  );

  const handleMessage = useCallback(
    (message: MessageEvent<unknown>) => {
      if (isFixtureMessage(message.data)) {
        appendEvent(message.data.event);
      }
    },
    [appendEvent],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const existingIframeSrcDoc = iframeVersion === 1 ? initialIframeDocument : reloadedIframeDocument;

  const addDynamicIframe = (button: HTMLButtonElement) => {
    logParentEvent("click", button);
    setDynamicFrameIds((current) => [...current, nextDynamicFrameId]);
    setNextDynamicFrameId((current) => current + 1);
  };

  const removeDynamicIframe = (id: number, button: HTMLButtonElement) => {
    logParentEvent("click", button);
    setDynamicFrameIds((current) => current.filter((frameId) => frameId !== id));
  };

  const reloadExistingIframe = (button: HTMLButtonElement) => {
    logParentEvent("click", button);
    setExistingIframeLoaded(false);
    setIframeVersion((current) => (current === 1 ? 2 : 1));
  };

  const exportDebugLog = (button: HTMLButtonElement) => {
    logParentEvent("click", button);
    const blob = new Blob([JSON.stringify(debugEvents, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "traffic-agent-iframe-fixture-debug-log.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const showFixtureState = (button: HTMLButtonElement) => {
    logParentEvent("click", button);
    appendEvent({
      eventId: `parent-${++eventSequence.current}`,
      timestamp: new Date().toISOString(),
      frameName: "parent-page",
      frameDepth: 0,
      actionType: "fixture-state",
      targetTag: "button",
      targetId: button.id,
      targetName: button.name,
      targetText: targetText(button),
      value: JSON.stringify({
        existingIframeLoaded,
        dynamicIframeCount: dynamicFrameIds.length,
        iframeVersion,
        nestedIframeLoaded,
        modalOpen,
        crossOriginPresent,
      }),
    });
  };

  const handleCrossOriginLoad = () => {
    try {
      const frame = document.getElementById("cross-origin-fixture-frame") as HTMLIFrameElement | null;
      const title = frame?.contentWindow?.document.title;
      appendEvent({
        eventId: `parent-${++eventSequence.current}`,
        timestamp: new Date().toISOString(),
        frameName: "cross-origin-frame",
        frameDepth: 1,
        actionType: "unexpected-cross-origin-access",
        targetTag: "iframe",
        targetId: "cross-origin-fixture-frame",
        targetName: "cross-origin-fixture-frame",
        value: title || "DOM readable",
      });
    } catch (error) {
      appendEvent({
        eventId: `parent-${++eventSequence.current}`,
        timestamp: new Date().toISOString(),
        frameName: "cross-origin-frame",
        frameDepth: 1,
        actionType: "cross-origin-access-skipped",
        targetTag: "iframe",
        targetId: "cross-origin-fixture-frame",
        targetName: "cross-origin-fixture-frame",
        value: error instanceof Error ? error.name : "Access denied",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-gray-900 dark:text-gray-100">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Traffic Agent Iframe Fixture</h1>
        <p className="max-w-4xl text-sm text-gray-600 dark:text-gray-300">
          Deterministic fixture for validating Traffic Agent browser event capture across parent,
          same-origin iframe, dynamic iframe, reloaded iframe, nested iframe, already-instrumented
          iframe, cross-origin iframe, and iPipeline-like modal iframe contexts.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Parent Controls</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <button
                  id="parent-button"
                  name="parentButton"
                  type="button"
                  data-testid="parent-button"
                  className="rounded bg-blue-700 px-3 py-2 text-white"
                  onClick={(event) => logParentEvent("click", event.currentTarget)}
                >
                  Parent button
                </button>
              </div>
              <div>
                <label htmlFor="parent-text-input" className="mb-1 block text-sm font-medium">
                  Parent text input
                </label>
                <input
                  id="parent-text-input"
                  name="parentTextInput"
                  data-testid="parent-text-input"
                  className="w-full rounded border border-gray-300 px-2 py-2 text-gray-900"
                  onInput={(event) => logParentEvent("input", event.currentTarget)}
                />
              </div>
              <div>
                <label htmlFor="parent-select" className="mb-1 block text-sm font-medium">
                  Parent select
                </label>
                <select
                  id="parent-select"
                  name="parentSelect"
                  data-testid="parent-select"
                  className="w-full rounded border border-gray-300 px-2 py-2 text-gray-900"
                  onChange={(event) => logParentEvent("change", event.currentTarget)}
                >
                  <option value="">Choose parent option</option>
                  <option value="parent-alpha">Parent Alpha</option>
                  <option value="parent-beta">Parent Beta</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Fixture Actions</h2>
            <div className="flex flex-wrap gap-2">
              <button
                id="add-dynamic-iframe"
                name="addDynamicIframe"
                type="button"
                data-testid="add-dynamic-iframe"
                className="rounded bg-blue-700 px-3 py-2 text-white"
                onClick={(event) => addDynamicIframe(event.currentTarget)}
              >
                Add dynamic iframe
              </button>
              <button
                id="reload-existing-iframe"
                name="reloadExistingIframe"
                type="button"
                data-testid="reload-existing-iframe"
                className="rounded bg-blue-700 px-3 py-2 text-white"
                onClick={(event) => reloadExistingIframe(event.currentTarget)}
              >
                Reload iframe
              </button>
              <button
                id="open-attachments-modal"
                name="openAttachmentsModal"
                type="button"
                data-testid="open-attachments-modal"
                className="rounded bg-blue-700 px-3 py-2 text-white"
                onClick={(event) => {
                  logParentEvent("click", event.currentTarget);
                  setModalOpen(true);
                }}
              >
                Open attachments modal
              </button>
              {modalOpen && (
                <button
                  id="close-attachments-modal"
                  name="closeAttachmentsModal"
                  type="button"
                  data-testid="close-attachments-modal"
                  className="rounded bg-gray-700 px-3 py-2 text-white"
                  onClick={(event) => {
                    logParentEvent("click", event.currentTarget);
                    setModalOpen(false);
                  }}
                >
                  Close attachments modal
                </button>
              )}
            </div>
          </section>

          <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Existing Same-Origin Iframe</h2>
            <iframe
              id="existing-same-origin-frame"
              name="existing-same-origin-frame"
              title="Existing same-origin iframe"
              data-testid="existing-same-origin-frame"
              srcDoc={existingIframeSrcDoc}
              className="h-[620px] w-full border border-gray-300 bg-white"
              onLoad={() => setExistingIframeLoaded(true)}
            />
          </section>

          <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Dynamic Same-Origin Iframes</h2>
            {dynamicFrameIds.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">No dynamic iframes added.</p>
            )}
            <div className="space-y-4">
              {dynamicFrameIds.map((id) => (
                <div key={id} className="space-y-2">
                  <button
                    id={`remove-dynamic-iframe-${id}`}
                    name={`removeDynamicIframe${id}`}
                    type="button"
                    data-testid={`remove-dynamic-iframe-${id}`}
                    className="rounded bg-gray-700 px-3 py-2 text-white"
                    onClick={(event) => removeDynamicIframe(id, event.currentTarget)}
                  >
                    Remove dynamic iframe {id}
                  </button>
                  <iframe
                    id={`dynamic-same-origin-frame-${id}`}
                    name={`dynamic-same-origin-frame-${id}`}
                    title={`Dynamic same-origin iframe ${id}`}
                    data-testid={`dynamic-same-origin-frame-${id}`}
                    srcDoc={dynamicFrameDocument(id)}
                    className="h-[520px] w-full border border-gray-300 bg-white"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Already-Instrumented Same-Origin Iframe</h2>
            <iframe
              id="already-loaded-iframe-frame"
              name="already-loaded-iframe-frame"
              title="Already-instrumented same-origin iframe"
              data-testid="already-loaded-iframe-frame"
              srcDoc={alreadyLoadedIframeDocument}
              className="h-[620px] w-full border border-gray-300 bg-white"
            />
          </section>

          <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Nested Same-Origin Iframe</h2>
            <iframe
              id="nested-parent-frame"
              name="nested-parent-frame"
              title="Nested parent same-origin iframe"
              data-testid="nested-parent-frame"
              srcDoc={nestedIframeDocument}
              className="h-[520px] w-full border border-gray-300 bg-white"
              onLoad={() => setNestedIframeLoaded(true)}
            />
          </section>

          <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Cross-Origin Iframe</h2>
              <button
                id="toggle-cross-origin-frame"
                name="toggleCrossOriginFrame"
                type="button"
                data-testid="toggle-cross-origin-frame"
                className="rounded bg-gray-700 px-3 py-2 text-white"
                onClick={(event) => {
                  logParentEvent("click", event.currentTarget);
                  setCrossOriginPresent((current) => !current);
                }}
              >
                {crossOriginPresent ? "Remove cross-origin iframe" : "Restore cross-origin iframe"}
              </button>
            </div>
            {crossOriginPresent && (
              <iframe
                id="cross-origin-fixture-frame"
                name="cross-origin-fixture-frame"
                title="Cross-origin fixture iframe"
                data-testid="cross-origin-fixture-frame"
                src="https://example.com/"
                className="h-[260px] w-full border border-gray-300 bg-white"
                onLoad={handleCrossOriginLoad}
              />
            )}
          </section>

          {modalOpen && (
            <section
              id="attachments-modal-fixture"
              data-testid="attachments-modal-fixture"
              className="rounded border-2 border-blue-700 bg-white p-4 dark:bg-gray-800"
            >
              <h2 className="mb-3 text-lg font-semibold">iPipeline-like Attachments Flow</h2>
              <iframe
                id="CossScreenFrame"
                name="CossScreenFrame"
                title="Application iframe containing attachments modal"
                data-testid="coss-screen-frame"
                srcDoc={modalFlowDocument}
                className="h-[560px] w-full border border-gray-300 bg-white"
              />
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="sticky top-4 rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Debug Log</h2>
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                id="clear-debug-log"
                name="clearDebugLog"
                type="button"
                data-testid="clear-debug-log"
                className="rounded bg-gray-700 px-3 py-2 text-white"
                onClick={(event) => {
                  logParentEvent("click", event.currentTarget);
                  setDebugEvents([]);
                }}
              >
                Clear debug log
              </button>
              <button
                id="export-debug-log-json"
                name="exportDebugLogJson"
                type="button"
                data-testid="export-debug-log-json"
                className="rounded bg-gray-700 px-3 py-2 text-white"
                onClick={(event) => exportDebugLog(event.currentTarget)}
              >
                Export debug log JSON
              </button>
              <button
                id="show-fixture-state"
                name="showFixtureState"
                type="button"
                data-testid="show-fixture-state"
                className="rounded bg-gray-700 px-3 py-2 text-white"
                onClick={(event) => showFixtureState(event.currentTarget)}
              >
                Show fixture state
              </button>
            </div>

            <dl
              id="fixture-state"
              data-testid="fixture-state"
              className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm"
            >
              <dt>Existing iframe loaded</dt>
              <dd data-testid="state-existing-iframe-loaded">{String(existingIframeLoaded)}</dd>
              <dt>Dynamic iframe count</dt>
              <dd data-testid="state-dynamic-iframe-count">{dynamicFrameIds.length}</dd>
              <dt>Iframe version</dt>
              <dd data-testid="state-iframe-version">{iframeVersion}</dd>
              <dt>Nested iframe loaded</dt>
              <dd data-testid="state-nested-iframe-loaded">{String(nestedIframeLoaded)}</dd>
              <dt>Modal</dt>
              <dd data-testid="state-modal-open">{modalOpen ? "open" : "closed"}</dd>
              <dt>Cross-origin iframe</dt>
              <dd data-testid="state-cross-origin-present">
                {crossOriginPresent ? "present" : "removed"}
              </dd>
            </dl>

            <div
              id="debug-log-panel"
              data-testid="debug-log-panel"
              className="max-h-[70vh] space-y-2 overflow-auto rounded border border-gray-200 bg-gray-50 p-2 text-xs text-gray-900"
            >
              {debugEvents.length === 0 && <p>No debug events yet.</p>}
              {debugEvents.map((event) => (
                <article
                  key={`${event.eventId}-${event.timestamp}`}
                  data-testid="debug-log-entry"
                  className="rounded border border-gray-200 bg-white p-2"
                >
                  <div className="font-mono">{event.timestamp}</div>
                  <div>
                    <strong>{event.actionType}</strong> from {event.frameName} depth{" "}
                    {event.frameDepth}
                  </div>
                  <div>
                    target: {event.targetTag}
                    {event.targetId ? `#${event.targetId}` : ""}
                    {event.targetName ? ` name=${event.targetName}` : ""}
                  </div>
                  {event.targetText && <div>text: {event.targetText}</div>}
                  {event.value !== undefined && <div>value: {event.value}</div>}
                  <div>event id: {event.eventId}</div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
};
