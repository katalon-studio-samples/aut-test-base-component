import React, { useMemo, useState } from "react";

const DEFAULT_URL = "/";

export const OpenNewTabPage: React.FC = () => {
  const [url, setUrl] = useState("");
  const placeholder = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/`
        : "https://your-site/",
    [],
  );

  const handleOpen = () => {
    const target = url.trim() || DEFAULT_URL;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const handlePopup = () => {
    const target = url.trim() || DEFAULT_URL;
    window.open(
      target,
      "PopupWindow",
      "popup=yes,width=600,height=600,menubar=no,toolbar=no,location=no,status=no",
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300 font-semibold">
          Navigation Actions
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Open New Tab
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Click the action button to launch a new browser tab. Provide a custom
          URL or leave blank to open the home page.
        </p>
      </header>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Target URL
          <input
            type="url"
            placeholder={placeholder}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-test="new-tab-url-input"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            data-test="open-new-tab-button"
          >
            Open New Tab
          </button>
          <button
            type="button"
            onClick={handlePopup}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white shadow hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600"
            data-test="open-popup-window-button"
          >
            Open Popup Window
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          New-tab and popup window options keep this page open. Defaults go to
          the home page ({placeholder}) when no URL is entered.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Note: Some browsers may block popup windows; allow popups to test the
          popup option.
        </p>
      </div>
    </div>
  );
};
