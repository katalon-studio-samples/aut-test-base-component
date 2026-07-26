import { useEffect, useMemo, useRef, useState } from "react";
import { Clipboard, RefreshCw, RotateCcw, Trash2 } from "lucide-react";

type Mechanism =
  | "aria-label"
  | "label-for"
  | "aria-labelledby"
  | "nearby-context";

type TestDefinition = {
  key: string;
  title: string;
  priority: string;
  mechanism: Mechanism;
  groups: Array<string | null>;
  select?: boolean;
  negative?: boolean;
};

type ControlModel = {
  testKey: string;
  groupIndex: number;
  groupLabel: string | null;
  name: string;
  inputIds: string[];
  textIds: string[];
};

type FixtureModel = {
  generation: number;
  controls: ControlModel[];
};

type LogEvent = {
  timestamp: string;
  testCaseType: string;
  groupLabel: string;
  selectedOptionLabel: string;
  dynamicElementId: string;
  dynamicName: string;
  semanticMechanism: Mechanism;
};

const definitions: TestDefinition[] = [
  {
    key: "aria",
    title: "Dynamic radio groups using aria-label",
    priority: "Priority 1",
    mechanism: "aria-label",
    groups: [
      "Will you be paying this employee a LUMP Sum?",
      "Is this an Internship?",
    ],
  },
  {
    key: "label",
    title: "Dynamic radio groups using label[for]",
    priority: "Priority 2",
    mechanism: "label-for",
    groups: [
      "Employee is eligible for benefits?",
      "Employee is working remotely?",
    ],
  },
  {
    key: "labelledby",
    title: "Radio groups using aria-labelledby",
    priority: "Priority 3",
    mechanism: "aria-labelledby",
    groups: [
      "Employee requires sponsorship?",
      "Employee has completed orientation?",
    ],
  },
  {
    key: "nearby",
    title: "Nearby-label-only controls",
    priority: "Fallback challenge",
    mechanism: "nearby-context",
    groups: [
      "Employee has management responsibilities?",
      "Employee has direct reports?",
    ],
  },
  {
    key: "select",
    title: "Select controls",
    priority: "Select matching",
    mechanism: "label-for",
    groups: ["Employment type", "Payment frequency"],
    select: true,
  },
  {
    key: "negative",
    title: "Negative case: intentionally ambiguous",
    priority: "Negative case",
    mechanism: "nearby-context",
    groups: [null, null],
    negative: true,
  },
];

const definitionByKey = new Map(definitions.map((item) => [item.key, item]));

const dynamicId = () => {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return `WD01${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
    .slice(0, 5)}`;
};

const nextGeneration = () => {
  const key = "semantic-fixture-generation";
  const generation = Number(localStorage.getItem(key) || 0) + 1;
  localStorage.setItem(key, String(generation));
  return generation;
};

const createFixture = (generation: number): FixtureModel => {
  const used = new Set<string>();
  const uniqueId = () => {
    let id = dynamicId();
    while (used.has(id)) id = dynamicId();
    used.add(id);
    return id;
  };

  return {
    generation,
    controls: definitions.flatMap((definition) =>
      definition.groups.map((groupLabel, groupIndex) => ({
        testKey: definition.key,
        groupIndex,
        groupLabel,
        name: `WDN${uniqueId().slice(4)}`,
        inputIds: definition.select ? [uniqueId()] : [uniqueId(), uniqueId()],
        textIds:
          definition.key === "labelledby"
            ? [uniqueId(), uniqueId(), uniqueId()]
            : [],
      })),
    ),
  };
};

const controlKey = (control: ControlModel) =>
  `${control.testKey}-${control.groupIndex}`;

