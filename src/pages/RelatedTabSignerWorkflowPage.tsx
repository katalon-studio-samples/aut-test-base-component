import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SignerId = "1" | "2" | "3";
type TabMode =
  | "same-domain"
  | "cross-domain-allowlisted"
  | "cross-domain-non-allowlisted";

interface SignerState {
  id: SignerId;
  name: string;
  signed: boolean;
  signedAt?: string;
  mode?: TabMode;
}

interface WorkflowEvent {
  id: string;
  type: "tab-opened" | "signer-signed" | "returned-main" | "workflow-continued";
  message: string;
  timestamp: string;
  signerId?: SignerId;
  mode?: TabMode;
}

type ChannelMessage =
  | { type: "state-sync"; state: Record<SignerId, SignerState> }
  | { type: "event"; event: WorkflowEvent }
  | { type: "request-sync" };

interface SignerMessage {
  source: "related-tab-signer-workflow";
  type: "signer-signed" | "returned-main";
  signerId: SignerId;
  fullName?: string;
  mode: TabMode;
  timestamp: string;
}

const SIGNER_IDS: SignerId[] = ["1", "2", "3"];
const STORAGE_STATE_KEY = "relatedTabSignerWorkflow.state";
const STORAGE_EVENTS_KEY = "relatedTabSignerWorkflow.events";
const STORAGE_SIGNAL_KEY = "relatedTabSignerWorkflow.signal";
const STORAGE_ALLOWLISTED_URL_KEY =
  "relatedTabSignerWorkflow.crossDomainAllowlistedUrl";
const STORAGE_NON_ALLOWLISTED_URL_KEY =
  "relatedTabSignerWorkflow.crossDomainNonAllowlistedUrl";
const CHANNEL_NAME = "related-tab-signer-workflow";
const MAIN_WINDOW_NAME = "related-tab-workflow-main";
const DEFAULT_ALLOWLISTED_URL = "";
const DEFAULT_NON_ALLOWLISTED_URL = "";
const PLACEHOLDER_CROSS_DOMAIN_URLS = [
  "signer-test.example.com",
  "non-allowlisted-signer.example.net",
];
const MODE_LABELS: Record<TabMode, string> = {
  "same-domain": "same-domain",
  "cross-domain-allowlisted": "cross-domain allowlisted",
  "cross-domain-non-allowlisted": "cross-domain non-allowlisted",
};

const createInitialState = (): Record<SignerId, SignerState> =>
  SIGNER_IDS.reduce(
    (state, id) => ({
      ...state,
      [id]: {
        id,
        name: "",
        signed: false,
      },
    }),
    {} as Record<SignerId, SignerState>,
  );

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readUrlTemplate = (key: string, fallback: string) => {
  const value = readJson(key, fallback);
  if (
    PLACEHOLDER_CROSS_DOMAIN_URLS.some((placeholder) =>
      value.includes(placeholder),
    )
  ) {
    return fallback;
  }
  return value;
};

const getTimestamp = () => new Date().toISOString();

const createEvent = (
  type: WorkflowEvent["type"],
  message: string,
  signerId?: SignerId,
  mode?: TabMode,
): WorkflowEvent => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  type,
  message,
  signerId,
  mode,
  timestamp: getTimestamp(),
});

const saveState = (state: Record<SignerId, SignerState>) => {
  window.localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
};

const saveEvents = (events: WorkflowEvent[]) => {
  window.localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
};

const formatTime = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const statusClassName = (signed: boolean) =>
  signed
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
    : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";

const getMainWorkflowUrl = () => {
  const mainUrl = new URL(window.location.href);
  mainUrl.searchParams.delete("signer");
  mainUrl.searchParams.delete("workflowOpen");
  mainUrl.searchParams.delete("openEventId");
  mainUrl.searchParams.delete("mode");
  mainUrl.searchParams.delete("mainUrl");
  return mainUrl;
};

const getRightClickDestinationUrl = () => {
  const destinationUrl = new URL(
    "/tab-workflow-test/right-click-destination",
    window.location.origin,
  );
  getMainWorkflowUrl().searchParams.forEach((value, key) => {
    destinationUrl.searchParams.set(key, value);
  });
  destinationUrl.searchParams.set("source", "right-click-link");
  return destinationUrl;
};

