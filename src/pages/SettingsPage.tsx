import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { trueTestDetector } from "../utils/trueTestDetector";
import { Save, Trash2, Plus, X } from "lucide-react";

interface KeyValuePair {
  key: string;
  value: string;
  id: string;
}

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load existing data on component mount
  useEffect(() => {
    loadExistingData();
    loadFromQueryParams();
  }, []);

  const loadExistingData = () => {
    const existingData = trueTestDetector.getAllSessionAttributes();
    const pairs: KeyValuePair[] = Object.entries(existingData).map(
      ([key, value], index) => ({
        key,
        value,
        id: `existing-${index}`,
      }),
    );
    setKeyValuePairs(pairs);
  };

  const loadFromQueryParams = () => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      // Set the attributes from query params
      trueTestDetector.setMultipleAttributes(params);

      // Update the display
      const pairs: KeyValuePair[] = Object.entries(params).map(
        ([key, value], index) => ({
          key,
          value,
          id: `query-${index}`,
        }),
      );
      setKeyValuePairs((prev) => {
        // Merge with existing, avoiding duplicates
        const existingKeys = prev.map((p) => p.key);
        const newPairs = pairs.filter((p) => !existingKeys.includes(p.key));
        return [...prev, ...newPairs];
      });

      showMessage(
        "success",
        `Loaded ${Object.keys(params).length} parameters from URL`,
      );

      // Clear query params from URL after loading
      setSearchParams({});
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const addKeyValuePair = () => {
    if (!newKey.trim() || !newValue.trim()) {
      showMessage("error", "Both key and value are required");
      return;
    }

    if (keyValuePairs.some((pair) => pair.key === newKey.trim())) {
      showMessage("error", "Key already exists");
      return;
    }

    const newPair: KeyValuePair = {
      key: newKey.trim(),
      value: newValue.trim(),
      id: `new-${Date.now()}`,
    };

    setKeyValuePairs((prev) => [...prev, newPair]);
    setNewKey("");
    setNewValue("");
  };

  const updateKeyValuePair = (id: string, key: string, value: string) => {
    setKeyValuePairs((prev) =>
      prev.map((pair) =>
        pair.id === id
          ? { ...pair, key: key.trim(), value: value.trim() }
          : pair,
      ),
    );
  };

  const removeKeyValuePair = (id: string) => {
    setKeyValuePairs((prev) => prev.filter((pair) => pair.id !== id));
  };

  const saveAllAttributes = () => {
    try {
      // Clear existing attributes
      trueTestDetector.clearAllAttributes();

      // Set new attributes
      const attributes: Record<string, string> = {};
      keyValuePairs.forEach((pair) => {
        if (pair.key.trim() && pair.value.trim()) {
          attributes[pair.key.trim()] = pair.value.trim();
        }
      });

      trueTestDetector.setMultipleAttributes(attributes);

      // Trigger TrueTest.setSessionAttributes to demonstrate detection
      if (typeof window !== "undefined" && (window as any).TrueTest) {
        (window as any).TrueTest.setSessionAttributes(attributes);
      }

      showMessage(
        "success",
        `Saved ${Object.keys(attributes).length} attributes to session storage`,
      );
    } catch (error) {
      showMessage("error", "Failed to save attributes");
      console.error("Save error:", error);
    }
  };

  const clearAllAttributes = () => {
    trueTestDetector.clearAllAttributes();
    setKeyValuePairs([]);
    showMessage("success", "All attributes cleared");
  };

  const generateQueryParamUrl = () => {
    const params = new URLSearchParams();
    keyValuePairs.forEach((pair) => {
      if (pair.key.trim() && pair.value.trim()) {
        params.append(pair.key.trim(), pair.value.trim());
      }
    });

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          TrueTest Session Attributes Settings
        </h1>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How to use:
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Add key-value pairs manually using the form below</li>
            <li>
              • Load parameters via URL:{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                /settings?key1=value1&key2=value2
              </code>
            </li>
            <li>
              • All data is stored in session storage (cleared when browser
              closes)
            </li>
            <li>
              • The script automatically detects calls to{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                TrueTest.setSessionAttributes
              </code>
            </li>
          </ul>
        </div>

        {/* Add New Pair */}
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Key-Value Pair
          </h3>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === "Enter" && addKeyValuePair()}
            />
            <input
              type="text"
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === "Enter" && addKeyValuePair()}
            />
            <button
              onClick={addKeyValuePair}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* Key-Value Pairs List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Key-Value Pairs ({keyValuePairs.length})
          </h3>

          {keyValuePairs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No key-value pairs configured
            </p>
          ) : (
            <div className="space-y-3">
              {keyValuePairs.map((pair) => (
                <div
                  key={pair.id}
                  className="flex gap-4 items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md"
                >
                  <input
                    type="text"
                    value={pair.key}
                    onChange={(e) =>
                      updateKeyValuePair(pair.id, e.target.value, pair.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    value={pair.value}
                    onChange={(e) =>
                      updateKeyValuePair(pair.id, pair.key, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Value"
                  />
                  <button
                    onClick={() => removeKeyValuePair(pair.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={saveAllAttributes}
            disabled={keyValuePairs.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            Save All Attributes
          </button>

          <button
            onClick={clearAllAttributes}
            disabled={keyValuePairs.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>

        {/* Query Param URL Generator */}
        {keyValuePairs.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Generated Query Parameter URL:
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={generateQueryParamUrl()}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-sm dark:text-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateQueryParamUrl());
                  showMessage("success", "URL copied to clipboard");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
