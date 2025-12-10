import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, Clock, Zap, X } from "lucide-react";

interface ToastMessage {
  id: string;
  variant: "success" | "warning";
  message: string;
}

const TOAST_DURATION_MS = 4500;
const DELAY_BEFORE_SHOW_MS = 3000;
const AUTO_CLOSE_MS = 5000;

interface ShadowToastTriggerProps {
  onTrigger: () => void;
}

const ShadowToastTriggerButton: React.FC<ShadowToastTriggerProps> = ({
  onTrigger,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      :host {
        all: initial;
      }
      button {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 0.5rem;
        border: none;
        padding: 0.65rem 1.5rem;
        color: white;
        background: linear-gradient(135deg, #9333ea, #7c3aed);
        cursor: pointer;
        box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.3);
        transition: transform 150ms ease, box-shadow 150ms ease;
      }
      button:hover {
        transform: translateY(-1px);
        box-shadow: 0 15px 25px -5px rgba(147, 51, 234, 0.45);
      }
      button:focus-visible {
        outline: 3px solid rgba(147, 51, 234, 0.5);
        outline-offset: 2px;
      }
    `;
    const container = document.createElement("div");
    shadowRoot.append(styleElement, container);
    setPortalTarget(container);

    return () => {
      shadowRoot.innerHTML = "";
    };
  }, []);

  return (
    <div ref={hostRef} data-test="toast-shadow-host">
      {portalTarget &&
        createPortal(
          <button type="button" onClick={onTrigger} data-test="toast-trigger">
            Trigger Toast Notification
          </button>,
          portalTarget,
        )}
    </div>
  );
};

export const ToastNotificationScenarioPage: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [delayedState, setDelayedState] = useState<
    "idle" | "waiting" | "visible"
  >("idle");
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number | null>(
    null,
  );
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [autoCloseInput, setAutoCloseInput] = useState("");

  const timersRef = useRef<{
    waitingTimeout: ReturnType<typeof setTimeout> | null;
    autoCloseTimeout: ReturnType<typeof setTimeout> | null;
    countdownInterval: ReturnType<typeof setInterval> | null;
  }>({
    waitingTimeout: null,
    autoCloseTimeout: null,
    countdownInterval: null,
  });
  const autoCloseDurationRef = useRef(AUTO_CLOSE_MS / 1000);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLog((prev) =>
      [`[${timestamp}] ${message}`, ...prev].slice(0, 8),
    );
  };

  const resetTimers = () => {
    if (timersRef.current.waitingTimeout) {
      clearTimeout(timersRef.current.waitingTimeout);
    }
    if (timersRef.current.autoCloseTimeout) {
      clearTimeout(timersRef.current.autoCloseTimeout);
    }
    if (timersRef.current.countdownInterval) {
      clearInterval(timersRef.current.countdownInterval);
    }
    timersRef.current.waitingTimeout = null;
    timersRef.current.autoCloseTimeout = null;
    timersRef.current.countdownInterval = null;
  };

  const removeToast = (id: string, reason: "manual" | "auto" = "manual") => {
    let removed = false;
    setToasts((prev) => {
      const next = prev.filter((toast) => {
        if (toast.id === id) {
          removed = true;
          return false;
        }
        return true;
      });
      return next;
    });
    if (removed) {
      addLog(
        `Toast ${id} dismissed (${reason === "auto" ? "auto" : "manual"})`,
      );
    }
  };

  const triggerToast = () => {
    const id = `toast-${Date.now()}`;
    const defaultMessage =
      Math.random() > 0.5
        ? "Background job finished with all steps passing."
        : "Background job finished, but an approval is still pending.";
    const toast: ToastMessage = {
      id,
      variant: Math.random() > 0.5 ? "success" : "warning",
      message: toastMessage.trim() || defaultMessage,
    };

    setToasts((prev) => [...prev, toast]);
    addLog(`Toast ${id} created (${toast.variant})`);

    setTimeout(() => {
      removeToast(id, "auto");
    }, TOAST_DURATION_MS);
  };

  const getAutoCloseDurationSeconds = () => {
    const parsed = Number(autoCloseInput);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return AUTO_CLOSE_MS / 1000;
  };

  const showDelayedNotification = () => {
    resetTimers();
    setDelayedState("waiting");
    setAutoCloseCountdown(null);
    const durationSeconds = getAutoCloseDurationSeconds();
    autoCloseDurationRef.current = durationSeconds;
    addLog(
      `Delayed notification scheduled (3 second delay, ${durationSeconds}s visible)`,
    );

    timersRef.current.waitingTimeout = setTimeout(() => {
      const visibilitySeconds = autoCloseDurationRef.current;
      setDelayedState("visible");
      setAutoCloseCountdown(visibilitySeconds);
      addLog(
        `Delayed notification shown to the user (auto close in ${visibilitySeconds}s)`,
      );

      timersRef.current.countdownInterval = setInterval(() => {
        setAutoCloseCountdown((prev) => {
          if (!prev) return null;
          if (prev <= 1) {
            closeDelayedNotification("auto");
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      timersRef.current.autoCloseTimeout = setTimeout(() => {
        closeDelayedNotification("auto");
      }, visibilitySeconds * 1000);
    }, DELAY_BEFORE_SHOW_MS);
  };

  const closeDelayedNotification = (reason: "manual" | "auto" | "cancel") => {
    resetTimers();
    setDelayedState("idle");
    setAutoCloseCountdown(null);

    if (reason === "manual") {
      addLog("User closed delayed notification manually");
    } else if (reason === "auto") {
      addLog("Delayed notification auto-dismissed after countdown");
    } else {
      addLog("Pending delayed notification was cancelled");
    }
  };

  useEffect(() => {
    return () => {
      resetTimers();
    };
  }, []);

  return (
    <div className="px-4 py-6 sm:px-0 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Toast & Delayed Notification Scenario
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Use this page to practice working with toast buttons, delayed
          notifications, and auto-dismiss logic that still allows manual
          control. The steps below intentionally combine instant and timed UI
          feedback for automation practice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4"
          data-test="toast-playground"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-semibold">Toast button</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fires an immediate toast with random status that expires on its
                own but can be closed early.
              </p>
            </div>
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Toast message
            </span>
            <input
              type="text"
              value={toastMessage}
              onChange={(event) => setToastMessage(event.target.value)}
              placeholder="Describe what the toast should say"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/60 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
              data-test="toast-message-input"
            />
          </label>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              The trigger button below lives inside a Shadow DOM host for extra
              locator practice.
            </p>
            <ShadowToastTriggerButton onTrigger={triggerToast} />
          </div>

          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>Toast disappears automatically after a few seconds.</li>
            <li>Close icon inside each toast should dismiss it immediately.</li>
            <li data-test="toast-step">
              Run scripts against the button and toast lifecycle.
            </li>
          </ul>
        </section>

        <section
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4"
          data-test="delayed-notification"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold">Delayed notification</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Appears three seconds after requesting it and then counts down
                to auto-close unless you dismiss it.
              </p>
            </div>
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Visible duration (seconds)
            </span>
            <input
              type="number"
              min={1}
              step={1}
              value={autoCloseInput}
              onChange={(event) => setAutoCloseInput(event.target.value)}
              placeholder={`Defaults to ${AUTO_CLOSE_MS / 1000}`}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/60 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              data-test="delayed-notification-duration-input"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={showDelayedNotification}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              data-test="delayed-notification-trigger"
            >
              Schedule delayed notification
            </button>
            {delayedState === "waiting" && (
              <button
                onClick={() => closeDelayedNotification("cancel")}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                data-test="delayed-notification-cancel"
              >
                Cancel pending notification
              </button>
            )}
          </div>

          {delayedState === "idle" && (
            <p
              className="text-gray-600 dark:text-gray-400"
              data-test="delayed-notification-status"
            >
              No delayed notification is currently scheduled.
            </p>
          )}

          {delayedState === "waiting" && (
            <div
              className="p-4 border border-dashed border-blue-300 rounded-md bg-blue-50 text-blue-700"
              data-test="delayed-notification-waiting"
            >
              Notification will appear in a moment. Perfect for verifying
              asynchronous waits.
            </div>
          )}

          {delayedState === "visible" && (
            <div
              className="p-4 rounded-md border border-green-200 bg-green-50 text-green-900 flex items-start justify-between gap-4"
              data-test="delayed-notification-visible"
            >
              <div>
                <p className="font-semibold mb-1">Build step completed</p>
                <p className="text-sm">
                  Auto-closing in {autoCloseCountdown ?? 0} second(s). Use the
                  close button to dismiss it sooner.
                </p>
              </div>
              <button
                onClick={() => closeDelayedNotification("manual")}
                className="text-green-800 hover:text-green-600"
                data-test="delayed-notification-close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>

      <section
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        data-test="scenario-activity-log"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-teal-500" />
          <div>
            <h2 className="text-xl font-semibold">Scenario activity log</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Recent events for both toast and delayed notification flows.
            </p>
          </div>
        </div>
        {activityLog.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Interact with the buttons above to populate the log.
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
            {activityLog.map((entry, idx) => (
              <li
                key={idx}
                className="font-mono"
                data-test={`log-entry-${idx}`}
              >
                {entry}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div
        className="fixed bottom-6 right-6 space-y-3 w-[calc(100%-3rem)] sm:w-80 z-50"
        data-test="toast-container"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded shadow-lg border flex items-start justify-between gap-3 transition-all ${
              toast.variant === "success"
                ? "bg-white border-green-200 text-green-800"
                : "bg-white border-yellow-200 text-yellow-800"
            }`}
            data-test={`toast-${toast.id}`}
          >
            <div>
              <p className="font-semibold">
                {toast.variant === "success" ? "Success" : "Attention needed"}
              </p>
              <p className="text-sm">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-700"
              data-test={`toast-close-${toast.id}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
