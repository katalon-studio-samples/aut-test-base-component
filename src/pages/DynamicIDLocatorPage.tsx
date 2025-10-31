import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

// Utility function to generate random dynamic IDs
const generateDynamicId = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const DynamicIDLocatorPage: React.FC = () => {
  // State for dynamic IDs that change on each render/refresh
  const [dynamicIds, setDynamicIds] = useState({
    comboboxInput: `combobox-input-${generateDynamicId()}`,
    listbox: `listbox-${generateDynamicId()}`,
    crInput: `cr-input-${generateDynamicId()}`,
    option1: `option-${generateDynamicId()}`,
    option2: `option-${generateDynamicId()}`,
    option3: `option-${generateDynamicId()}`,
  });

  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueFixed, setSelectedValueFixed] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  // Simulate dynamic ID regeneration (like a framework would do)
  const regenerateIds = () => {
    setDynamicIds({
      comboboxInput: `combobox-input-${generateDynamicId()}`,
      listbox: `listbox-${generateDynamicId()}`,
      crInput: `cr-input-${generateDynamicId()}`,
      option1: `option-${generateDynamicId()}`,
      option2: `option-${generateDynamicId()}`,
      option3: `option-${generateDynamicId()}`,
    });
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    // Auto-regenerate IDs every 5 seconds to simulate framework behavior
    const interval = setInterval(regenerateIds, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Dynamic ID Locator - Issue Reproduction & Fix
      </h1>

      {/* Issue Description */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
          Issue Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Dynamic IDs are identifiers that change across sessions or builds,
          typically following patterns like:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
          <li>
            <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm">
              id="combobox-input-49k0w"
            </code>
          </li>
          <li>
            <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm">
              id="listbox-i03ij-1"
            </code>
          </li>
          <li>
            <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm">
              id="cr-input-hfrsn-3"
            </code>
          </li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 mt-3">
          <strong>Problem:</strong> Test automation scripts that rely on these
          dynamic IDs will break when the IDs change.
        </p>
      </div>

      {/* Solution */}
      <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
          Solution
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Remove dynamic ID patterns from selectors</strong> and use
          meaningful, stable names instead:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4 mt-2">
          <li>
            Use semantic attributes like{" "}
            <code className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-sm">
              data-testid
            </code>
            ,{" "}
            <code className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-sm">
              name
            </code>
            , or{" "}
            <code className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-sm">
              aria-label
            </code>
          </li>
          <li>Use stable class names or element roles</li>
          <li>Use text content or labels when appropriate</li>
        </ul>
      </div>

      {/* Refresh Counter */}
      <div className="mb-6 flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            IDs regenerate every 5 seconds or click refresh
          </p>
          <p className="text-lg font-semibold">Refresh Count: {refreshCount}</p>
        </div>
        <button
          onClick={regenerateIds}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate IDs
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problematic Version - With Dynamic IDs */}
        <div className="border-2 border-red-300 dark:border-red-700 rounded-lg p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
              ❌ Problematic (Dynamic IDs)
            </h3>
          </div>

          <div className="space-y-4">
            {/* Combobox with dynamic ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Option (Dynamic ID)
              </label>
              <select
                id={dynamicIds.comboboxInput}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              >
                <option value="">Choose an option...</option>
                <option id={dynamicIds.option1} value="option1">
                  Option 1
                </option>
                <option id={dynamicIds.option2} value="option2">
                  Option 2
                </option>
                <option id={dynamicIds.option3} value="option3">
                  Option 3
                </option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current ID:{" "}
                <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">
                  {dynamicIds.comboboxInput}
                </code>
              </p>
            </div>

            {/* Input with dynamic ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Input (Dynamic ID)
              </label>
              <input
                type="text"
                id={dynamicIds.crInput}
                placeholder="Enter text..."
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current ID:{" "}
                <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">
                  {dynamicIds.crInput}
                </code>
              </p>
            </div>

            {/* Listbox with dynamic ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                List Items (Dynamic IDs)
              </label>
              <ul
                id={dynamicIds.listbox}
                className="border rounded divide-y dark:divide-gray-700"
              >
                <li className="px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                  Item 1
                </li>
                <li className="px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                  Item 2
                </li>
                <li className="px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                  Item 3
                </li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current ID:{" "}
                <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">
                  {dynamicIds.listbox}
                </code>
              </p>
            </div>

            {/* Button with dynamic ID */}
            <div>
              <button
                id={`button-${generateDynamicId()}`}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Submit (Dynamic ID)
              </button>
            </div>
          </div>

          {/* Selector Examples */}
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded">
            <h4 className="font-semibold text-sm mb-2">
              ❌ Unreliable Selectors:
            </h4>
            <code className="text-xs block mb-1 break-all">
              #{dynamicIds.comboboxInput}
            </code>
            <code className="text-xs block mb-1 break-all">
              #{dynamicIds.listbox}
            </code>
            <code className="text-xs block break-all">
              #{dynamicIds.crInput}
            </code>
            <p className="text-xs text-red-700 dark:text-red-400 mt-2">
              ⚠️ These IDs change every refresh!
            </p>
          </div>
        </div>

        {/* Fixed Version - With Stable Attributes */}
        <div className="border-2 border-green-300 dark:border-green-700 rounded-lg p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
              ✅ Fixed (Stable Attributes)
            </h3>
          </div>

          <div className="space-y-4">
            {/* Combobox with stable attributes */}
            <div>
              <label
                htmlFor="user-role-select"
                className="block text-sm font-medium mb-2"
              >
                Select Option (Stable)
              </label>
              <select
                id="user-role-select"
                name="userRole"
                data-testid="user-role-selector"
                aria-label="User role selection"
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedValueFixed}
                onChange={(e) => setSelectedValueFixed(e.target.value)}
              >
                <option value="">Choose an option...</option>
                <option value="option1" data-testid="role-option-admin">
                  Option 1
                </option>
                <option value="option2" data-testid="role-option-user">
                  Option 2
                </option>
                <option value="option3" data-testid="role-option-guest">
                  Option 3
                </option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Stable ID:{" "}
                <code className="bg-green-100 dark:bg-green-900/30 px-1 rounded">
                  user-role-select
                </code>
              </p>
            </div>

            {/* Input with stable attributes */}
            <div>
              <label
                htmlFor="user-email-input"
                className="block text-sm font-medium mb-2"
              >
                Text Input (Stable)
              </label>
              <input
                type="text"
                id="user-email-input"
                name="userEmail"
                data-testid="email-input-field"
                aria-label="Email address input"
                placeholder="Enter text..."
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Stable ID:{" "}
                <code className="bg-green-100 dark:bg-green-900/30 px-1 rounded">
                  user-email-input
                </code>
              </p>
            </div>

            {/* Listbox with stable attributes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                List Items (Stable)
              </label>
              <ul
                id="notification-list"
                data-testid="notification-listbox"
                role="listbox"
                aria-label="Notification list"
                className="border rounded divide-y dark:divide-gray-700"
              >
                <li
                  data-testid="notification-item-1"
                  className="px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                >
                  Item 1
                </li>
                <li
                  data-testid="notification-item-2"
                  className="px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                >
                  Item 2
                </li>
                <li
                  data-testid="notification-item-3"
                  className="px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                >
                  Item 3
                </li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Stable ID:{" "}
                <code className="bg-green-100 dark:bg-green-900/30 px-1 rounded">
                  notification-list
                </code>
              </p>
            </div>

            {/* Button with stable attributes */}
            <div>
              <button
                id="submit-form-button"
                data-testid="form-submit-btn"
                aria-label="Submit form"
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Submit (Stable ID)
              </button>
            </div>
          </div>

          {/* Selector Examples */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded">
            <h4 className="font-semibold text-sm mb-2">
              ✅ Reliable Selectors:
            </h4>
            <code className="text-xs block mb-1">#user-role-select</code>
            <code className="text-xs block mb-1">
              [data-testid="user-role-selector"]
            </code>
            <code className="text-xs block mb-1">#user-email-input</code>
            <code className="text-xs block mb-1">
              [data-testid="email-input-field"]
            </code>
            <code className="text-xs block mb-1">#notification-list</code>
            <code className="text-xs block">
              [data-testid="notification-listbox"]
            </code>
            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
              ✅ These selectors remain stable across refreshes!
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
              ✅ DO:
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>Use semantic, meaningful ID names</li>
              <li>
                Add <code>data-testid</code> attributes for test automation
              </li>
              <li>
                Use <code>name</code> attributes for form elements
              </li>
              <li>
                Leverage <code>aria-label</code> for accessibility and testing
              </li>
              <li>Use stable class names when appropriate</li>
              <li>Select by role or text content when possible</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
              ❌ DON'T:
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>Rely on framework-generated dynamic IDs</li>
              <li>Use IDs with random alphanumeric sequences</li>
              <li>
                Depend on IDs like <code>combobox-input-49k0w</code>
              </li>
              <li>
                Use patterns like <code>listbox-i03ij-1</code>
              </li>
              <li>
                Trust IDs such as <code>cr-input-hfrsn-3</code>
              </li>
              <li>Use index-based selectors without stable attributes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Testing Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Observe the dynamic IDs:</strong> Watch how the IDs in the
            red (problematic) section change every 5 seconds or when you click
            "Regenerate IDs"
          </li>
          <li>
            <strong>Compare selectors:</strong> Notice how the green (fixed)
            section maintains stable IDs and attributes
          </li>
          <li>
            <strong>Test automation:</strong> Try creating test scripts using
            both approaches and see which ones remain stable
          </li>
          <li>
            <strong>Inspect elements:</strong> Use browser DevTools to inspect
            the HTML and see the difference in attributes
          </li>
        </ol>
      </div>
    </div>
  );
};
