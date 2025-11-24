import React, { useState } from "react";

interface Scenario {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  bypassed: boolean;
}

const initialScenarios: Scenario[] = [
  {
    id: "auth-validation",
    name: "Authentication Validation",
    description: "Validates user credentials before allowing access",
    enabled: true,
    bypassed: false,
  },
  {
    id: "data-encryption",
    name: "Data Encryption",
    description: "Encrypts sensitive data before storage",
    enabled: true,
    bypassed: false,
  },
  {
    id: "rate-limiting",
    name: "Rate Limiting",
    description: "Limits the number of requests per user",
    enabled: false,
    bypassed: false,
  },
  {
    id: "email-notifications",
    name: "Email Notifications",
    description: "Sends email notifications for important events",
    enabled: true,
    bypassed: false,
  },
  {
    id: "cache-layer",
    name: "Cache Layer",
    description: "Caches frequently accessed data",
    enabled: true,
    bypassed: false,
  },
  {
    id: "logging-system",
    name: "Logging System",
    description: "Logs all system activities and errors",
    enabled: true,
    bypassed: false,
  },
  {
    id: "api-validation",
    name: "API Request Validation",
    description: "Validates incoming API requests",
    enabled: false,
    bypassed: false,
  },
  {
    id: "backup-service",
    name: "Backup Service",
    description: "Automatically backs up data at scheduled intervals",
    enabled: true,
    bypassed: false,
  },
];

export const ScenarioTogglePage: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setHistory((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const handleToggleEnabled = (id: string) => {
    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === id) {
          const newEnabled = !scenario.enabled;
          addToHistory(
            `${scenario.name}: ${newEnabled ? "ENABLED" : "DISABLED"}`,
          );
          return { ...scenario, enabled: newEnabled };
        }
        return scenario;
      }),
    );
  };

  const handleToggleBypassed = (id: string) => {
    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === id) {
          const newBypassed = !scenario.bypassed;
          addToHistory(
            `${scenario.name}: ${newBypassed ? "BYPASSED" : "NOT BYPASSED"}`,
          );
          return { ...scenario, bypassed: newBypassed };
        }
        return scenario;
      }),
    );
  };

  const handleEnableAll = () => {
    setScenarios((prev) =>
      prev.map((scenario) => ({ ...scenario, enabled: true })),
    );
    addToHistory("All scenarios ENABLED");
  };

  const handleDisableAll = () => {
    setScenarios((prev) =>
      prev.map((scenario) => ({ ...scenario, enabled: false })),
    );
    addToHistory("All scenarios DISABLED");
  };

  const handleResetAll = () => {
    setScenarios(initialScenarios);
    addToHistory("All scenarios RESET to default");
  };

  const handleBypassAll = () => {
    setScenarios((prev) =>
      prev.map((scenario) => ({ ...scenario, bypassed: true })),
    );
    addToHistory("All scenarios BYPASSED");
  };

  const handleUnbypassAll = () => {
    setScenarios((prev) =>
      prev.map((scenario) => ({ ...scenario, bypassed: false })),
    );
    addToHistory("All scenarios UN-BYPASSED");
  };

  const getStatusColor = (scenario: Scenario) => {
    if (scenario.bypassed) return "bg-yellow-100 border-yellow-400";
    if (scenario.enabled) return "bg-green-100 border-green-400";
    return "bg-gray-100 border-gray-400";
  };

  const getStatusText = (scenario: Scenario) => {
    if (scenario.bypassed) return "Bypassed";
    if (scenario.enabled) return "Enabled";
    return "Disabled";
  };

  const getStatusBadgeColor = (scenario: Scenario) => {
    if (scenario.bypassed) return "bg-yellow-500 text-white";
    if (scenario.enabled) return "bg-green-500 text-white";
    return "bg-gray-500 text-white";
  };

  const enabledCount = scenarios.filter((s) => s.enabled).length;
  const bypassedCount = scenarios.filter((s) => s.bypassed).length;
  const disabledCount = scenarios.filter((s) => !s.enabled).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Scenario Toggle Control Panel</h1>
      <p className="text-gray-600 mb-6">
        Enable, disable, or bypass different test scenarios
      </p>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Total Scenarios</div>
          <div className="text-2xl font-bold">{scenarios.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Enabled</div>
          <div className="text-2xl font-bold text-green-600">
            {enabledCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <div className="text-sm text-gray-600">Disabled</div>
          <div className="text-2xl font-bold text-gray-600">
            {disabledCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Bypassed</div>
          <div className="text-2xl font-bold text-yellow-600">
            {bypassedCount}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">Bulk Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEnableAll}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            data-testid="enable-all-btn"
          >
            Enable All
          </button>
          <button
            onClick={handleDisableAll}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            data-testid="disable-all-btn"
          >
            Disable All
          </button>
          <button
            onClick={handleBypassAll}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            data-testid="bypass-all-btn"
          >
            Bypass All
          </button>
          <button
            onClick={handleUnbypassAll}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            data-testid="unbypass-all-btn"
          >
            Un-bypass All
          </button>
          <button
            onClick={handleResetAll}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            data-testid="reset-all-btn"
          >
            Reset All
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition ml-auto"
            data-testid="toggle-history-btn"
          >
            {showHistory ? "Hide" : "Show"} History
          </button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Action History</h3>
            <button
              onClick={() => setHistory([])}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              data-testid="clear-history-btn"
            >
              Clear History
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded max-h-48 overflow-y-auto font-mono text-sm">
            {history.length === 0 ? (
              <div className="text-gray-500 text-center">No actions yet</div>
            ) : (
              history.map((entry, idx) => (
                <div
                  key={idx}
                  className="py-1 border-b border-gray-200 last:border-0"
                >
                  {entry}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-4 rounded-lg shadow border-2 transition-all ${getStatusColor(scenario)}`}
            data-testid={`scenario-${scenario.id}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{scenario.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {scenario.description}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(scenario)}`}
                data-testid={`status-${scenario.id}`}
              >
                {getStatusText(scenario)}
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {scenario.enabled ? "Enabled" : "Disabled"}
                </span>
                <button
                  onClick={() => handleToggleEnabled(scenario.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    scenario.enabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                  data-testid={`toggle-enabled-${scenario.id}`}
                  aria-label={`Toggle ${scenario.name} enabled state`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      scenario.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Bypass Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {scenario.bypassed ? "Bypassed" : "Not Bypassed"}
                </span>
                <button
                  onClick={() => handleToggleBypassed(scenario.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                    scenario.bypassed ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                  data-testid={`toggle-bypass-${scenario.id}`}
                  aria-label={`Toggle ${scenario.name} bypass state`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      scenario.bypassed ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold mb-2 text-blue-900">Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>Enabled</strong>: The scenario is active and running
          </li>
          <li>
            • <strong>Disabled</strong>: The scenario is turned off
          </li>
          <li>
            • <strong>Bypassed</strong>: The scenario is enabled but its logic
            is skipped (useful for testing)
          </li>
          <li>
            • Click the toggle buttons to change the state of each scenario
          </li>
          <li>• Use bulk actions to control all scenarios at once</li>
          <li>• View history to see all state changes with timestamps</li>
        </ul>
      </div>
    </div>
  );
};
