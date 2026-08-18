import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  ListChecks,
  MousePointerClick,
} from "lucide-react";
import {
  characterCodes,
  expectedFixtures,
  type Xml2476DomField,
  type Xml2476Fixture,
} from "../fixtures/xml2476Fixtures";

type FieldVerification = {
  field: Xml2476DomField;
  expectedJson: string;
  actualJson: string;
  expectedLength: number;
  actualLength: number;
  characterCodes: Array<number | undefined>;
  matches: boolean;
};

export type Xml2476Verification = {
  id: string;
  field: Xml2476DomField;
  expectedJson: string;
  actualJson: string;
  expectedLength: number;
  actualLength: number;
  characterCodes: Array<number | undefined>;
  fields: FieldVerification[];
  matches: boolean;
};

declare global {
  interface Window {
    verifyXml2476Fixtures?: () => Xml2476Verification[];
  }
}

const readDomField = (element: HTMLElement | null, field: Xml2476DomField) => {
  if (!element) return "";

  switch (field) {
    case "textContent":
      return element.textContent ?? "";
    case "title":
      return element.title;
    case "aria-label":
    case "data-comparison":
      return element.getAttribute(field) ?? "";
    case "placeholder":
      return (element as HTMLInputElement).placeholder;
    case "id":
      return element.id;
    case "className":
      return element.className;
  }
};

const writeDomField = (
  element: HTMLElement,
  field: Xml2476DomField,
  value: string,
) => {
  switch (field) {
    case "textContent":
      element.textContent = value;
      break;
    case "title":
      element.title = value;
      break;
    case "aria-label":
    case "data-comparison":
      element.setAttribute(field, value);
      break;
    case "placeholder":
      (element as HTMLInputElement).placeholder = value;
      break;
    case "id":
      element.id = value;
      break;
    case "className":
      element.className = value;
      break;
  }
};

const makeVerificationReport = (): Xml2476Verification[] =>
  expectedFixtures.map((fixture) => {
    const element = document.querySelector<HTMLElement>(
      `[data-case-id="${fixture.id}"]`,
    );
    const fields = fixture.expectations.map((expectation) => {
      const actual = readDomField(element, expectation.field);
      return {
        field: expectation.field,
        expectedJson: JSON.stringify(expectation.value),
        actualJson: JSON.stringify(actual),
        expectedLength: expectation.value.length,
        actualLength: actual.length,
        characterCodes: characterCodes(actual),
        matches: element !== null && actual === expectation.value,
      };
    });
    const primary = fields[0];

    return {
      id: fixture.id,
      field: primary.field,
      expectedJson: primary.expectedJson,
      actualJson: primary.actualJson,
      expectedLength: primary.expectedLength,
      actualLength: primary.actualLength,
      characterCodes: primary.characterCodes,
      fields,
      matches: fields.every((field) => field.matches),
    };
  });

const createTarget = (
  fixture: Xml2476Fixture,
  onFixtureClick: (caseId: string) => void,
) => {
  const element = document.createElement(fixture.element);

  if (element instanceof HTMLButtonElement) {
    element.type = "button";
    element.className =
      "xml2476-target min-h-11 whitespace-pre-wrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-left font-medium text-slate-900 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-cyan-400 dark:hover:bg-slate-700";
  }

  if (element instanceof HTMLInputElement) {
    element.type = "text";
    element.className =
      "xml2476-target min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white";
    element.autocomplete = "off";
  }

  if (element instanceof HTMLSelectElement) {
    element.className =
      "xml2476-target min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white";
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select an insured suffix";
    const option = document.createElement("option");
    option.value = "Jr.";
    option.textContent = "Jr.";
    element.append(placeholderOption, option);
  }

  element.dataset.caseId = fixture.id;
  if (!fixture.expectations.some(({ field }) => field === "id")) {
    element.id = `xml2476-${fixture.id.toLowerCase()}`;
  }
  if (fixture.visibleText) element.textContent = fixture.visibleText;
  fixture.expectations.forEach(({ field, value }) =>
    writeDomField(element, field, value),
  );
  element.addEventListener("click", () => onFixtureClick(fixture.id));

  return element;
};