const isSignerMessage = (value: unknown): value is SignerMessage => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<SignerMessage>;
  return (
    message.source === "related-tab-signer-workflow" &&
    (message.type === "signer-signed" || message.type === "returned-main") &&
    SIGNER_IDS.includes(message.signerId as SignerId) &&
    !!message.mode
  );
};

const buildTemplatePreviewUrl = (template: string, signerId: SignerId) => {
  const trimmed = template.trim();
  if (!trimmed) {
    return null;
  }

  return new URL(
    trimmed.includes("{signer}")
      ? trimmed.replaceAll("{signer}", signerId)
      : trimmed,
  );
};

export const RelatedTabSignerWorkflowPage: React.FC = () => {
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );
  const signerParam = searchParams.get("signer");
  const signerId = SIGNER_IDS.includes(signerParam as SignerId)
    ? (signerParam as SignerId)
    : undefined;
  const tabRole = signerId ? "signer" : "main";
  const openerExists =
    typeof window !== "undefined" && window.opener && !window.opener.closed;
  const openedByWorkflowButton =
    searchParams.get("workflowOpen") === "1" && !!openerExists;
  const [signers, setSigners] = useState<Record<SignerId, SignerState>>(() =>
    readJson(STORAGE_STATE_KEY, createInitialState()),
  );
  const [events, setEvents] = useState<WorkflowEvent[]>(() =>
    readJson(STORAGE_EVENTS_KEY, []),
  );
  const [debugEvents, setDebugEvents] = useState<WorkflowEvent[]>([]);
  const [fullName, setFullName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [allowlistedUrl, setAllowlistedUrl] = useState(() =>
    readUrlTemplate(STORAGE_ALLOWLISTED_URL_KEY, DEFAULT_ALLOWLISTED_URL),
  );
  const [nonAllowlistedUrl, setNonAllowlistedUrl] = useState(() =>
    readUrlTemplate(
      STORAGE_NON_ALLOWLISTED_URL_KEY,
      DEFAULT_NON_ALLOWLISTED_URL,
    ),
  );
  const channelRef = useRef<BroadcastChannel | null>(null);
  const signersRef = useRef(signers);

  useEffect(() => {
    signersRef.current = signers;
  }, [signers]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_ALLOWLISTED_URL_KEY,
      JSON.stringify(allowlistedUrl),
    );
  }, [allowlistedUrl]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_NON_ALLOWLISTED_URL_KEY,
      JSON.stringify(nonAllowlistedUrl),
    );
  }, [nonAllowlistedUrl]);

  const publish = useCallback((message: ChannelMessage) => {
    channelRef.current?.postMessage(message);
    window.localStorage.setItem(
      STORAGE_SIGNAL_KEY,
      JSON.stringify({ ...message, signalAt: getTimestamp() }),
    );
  }, []);

  const appendDebugEvent = useCallback((message: string, id?: SignerId) => {
    setDebugEvents((current) =>
      [createEvent("tab-opened", message, id), ...current].slice(0, 20),
    );
  }, []);

  const appendWorkflowEvent = useCallback(
    (event: WorkflowEvent) => {
      setEvents((current) => {
        if (current.some((item) => item.id === event.id)) {
          return current;
        }
        const next = [event, ...current].slice(0, 50);
        saveEvents(next);
        return next;
      });
      publish({ type: "event", event });
    },
    [publish],
  );

  const updateSignerState = useCallback(
    (nextState: Record<SignerId, SignerState>) => {
      signersRef.current = nextState;
      setSigners(nextState);
      saveState(nextState);
      publish({ type: "state-sync", state: nextState });
    },
    [publish],
  );

  const markSignerSigned = useCallback(
    (
      id: SignerId,
      fullNameValue: string,
      mode?: TabMode,
      timestamp = getTimestamp(),
    ) => {
      const nextState = {
        ...signersRef.current,
        [id]: {
          id,
          name: fullNameValue,
          signed: true,
          signedAt: timestamp,
          mode,
        },
      };
      updateSignerState(nextState);
      appendWorkflowEvent(
        createEvent(
          "signer-signed",
          `Signer ${id} signed as ${fullNameValue}${
            mode ? ` using ${MODE_LABELS[mode]}` : ""
          }`,
          id,
          mode,
        ),
      );
    },
    [appendWorkflowEvent, updateSignerState],
  );

  useEffect(() => {
    if (tabRole === "main") {
      window.name = MAIN_WINDOW_NAME;
    }

    if ("BroadcastChannel" in window) {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current.onmessage = ({
        data,
      }: MessageEvent<ChannelMessage>) => {
        if (data.type === "state-sync") {
          setSigners(data.state);
          saveState(data.state);
          appendDebugEvent("Received signer state update");
        }
        if (data.type === "event") {
          setEvents((current) => {
            if (current.some((item) => item.id === data.event.id)) {
              return current;
            }
            const next = [data.event, ...current].slice(0, 50);
            saveEvents(next);
            return next;
          });
          appendDebugEvent(data.event.message, data.event.signerId);
        }
        if (data.type === "request-sync") {
          publish({ type: "state-sync", state: signersRef.current });
        }
      };
    }

    publish({ type: "request-sync" });
    appendDebugEvent(`${tabRole} tab loaded`, signerId);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_STATE_KEY) {
        setSigners(readJson(STORAGE_STATE_KEY, createInitialState()));
        appendDebugEvent("Received localStorage signer state update");
      }
      if (event.key === STORAGE_EVENTS_KEY) {
        setEvents(readJson(STORAGE_EVENTS_KEY, []));
        appendDebugEvent("Received localStorage workflow event update");
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (!isSignerMessage(event.data)) {
        return;
      }

      const { signerId: messageSignerId, mode, timestamp, type } = event.data;
      if (type === "signer-signed" && event.data.fullName) {
        markSignerSigned(messageSignerId, event.data.fullName, mode, timestamp);
        appendDebugEvent(
          `Received ${MODE_LABELS[mode]} signer signed message`,
          messageSignerId,
        );
      }
      if (type === "returned-main") {
        appendWorkflowEvent(
          createEvent(
            "returned-main",
            `User returned to main tab from Signer ${messageSignerId} using ${MODE_LABELS[mode]}`,
            messageSignerId,
            mode,
          ),
        );
      }
    };

    const handleFocus = () =>
      appendDebugEvent(`${tabRole} tab focused`, signerId);
    const handleBlur = () =>
      appendDebugEvent(`${tabRole} tab blurred`, signerId);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("message", handleMessage);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      channelRef.current?.close();
    };
  }, [
    appendDebugEvent,
    appendWorkflowEvent,
    markSignerSigned,
    publish,
    signerId,
    tabRole,
  ]);

  const allSigned = SIGNER_IDS.every((id) => signers[id].signed);

  const getCrossDomainStatus = (template: string) => {
    if (!template.trim()) {
      return {
        canOpen: false,
        message: "Enter a reachable signer.html URL on a different domain.",
      };
    }

    try {
      const previewUrl = buildTemplatePreviewUrl(template, "1");
      if (!previewUrl) {
        return {
          canOpen: false,
          message: "Enter a reachable signer.html URL on a different domain.",
        };
      }

      if (previewUrl.origin === window.location.origin) {
        return {
          canOpen: false,
          message: "This URL is same-domain. Use a different domain/origin.",
        };
      }

      return {
        canOpen: true,
        message: `Preview: ${previewUrl.toString()}`,
      };
    } catch {
      return {
        canOpen: false,
        message:
          "Enter an absolute URL such as https://domain/signer.html?signer={signer}.",
      };
    }
  };

  const allowlistedStatus = getCrossDomainStatus(allowlistedUrl);
  const nonAllowlistedStatus = getCrossDomainStatus(nonAllowlistedUrl);

  const buildSameDomainSignerUrl = (id: SignerId) => {
    const targetUrl = new URL(
      "/tab-workflow-test/signer.html",
      window.location.origin,
    );
    getMainWorkflowUrl().searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });
    targetUrl.searchParams.set("signer", id);
    targetUrl.searchParams.set("mode", "same-domain");
    targetUrl.searchParams.set("workflowOpen", "1");
    targetUrl.searchParams.set("openEventId", `${Date.now()}-${id}`);
    targetUrl.searchParams.set("mainUrl", getMainWorkflowUrl().toString());
    return targetUrl;
  };

  const buildCrossDomainSignerUrl = (
    id: SignerId,
    template: string,
    mode: TabMode,
  ) => {
    const targetUrl = buildTemplatePreviewUrl(template, id);
    if (!targetUrl) {
      throw new Error("Cross-domain signer URL is not configured");
    }
    if (targetUrl.origin === window.location.origin) {
      throw new Error("Cross-domain signer URL must use a different origin");
    }
    targetUrl.searchParams.set("signer", id);
    targetUrl.searchParams.set("mode", mode);
    targetUrl.searchParams.set("workflowOpen", "1");
    targetUrl.searchParams.set("openEventId", `${Date.now()}-${id}`);
    targetUrl.searchParams.set("mainUrl", getMainWorkflowUrl().toString());
    return targetUrl;
  };

  const openSignerTab = (id: SignerId, mode: TabMode) => {
    let targetUrl: URL;
    try {
      targetUrl =
        mode === "same-domain"
          ? buildSameDomainSignerUrl(id)
          : buildCrossDomainSignerUrl(
              id,
              mode === "cross-domain-allowlisted"
                ? allowlistedUrl
                : nonAllowlistedUrl,
              mode,
            );
    } catch {
      appendWorkflowEvent(
        createEvent(
          "tab-opened",
          `Invalid ${MODE_LABELS[mode]} signer URL for Signer ${id}`,
          id,
          mode,
        ),
      );
      return;
    }
    window.open(targetUrl.toString(), "_blank");
    appendWorkflowEvent(
      createEvent(
        "tab-opened",
        `Signer ${id} tab opened using ${MODE_LABELS[mode]}`,
        id,
        mode,
      ),
    );
  };

  const resetWorkflow = () => {
    const emptyState = createInitialState();
    saveState(emptyState);
    saveEvents([]);
    setSigners(emptyState);
    setEvents([]);
    setDebugEvents([]);
    publish({ type: "state-sync", state: emptyState });
  };

  const handleSign = () => {
    if (!signerId || !fullName.trim() || !agreed) {
      return;
    }
    markSignerSigned(signerId, fullName.trim());
  };

  const returnToMainTab = () => {
    if (signerId) {
      appendWorkflowEvent(
        createEvent(
          "returned-main",
          `User returned to main tab from Signer ${signerId}`,
          signerId,
        ),
      );
    }

    const mainWindow = window.open(
      getMainWorkflowUrl().toString(),
      MAIN_WINDOW_NAME,
    );
    mainWindow?.focus();
    window.opener?.focus();
  };

  const continueWorkflow = () => {
    appendWorkflowEvent(
      createEvent(
        "workflow-continued",
        "Workflow continued after all signers completed",
      ),
    );
  };

  const currentSigner = signerId ? signers[signerId] : undefined;
  const isRightClickDestination = window.location.pathname.includes(
    "/tab-workflow-test/right-click-destination",
  );

  if (isRightClickDestination) {
    return (
      <div
        className="mx-auto max-w-4xl space-y-6"
        data-testid="right-click-destination-page"
      >
        <header className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
            TrueTest Related Tabs
          </p>
          <h1
            className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100"
            data-testid="right-click-destination-heading"
          >
            Right Click Navigation Destination
          </h1>
          <p
            className="mt-3 text-gray-600 dark:text-gray-300"
            data-testid="right-click-destination-summary"
          >
            This page is the target for the right-click link navigation test.
          </p>
        </header>

        <section
          className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          data-testid="right-click-destination-details"
        >
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-semibold text-gray-700 dark:text-gray-200">
                Navigation source
              </dt>
              <dd
                className="mt-1 text-gray-600 dark:text-gray-300"
                data-testid="right-click-destination-source"
              >
                {searchParams.get("source") || "direct"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700 dark:text-gray-200">
                Current URL
              </dt>
              <dd
                className="mt-1 break-all font-mono text-xs text-gray-600 dark:text-gray-300"
                data-testid="right-click-destination-url"
              >
                {window.location.href}
              </dd>
            </div>
          </dl>
          <a
            id="return-to-tab-workflow"
            href={getMainWorkflowUrl().toString()}
            className="mt-6 inline-flex rounded-md border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            data-testid="return-to-tab-workflow"
          >
            Return to Tab Workflow Test
          </a>
        </section>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-6xl space-y-6"
      data-testid="related-tab-workflow-page"
      data-tab-role={tabRole}
    >
      <header className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
          TrueTest Related Tabs
        </p>
        <h1
          id="related-tab-workflow-heading"
          className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100"
          data-testid="related-tab-workflow-heading"
        >
          Related Tab Signer Workflow
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-300">
          Use this page to validate whether related signer tabs are recorded as
          one continuous session with preserved tab transitions.
        </p>
      </header>

      {tabRole === "main" ? (
        <section
          className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          aria-labelledby="main-workflow-title"
          data-testid="main-workflow-panel"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="main-workflow-title"
                className="text-xl font-semibold text-gray-900 dark:text-gray-100"
              >
                Main Workflow Page
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Open signer tabs from the workflow buttons, then return here to
                continue.
              </p>
            </div>
            <button
              id="reset-related-tab-workflow"
              type="button"
              onClick={resetWorkflow}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              data-testid="reset-related-tab-workflow"
            >
              Reset workflow
            </button>
          </div>

          <div
            className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
            data-testid="domain-coverage-config"
          >
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Domain Coverage Targets
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Same-domain tabs use /tab-workflow-test/signer.html. Configure
                the cross-domain signer pages with real reachable domains for
                allowlisted and non-allowlisted domain tests.
              </p>
            </div>
            <label
              htmlFor="cross-domain-allowlisted-url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Cross-domain allowlisted signer URL template
              <input
                id="cross-domain-allowlisted-url"
                type="url"
                value={allowlistedUrl}
                onChange={(event) => setAllowlistedUrl(event.target.value)}
                placeholder="https://your-allowlisted-domain.example/signer.html?signer={signer}"
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                data-testid="cross-domain-allowlisted-url"
              />
              <span
                className={`mt-1 block text-xs ${
                  allowlistedStatus.canOpen
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
                data-testid="cross-domain-allowlisted-status"
              >
                {allowlistedStatus.message}
              </span>
            </label>
            <label
              htmlFor="cross-domain-non-allowlisted-url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Cross-domain non-allowlisted signer URL template
              <input
                id="cross-domain-non-allowlisted-url"
                type="url"
                value={nonAllowlistedUrl}
                onChange={(event) => setNonAllowlistedUrl(event.target.value)}
                placeholder="https://your-non-allowlisted-domain.example/signer.html?signer={signer}"
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                data-testid="cross-domain-non-allowlisted-url"
              />
              <span
                className={`mt-1 block text-xs ${
                  nonAllowlistedStatus.canOpen
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
                data-testid="cross-domain-non-allowlisted-status"
              >
                {nonAllowlistedStatus.message}
              </span>
            </label>
          </div>

          <div
            className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            data-testid="right-click-navigation-panel"
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Right Click Navigation
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use this real link button to test right-click navigation to a
              different page.
            </p>
            <a
              id="right-click-navigation-link"
              href={getRightClickDestinationUrl().toString()}
              className="mt-4 inline-flex rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              data-testid="right-click-navigation-link"
            >
              Right-click navigation link
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            {SIGNER_IDS.map((id) => {
              const signer = signers[id];
              return (
                <div
                  key={id}
                  id={`signer-${id}-row`}
                  className="grid gap-4 border-b border-gray-200 p-4 last:border-b-0 dark:border-gray-700 xl:grid-cols-[1fr_auto_minmax(360px,auto)]"
                  data-testid={`signer-${id}-row`}
                >
                  <div>
                    <h3
                      className="font-semibold text-gray-900 dark:text-gray-100"
                      data-testid={`signer-${id}-label`}
                    >
                      Signer {id}
                    </h3>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                      data-testid={`signer-${id}-name-summary`}
                    >
                      {signer.name || "No signature recorded"}
                    </p>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                      data-testid={`signer-${id}-mode-summary`}
                    >
                      Mode: {signer.mode ? MODE_LABELS[signer.mode] : "none"}
                    </p>
                  </div>
                  <span
                    id={`signer-${id}-status`}
                    className={`inline-flex h-8 items-center justify-center rounded-full px-3 text-sm font-semibold ${statusClassName(signer.signed)}`}
                    data-testid={`signer-${id}-status`}
                  >
                    {signer.signed ? "Signed" : "Pending"}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                    <button
                      id={`open-signer-${id}-same-domain-tab`}
                      type="button"
                      onClick={() => openSignerTab(id, "same-domain")}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                      data-testid={`open-signer-${id}-same-domain-tab`}
                    >
                      Open same-domain signer tab
                    </button>
                    <button
                      id={`open-signer-${id}-cross-domain-allowlisted-tab`}
                      type="button"
                      onClick={() =>
                        openSignerTab(id, "cross-domain-allowlisted")
                      }
                      disabled={!allowlistedStatus.canOpen}
                      title={allowlistedStatus.message}
                      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                      data-testid={`open-signer-${id}-cross-domain-allowlisted-tab`}
                    >
                      Open cross-domain allowlisted signer tab
                    </button>
                    <button
                      id={`open-signer-${id}-cross-domain-non-allowlisted-tab`}
                      type="button"
                      onClick={() =>
                        openSignerTab(id, "cross-domain-non-allowlisted")
                      }
                      disabled={!nonAllowlistedStatus.canOpen}
                      title={nonAllowlistedStatus.message}
                      className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:bg-amber-500 dark:hover:bg-amber-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                      data-testid={`open-signer-${id}-cross-domain-non-allowlisted-tab`}
                    >
                      Open cross-domain non-allowlisted signer tab
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            id="continue-related-tab-workflow"
            type="button"
            onClick={continueWorkflow}
            disabled={!allSigned}
            className="mt-6 rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
            data-testid="continue-related-tab-workflow"
          >
            Continue workflow
          </button>
        </section>
      ) : (
        <section
          className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          aria-labelledby="signer-tab-title"
          data-testid={`signer-${signerId}-tab-panel`}
        >
          <h2
            id="signer-tab-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
            data-testid="signer-tab-title"
          >
            Signer {signerId}
          </h2>
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            data-testid={`signer-${signerId}-saved-status`}
          >
            Current status: {currentSigner?.signed ? "Signed" : "Pending"}
          </p>

          <div className="mt-6 max-w-xl space-y-5">
            <label
              htmlFor={`signer-${signerId}-full-name`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Signer full name
              <input
                id={`signer-${signerId}-full-name`}
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                data-testid={`signer-${signerId}-full-name`}
                autoComplete="name"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
              <input
                id={`signer-${signerId}-agree`}
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                data-testid={`signer-${signerId}-agree`}
              />
              I agree
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                id={`signer-${signerId}-sign`}
                type="button"
                onClick={handleSign}
                disabled={!fullName.trim() || !agreed}
                className="rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                data-testid={`signer-${signerId}-sign`}
              >
                Sign
              </button>
              <button
                id={`signer-${signerId}-return-main`}
                type="button"
                onClick={returnToMainTab}
                className="rounded-md border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                data-testid={`signer-${signerId}-return-main`}
              >
                Return to main tab
              </button>
            </div>
          </div>
        </section>
      )}

      {tabRole === "main" && (
        <section
          className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          aria-labelledby="main-action-log-title"
          data-testid="main-action-log"
        >
          <h2
            id="main-action-log-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Main Action Log
          </h2>
          <ol className="mt-4 space-y-2" data-testid="main-action-log-list">
            {events.length === 0 ? (
              <li className="text-sm text-gray-500 dark:text-gray-400">
                No workflow actions yet.
              </li>
            ) : (
              events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  data-testid={`action-log-${event.type}`}
                >
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(event.timestamp)}
                  </span>{" "}
                  {event.message}
                </li>
              ))
            )}
          </ol>
        </section>
      )}

      <section
        className="rounded-lg bg-slate-950 p-6 text-slate-100 shadow"
        aria-labelledby="debug-panel-title"
        data-testid="related-tab-debug-panel"
      >
        <h2 id="debug-panel-title" className="text-lg font-semibold">
          Debug Panel
        </h2>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-slate-400">Current tab role</dt>
            <dd id="debug-tab-role" data-testid="debug-tab-role">
              {tabRole}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Signer id</dt>
            <dd id="debug-signer-id" data-testid="debug-signer-id">
              {signerId || "none"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Opener exists</dt>
            <dd id="debug-opener-exists" data-testid="debug-opener-exists">
              {openerExists ? "yes" : "no"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Opened by workflow button</dt>
            <dd
              id="debug-opened-by-workflow"
              data-testid="debug-opened-by-workflow"
            >
              {openedByWorkflowButton ? "yes" : "no"}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-slate-400">Current URL</dt>
            <dd
              id="debug-current-url"
              className="break-all font-mono text-xs"
              data-testid="debug-current-url"
            >
              {window.location.href}
            </dd>
          </div>
        </dl>
        <ol
          className="mt-4 max-h-56 space-y-2 overflow-auto rounded-md bg-slate-900 p-3"
          data-testid="debug-event-log"
        >
          {debugEvents.length === 0 ? (
            <li className="text-sm text-slate-400">No debug events yet.</li>
          ) : (
            debugEvents.map((event) => (
              <li
                key={event.id}
                className="text-sm"
                data-testid="debug-event-log-entry"
              >
                <span className="font-mono text-xs text-slate-400">
                  {formatTime(event.timestamp)}
                </span>{" "}
                {event.message}
              </li>
            ))
          )}
        </ol>
      </section>
    </div>
  );
};
