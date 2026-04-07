import React, { useMemo, useState } from "react";

type XPathCheck = {
  label: string;
  xpath: string;
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  text: string;
  role: string;
  checks: XPathCheck[];
};

const scenarios: Scenario[] = [
  {
    id: "direct-text-option",
    title: "Direct text on parent",
    description:
      "Control case: the role element owns the text node directly, so text() should still work.",
    text: "Direct Text Option",
    role: "option",
    checks: [
      {
        label: "Direct text predicate",
        xpath: "//*[@role='option' and text()='Direct Text Option']",
      },
      {
        label: "Normalized descendant text predicate",
        xpath: "//*[@role='option' and normalize-space(.)='Direct Text Option']",
      },
    ],
  },
  {
    id: "nested-title-option",
    title: "Nested text only",
    description:
      "Primary repro: the visible label lives in a child span, while the parent role element has no direct text node.",
    text: "Nested Text Option",
    role: "option",
    checks: [
      {
        label: "Broken parent text() predicate",
        xpath: "//*[@role='option' and text()='Nested Text Option']",
      },
      {
        label: "Normalized descendant text predicate",
        xpath: "//*[@role='option' and normalize-space(.)='Nested Text Option']",
      },
      {
        label: "Target child span text",
        xpath: "//*[@role='option'][.//span[normalize-space()='Nested Text Option']]",
      },
    ],
  },
  {
    id: "nested-title-subtitle-option",
    title: "Nested subtitle plus title",
    description:
      "IFS-like structure: subtitle and title are separate descendants under the clickable parent.",
    text: "Accounts - CRM",
    role: "option",
    checks: [
      {
        label: "Broken parent text() predicate",
        xpath: "//*[@role='option' and text()='Accounts - CRM']",
      },
      {
        label: "Target title descendant",
        xpath: "//*[@role='option'][.//span[normalize-space()='Accounts - CRM']]",
      },
      {
        label: "Contains full descendant text",
        xpath: "//*[@role='option' and contains(normalize-space(.), 'Accounts - CRM')]",
      },
    ],
  },
  {
    id: "compound-field-pairs-option",
    title: "Compound text from nested field pairs",
    description:
      "IFS-like object card: the option text is effectively composed from 3 child rows, each with a value span plus a label span.",
    text: "Overseas Automobile Sales (Account) (No value) (Description) Larry Homes (Contact Name)",
    role: "option",
    checks: [
      {
        label: "Broken parent text() predicate",
        xpath:
          "//*[@role='option' and text()='Overseas Automobile Sales (Account) (No value) (Description) Larry Homes (Contact Name)']",
      },
      {
        label: "Exact compound descendant text",
        xpath:
          "//*[@role='option' and normalize-space(.)='Overseas Automobile Sales (Account) (No value) (Description) Larry Homes (Contact Name)']",
      },
      {
        label: "Target field rows by descendant spans",
        xpath:
          "//*[@role='option'][.//span[normalize-space()='Overseas Automobile Sales'] and .//span[normalize-space()='(Account)'] and .//span[normalize-space()='(No value)'] and .//span[normalize-space()='(Description)'] and .//span[normalize-space()='Larry Homes'] and .//span[normalize-space()='(Contact Name)']]",
      },
    ],
  },
];

const evaluateXPath = (xpath: string) => {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );

  return result.snapshotLength;
};

export const NestedTextLocatorPOCPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");

  const results = useMemo(
    () =>
      scenarios.map((scenario) => ({
        ...scenario,
        evaluatedChecks: scenario.checks.map((check) => ({
          ...check,
          matches: evaluateXPath(check.xpath),
        })),
      })),
    [],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-3">
        <div className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          Nested Text Locator POC
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Captured objects with nested text
        </h1>
        <p className="max-w-4xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          This page reproduces the failure mode where a recorder targets a
          parent interactive element but uses a direct{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
            text()='...'
          </code>{" "}
          predicate even though the visible label is rendered by nested child
          nodes.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          How to use this page
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
          <li>Open this page in the AUT test app and record clicks on each card.</li>
          <li>Inspect the emitted primary XPath for the selected target.</li>
          <li>
            Compare the recorded XPath with the on-page check table to see
            whether it behaves like the broken parent-text form or a
            descendant-safe form.
          </li>
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {scenarios.map((scenario) => {
            const isSelected = selectedScenario === scenario.id;

            return (
              <div
                key={scenario.id}
                className={`rounded-2xl border p-5 shadow-sm transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-950/30"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {scenario.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {scenario.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    role="{scenario.role}"
                  </span>
                </div>

                {scenario.id === "direct-text-option" && (
                  <ul
                    role="listbox"
                    className="space-y-3"
                  >
                    <li
                      role="option"
                      tabIndex={0}
                      className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none hover:border-blue-400 hover:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800"
                      onClick={() => setSelectedScenario(scenario.id)}
                    >
                      {scenario.text}
                    </li>
                  </ul>
                )}

                {scenario.id === "nested-title-option" && (
                  <ul
                    role="listbox"
                    className="space-y-3"
                  >
                    <div
                      role="option"
                      tabIndex={0}
                      className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none hover:border-blue-400 hover:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-800"
                      onClick={() => setSelectedScenario(scenario.id)}
                    >
                      <span className="pointer-events-none block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        child span only
                      </span>
                      <span className="pointer-events-none block text-sm font-semibold text-gray-900 dark:text-white">
                        {scenario.text}
                      </span>
                    </div>
                  </ul>
                )}

                {scenario.id === "nested-title-subtitle-option" && (
                  <nav className="rounded-xl border border-gray-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-950/40">
                    <ul role="listbox" className="space-y-3">
                      <li
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                        className="list-none cursor-pointer rounded-xl border border-gray-300 bg-white p-2 outline-none hover:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-900/60"
                        onClick={() => {
                          setSelectedScenario(scenario.id);
                        }}
                      >
                        <div
                          tabIndex={-1}
                          className="wrapper pointer-events-none rounded-lg"
                        >
                          <div className="navigator pointer-events-none">
                            <div className="link-item pointer-events-none">
                              <div className="holder rounded-lg px-3 py-2 transition hover:bg-blue-50 dark:hover:bg-gray-700">
                                <div className="label flex flex-col gap-1">
                                  <span className="subtitle pointer-events-none text-xs text-gray-500 dark:text-gray-400">
                                    Relationship Management / Customer
                                    Relationship Management / Account
                                  </span>
                                  <span className="title pointer-events-none text-sm font-semibold text-gray-900 dark:text-white">
                                    {scenario.text}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </nav>
                )}

                {scenario.id === "compound-field-pairs-option" && (
                  <nav className="rounded-xl border border-gray-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-950/40">
                    <ul role="listbox" className="space-y-3">
                      <li
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                        className="list-none cursor-pointer rounded-xl border border-gray-300 bg-white p-2 outline-none hover:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-900/60"
                        onClick={() => {
                          setSelectedScenario(scenario.id);
                        }}
                      >
                        <div className="pointer-events-none rounded-lg px-3 py-2">
                          <div className="mb-3">
                            <span className="block text-sm text-gray-900 dark:text-white">
                              <span className="font-medium">
                                Overseas Automobile Sales
                              </span>{" "}
                              <span className="text-gray-500 dark:text-gray-400">
                                (Account)
                              </span>
                            </span>
                          </div>

                          <div className="mb-3">
                            <span className="block text-sm text-gray-900 dark:text-white">
                              <span className="text-gray-500 dark:text-gray-400">
                                (No value)
                              </span>{" "}
                              <span className="text-gray-500 dark:text-gray-400">
                                (Description)
                              </span>
                            </span>
                          </div>

                          <div>
                            <span className="block text-sm text-gray-900 dark:text-white">
                              <span className="font-medium">Larry Homes</span>{" "}
                              <span className="text-gray-500 dark:text-gray-400">
                                (Contact Name)
                              </span>
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            );
          })}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              Selected target
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {selectedScenario
                ? `Last clicked scenario: ${selectedScenario}`
                : "Click any option card to mimic recorder capture on the target element."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              XPath evaluation
            </h2>
            <div className="space-y-5">
              {results.map((scenario) => (
                <div key={scenario.id} className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {scenario.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {scenario.evaluatedChecks.map((check) => {
                      const passed = check.matches > 0;
                      return (
                        <div
                          key={`${scenario.id}-${check.label}`}
                          className={`rounded-xl border p-3 text-sm ${
                            passed
                              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
                              : "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/20"
                          }`}
                        >
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {check.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                passed
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                              }`}
                            >
                              matches: {check.matches}
                            </span>
                          </div>
                          <code className="block overflow-x-auto whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            {check.xpath}
                          </code>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