const appendFixtureRow = (
  container: HTMLElement,
  fixture: Xml2476Fixture,
  onFixtureClick: (caseId: string) => void,
) => {
  const row = document.createElement("article");
  row.className =
    "rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50";

  const label = document.createElement("div");
  label.className = "mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1";
  const caseId = document.createElement("code");
  caseId.className =
    "rounded bg-cyan-100 px-2 py-1 text-xs font-bold text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200";
  caseId.textContent = fixture.id;
  const description = document.createElement("span");
  description.className = "text-sm text-slate-600 dark:text-slate-300";
  description.textContent = fixture.description;
  label.append(caseId, description);

  const target = createTarget(fixture, onFixtureClick);
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement
  ) {
    const semanticLabel = document.createElement("label");
    semanticLabel.htmlFor = target.id;
    semanticLabel.className = "mb-2 block text-sm font-medium";
    semanticLabel.textContent = `${fixture.id} test control`;
    row.append(label, semanticLabel, target);
  } else {
    row.append(label, target);
  }
  container.append(row);
};

const appendRelativeFixture = (
  container: HTMLElement,
  fixture: Xml2476Fixture,
  onFixtureClick: (caseId: string) => void,
) => {
  const label = document.createElement("div");
  label.className = "mb-2 mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1";
  const caseId = document.createElement("code");
  caseId.className =
    "rounded bg-violet-100 px-2 py-1 text-xs font-bold text-violet-900 dark:bg-violet-950 dark:text-violet-200";
  caseId.textContent = fixture.id;
  const description = document.createElement("span");
  description.className = "text-sm text-slate-600 dark:text-slate-300";
  description.textContent = fixture.description;
  label.append(caseId, description);

  const wrapper = document.createElement("div");
  wrapper.className =
    "xml2476-target-wrapper rounded-xl border border-dashed border-violet-300 bg-violet-50 p-4 dark:border-violet-700 dark:bg-violet-950/20";
  wrapper.append(createTarget(fixture, onFixtureClick));
  container.append(label, wrapper);
};

const appendSelectorFixture = (
  container: HTMLElement,
  fixture: Xml2476Fixture,
  onFixtureClick: (caseId: string) => void,
) => {
  if (fixture.id !== "S01") {
    appendFixtureRow(container, fixture, onFixtureClick);
    return;
  }

  const row = document.createElement("article");
  row.className =
    "rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50";
  const label = document.createElement("div");
  label.className = "mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1";
  const caseId = document.createElement("code");
  caseId.className =
    "rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200";
  caseId.textContent = fixture.id;
  const description = document.createElement("span");
  description.className = "text-sm text-slate-600 dark:text-slate-300";
  description.textContent = fixture.description;
  label.append(caseId, description);

  const shell = document.createElement("div");
  shell.className = "selector2476-shell";
  shell.setAttribute("data-scope", 'QA "quoted" space');
  const directChild = document.createElement("div");
  directChild.className = "selector2476-direct-child";
  directChild.setAttribute("data-state", "ready to track");
  directChild.append(createTarget(fixture, onFixtureClick));
  shell.append(directChild);
  row.append(label, shell);
  container.append(row);
};