export const SemanticFormControlLocatorPage = () => {
  const [fixture, setFixture] = useState(() => createFixture(nextGeneration()));
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, string>>({});
  const [copyStatus, setCopyStatus] = useState("");
  const sectionsRef = useRef<HTMLDivElement>(null);

  const controlsByTest = useMemo(
    () =>
      definitions.map((definition) => ({
        definition,
        controls: fixture.controls.filter(
          (control) => control.testKey === definition.key,
        ),
      })),
    [fixture],
  );

  useEffect(() => {
    const nextSnapshots: Record<string, string> = {};
    sectionsRef.current
      ?.querySelectorAll<HTMLElement>("[data-snapshot-section]")
      .forEach((section) => {
        const clone = section.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("input").forEach((input) => {
          input.removeAttribute("checked");
        });
        clone.querySelectorAll("option").forEach((option) => {
          option.removeAttribute("selected");
        });
        nextSnapshots[section.dataset.snapshotSection || "section"] =
          clone.outerHTML.replace(/></g, ">\n<");
      });
    setSnapshots(nextSnapshots);
  }, [fixture, selections]);

  const recordChange = (
    definition: TestDefinition,
    control: ControlModel,
    optionLabel: string,
    elementId: string,
  ) => {
    setSelections((current) => ({
      ...current,
      [controlKey(control)]: optionLabel,
    }));
    setEvents((current) => [
      ...current,
      {
        timestamp: new Date().toISOString(),
        testCaseType: definition.title,
        groupLabel: control.groupLabel || "(no stable group label)",
        selectedOptionLabel: optionLabel,
        dynamicElementId: elementId,
        dynamicName: control.name,
        semanticMechanism: definition.mechanism,
      },
    ]);
  };

  const regenerate = () => {
    setFixture(createFixture(nextGeneration()));
    setSelections({});
    setEvents([]);
  };

  const resetSelections = () => setSelections({});

  const copySnapshots = async () => {
    try {
      await navigator.clipboard.writeText(
        Object.values(snapshots).join("\n\n"),
      );
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Clipboard unavailable");
    }
    window.setTimeout(() => setCopyStatus(""), 2000);
  };

  const latestEvent = events.at(-1);

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-2 md:p-6">
      <header className="rounded-xl bg-gradient-to-r from-slate-900 to-blue-700 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              AUT · Locator resilience
            </p>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">
              Semantic Form Control Locator Test Fixture
            </h1>
            <p className="mt-2 text-blue-100">
              Stable meaning, disposable element identifiers.
            </p>
          </div>
          <div className="w-fit rounded-full border border-blue-300 bg-blue-800/60 px-4 py-2 text-sm">
            Generation <strong>{fixture.generation}</strong>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={regenerate}
        >
          <RefreshCw className="h-4 w-4" /> Regenerate dynamic IDs
        </button>
        <button
          className="btn border border-gray-300 bg-white dark:bg-gray-800"
          onClick={resetSelections}
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Reset selections
          </span>
        </button>
        <button
          className="btn border border-gray-300 bg-white dark:bg-gray-800"
          onClick={() => setEvents([])}
        >
          <span className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> Clear event log
          </span>
        </button>
      </div>

      <div className="border-l-4 border-blue-600 bg-blue-50 p-4 text-sm text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
        <strong>Test objective:</strong> Capture a control, regenerate
        identifiers, then replay its semantic locator. The same group and option
        should be selected.
      </div>

      <div ref={sectionsRef} className="space-y-5">
        {controlsByTest.map(({ definition, controls }) => (
          <section
            key={definition.key}
            data-snapshot-section={definition.key}
            className={`overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800 ${
              definition.negative
                ? "border-orange-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div
              className={`flex flex-col justify-between gap-3 border-b p-5 md:flex-row md:items-center ${definition.negative ? "bg-orange-50 dark:bg-orange-950/30" : "border-gray-200 dark:border-gray-700"}`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {definition.priority}
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  {definition.title}
                </h2>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                {definition.negative
                  ? "No semantic distinction"
                  : definition.mechanism}
              </span>
            </div>
            <div className="grid divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-gray-700">
              {controls.map((control) => (
                <ControlGroup
                  key={controlKey(control)}
                  definition={definition}
                  control={control}
                  selected={selections[controlKey(control)] || ""}
                  onChange={(option, id) =>
                    recordChange(definition, control, option, id)
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="card overflow-hidden">
        <h2 className="border-b p-5 text-xl font-semibold dark:border-gray-700">
          Test status
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th className="p-3">Group label</th>
                <th className="p-3">Selected</th>
                <th className="p-3">Dynamic ID</th>
                <th className="p-3">Mechanism</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {fixture.controls.map((control) => {
                const definition = definitionByKey.get(control.testKey)!;
                const selected = selections[controlKey(control)];
                return (
                  <tr
                    key={controlKey(control)}
                    className="border-t dark:border-gray-700"
                  >
                    <td className="p-3">
                      {control.groupLabel || "(no stable group label)"}
                    </td>
                    <td className="p-3">{selected || "—"}</td>
                    <td className="p-3 font-mono text-xs">
                      {control.inputIds[0]}
                    </td>
                    <td className="p-3">
                      {definition.negative ? "none" : definition.mechanism}
                    </td>
                    <td
                      className={`p-3 font-bold ${selected ? "text-green-600" : "text-gray-500"}`}
                    >
                      {selected ? "PASS" : "UNTESTED"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card grid gap-5 p-5 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            Event log · {events.length} events
          </h2>
          <ol className="max-h-80 overflow-auto rounded border dark:border-gray-700">
            {events.length === 0 && (
              <li className="p-3 text-sm text-gray-500">
                No interactions recorded.
              </li>
            )}
            {[...events].reverse().map((event, index) => (
              <li
                key={`${event.timestamp}-${index}`}
                className="border-b p-3 text-xs last:border-0 dark:border-gray-700"
              >
                {event.timestamp} · {event.groupLabel} →{" "}
                {event.selectedOptionLabel} ·{" "}
                <span className="font-mono">{event.dynamicElementId}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-semibold">Latest event JSON</h2>
          <pre className="min-h-28 overflow-auto rounded bg-slate-900 p-4 text-xs text-blue-100">
            {JSON.stringify(latestEvent || {}, null, 2)}
          </pre>
        </div>
      </section>

      <details className="card p-5">
        <summary className="cursor-pointer font-semibold">
          Debug panel · current IDs and sanitized DOM snapshots
        </summary>
        <button
          className="btn mt-4 flex items-center gap-2 border border-gray-300"
          onClick={copySnapshots}
        >
          <Clipboard className="h-4 w-4" /> Copy DOM snapshot
        </button>
        <span className="ml-3 text-sm text-green-600" role="status">
          {copyStatus}
        </span>
        <h3 className="mb-2 mt-5 font-semibold">Generated identifiers</h3>
        <pre className="max-h-96 overflow-auto rounded bg-slate-900 p-4 text-xs text-blue-100">
          {JSON.stringify(fixture, null, 2)}
        </pre>
        <h3 className="mb-2 mt-5 font-semibold">Sanitized section snapshots</h3>
        <div className="space-y-4">
          {Object.entries(snapshots).map(([key, snapshot]) => (
            <div key={key}>
              <h4 className="mb-1 text-sm font-semibold">{key}</h4>
              <pre className="max-h-72 overflow-auto rounded bg-slate-900 p-4 text-xs text-blue-100 whitespace-pre-wrap">
                {snapshot}
              </pre>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

type ControlGroupProps = {
  definition: TestDefinition;
  control: ControlModel;
  selected: string;
  onChange: (option: string, id: string) => void;
};

const ControlGroup = ({
  definition,
  control,
  selected,
  onChange,
}: ControlGroupProps) => {
  const groupTextId = control.textIds[0];
  const groupProps =
    definition.key === "aria"
      ? { role: "radiogroup", "aria-label": control.groupLabel || undefined }
      : definition.key === "labelledby"
        ? { role: "radiogroup", "aria-labelledby": groupTextId }
        : {};

  if (definition.select) {
    return (
      <div className="p-6">
        <label
          className="mb-3 block min-h-6 font-semibold"
          htmlFor={control.inputIds[0]}
        >
          {control.groupLabel}
        </label>
        <select
          id={control.inputIds[0]}
          name={control.name}
          className="h-10 w-full max-w-sm rounded border border-gray-400 bg-white px-3 dark:bg-gray-900"
          value={selected ? `option-${selected.slice(-1)}` : ""}
          onChange={(event) => {
            if (event.target.value)
              onChange(
                event.target.options[event.target.selectedIndex].text,
                event.target.id,
              );
          }}
        >
          <option value="">Choose an option</option>
          <option value="option-1">Option 1</option>
          <option value="option-2">Option 2</option>
          <option value="option-3">Option 3</option>
        </select>
      </div>
    );
  }

  return (
    <div className="p-6" {...groupProps}>
      {control.groupLabel && (
        <div id={groupTextId} className="mb-4 min-h-11 font-semibold">
          {control.groupLabel}
        </div>
      )}
      <div className="flex gap-7">
        {["Yes", "No"].map((option, optionIndex) => {
          const input = (
            <input
              className="h-5 w-5 accent-blue-600"
              type="radio"
              id={control.inputIds[optionIndex]}
              name={control.name}
              value={definition.negative ? "option" : option.toLowerCase()}
              checked={selected === option}
              aria-label={definition.key === "aria" ? option : undefined}
              aria-labelledby={
                definition.key === "labelledby"
                  ? control.textIds[optionIndex + 1]
                  : undefined
              }
              onChange={(event) => onChange(option, event.currentTarget.id)}
            />
          );
          if (definition.key === "label") {
            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2"
                htmlFor={control.inputIds[optionIndex]}
              >
                {input}
                {option}
              </label>
            );
          }
          return (
            <span
              key={option}
              className="flex cursor-pointer items-center gap-2"
            >
              {input}
              <span
                id={
                  definition.key === "labelledby"
                    ? control.textIds[optionIndex + 1]
                    : undefined
                }
              >
                {option}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