export const Product2476XmlValuesPage = () => {
  const beforeRelativeRef = useRef<HTMLDivElement>(null);
  const relativeRef = useRef<HTMLElement>(null);
  const afterRelativeRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [clickLog, setClickLog] = useState<string[]>([]);
  const [verification, setVerification] = useState<
    Xml2476Verification[] | null
  >(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Product 2476 – XML-sensitive tracking fixtures";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useLayoutEffect(() => {
    const containers = [
      beforeRelativeRef.current,
      relativeRef.current,
      afterRelativeRef.current,
      selectorRef.current,
    ];
    if (containers.some((container) => !container)) return;

    const recordClick = (caseId: string) =>
      setClickLog((current) => [...current, caseId]);

    expectedFixtures.forEach((fixture) => {
      if (fixture.group === "text-before-relative") {
        appendFixtureRow(beforeRelativeRef.current!, fixture, recordClick);
      } else if (fixture.group === "relative-xpath") {
        appendRelativeFixture(relativeRef.current!, fixture, recordClick);
      } else if (fixture.group === "text-after-relative") {
        appendFixtureRow(afterRelativeRef.current!, fixture, recordClick);
      } else {
        appendSelectorFixture(selectorRef.current!, fixture, recordClick);
      }
    });

    window.verifyXml2476Fixtures = makeVerificationReport;

    return () => {
      containers.forEach((container) => container?.replaceChildren());
      delete window.verifyXml2476Fixtures;
    };
  }, []);

  const runVerification = () => {
    setVerification(window.verifyXml2476Fixtures?.() ?? []);
  };

  const allVerified =
    verification !== null && verification.every((item) => item.matches);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 md:p-6">
      <header className="overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              TrueTest QA · Product 2476
            </p>
            <h1 className="text-2xl font-semibold text-white md:text-4xl">
              XML-sensitive tracking fixtures
            </h1>
            <p className="mt-3 text-slate-300">
              Deterministic targets for validating tracking values and generated
              Katalon Object Repository XML.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
              <strong className="block text-2xl text-cyan-300">11</strong>
              XML cases
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
              <strong className="block text-2xl text-amber-300">5</strong>
              Selector cases
            </div>
          </div>
        </div>
      </header>

      <aside className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100">
        <strong>Tracker boundary:</strong> this AUT offers stable locator
        candidates. The TrueTest tracker decides which relative XPath, CSS, and
        smart locators appear in captured tracking data.
      </aside>

      <section aria-labelledby="xml-target-heading" className="card p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <MousePointerClick className="h-6 w-6 text-cyan-600" />
          <div>
            <h2 id="xml-target-heading" className="text-xl font-semibold">
              XML-sensitive targets
            </h2>
            <p className="text-sm">
              Click T01 through T11 in order. Case labels sit outside tracked
              targets.
            </p>
          </div>
        </div>
        <div ref={beforeRelativeRef} className="grid gap-3 md:grid-cols-2" />

        <section
          ref={relativeRef}
          data-fixture-group="relative-xpath"
          aria-label="Relative XPath fixture group"
          className="my-4 rounded-2xl border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900 dark:bg-violet-950/10"
        />

        <div ref={afterRelativeRef} className="grid gap-3 md:grid-cols-2" />
      </section>

      <section aria-labelledby="selector-heading" className="card p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <ListChecks className="h-6 w-6 text-amber-600" />
          <div>
            <h2 id="selector-heading" className="text-xl font-semibold">
              Selector regression targets
            </h2>
            <p className="text-sm">
              Stable CSS, placeholder-ready IDs, semantic fields, and an escaped
              digit-leading ID.
            </p>
          </div>
        </div>
        <div ref={selectorRef} className="grid gap-3 md:grid-cols-2" />
      </section>

      <section aria-labelledby="debug-heading" className="card p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="debug-heading" className="text-xl font-semibold">
              Fixture debug panel
            </h2>
            <p className="text-sm">
              JSON rendering makes spaces and line endings visible without
              changing the source values.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            data-test="verify-xml2476-fixtures"
            onClick={runVerification}
          >
            <ClipboardCheck className="h-4 w-4" /> Verify fixtures
          </button>
        </div>

        {verification && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm font-medium ${
              allVerified
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200"
            }`}
            role="status"
            data-test="xml2476-verification-status"
          >
            <CheckCircle2 className="h-5 w-5" />
            {allVerified
              ? "All fixture values match."
              : "One or more fixture values do not match."}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs dark:divide-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-3 py-3">Case</th>
                <th className="px-3 py-3">DOM field</th>
                <th className="px-3 py-3">Value (JSON.stringify)</th>
                <th className="px-3 py-3">Length</th>
                <th className="px-3 py-3">Character codes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {expectedFixtures.flatMap((fixture) =>
                fixture.expectations.map((expectation) => (
                  <tr key={`${fixture.id}-${expectation.field}`}>
                    <td className="px-3 py-3 font-bold">{fixture.id}</td>
                    <td className="px-3 py-3 font-mono">{expectation.field}</td>
                    <td className="whitespace-pre px-3 py-3 font-mono text-cyan-800 dark:text-cyan-300">
                      {JSON.stringify(expectation.value)}
                    </td>
                    <td className="px-3 py-3 font-mono">
                      {expectation.value.length}
                    </td>
                    <td className="max-w-md px-3 py-3 font-mono text-slate-500 dark:text-slate-400">
                      [{characterCodes(expectation.value).join(", ")}]
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>

        {verification && (
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">
              Verification JSON
            </summary>
            <pre
              className="mt-2 max-h-96 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-cyan-100"
              data-test="xml2476-verification-json"
            >
              {JSON.stringify(verification, null, 2)}
            </pre>
          </details>
        )}
      </section>

      <section aria-labelledby="click-log-heading" className="card p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="click-log-heading" className="text-xl font-semibold">
              Local click log
            </h2>
            <p className="text-sm">Recommended order: T01–T11, then S01–S05.</p>
          </div>
          <button
            type="button"
            className="btn border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
            onClick={() => setClickLog([])}
          >
            Clear log
          </button>
        </div>
        <ol
          className="min-h-14 rounded-xl bg-slate-950 p-4 font-mono text-sm text-cyan-200"
          data-test="xml2476-click-log"
        >
          {clickLog.length === 0 ? (
            <li className="list-none text-slate-400">No fixture clicks yet.</li>
          ) : (
            clickLog.map((caseId, index) => (
              <li key={`${caseId}-${index}`} data-click-case-id={caseId}>
                {String(index + 1).padStart(2, "0")}. {caseId}
              </li>
            ))
          )}
        </ol>
      </section>
    </div>
  );
};
