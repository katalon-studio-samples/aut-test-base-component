import React, { useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Archive,
  Download,
  Edit,
  MoreHorizontal,
  Save,
  Search,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";

type AppVersion = "A" | "B";
type LogEntry = {
  action: string;
  detail: string;
};
type ScenarioItem = {
  id: number;
  page: string;
  kind: "Positive" | "Negative" | "Ambiguous";
  object: string;
  versionA: string;
  versionB: string;
  expected: string;
};

const textInputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400";
const buttonBaseClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60";
const primaryButtonA = `${buttonBaseClass} btn-primary bg-blue-700 text-white hover:bg-blue-800`;
const primaryButtonB = `${buttonBaseClass} button-main bg-emerald-700 text-white hover:bg-emerald-800`;
const secondaryButtonClass = `${buttonBaseClass} border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`;
const dangerButtonClass = `${buttonBaseClass} bg-red-700 text-white hover:bg-red-800`;
const panelClass =
  "rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800";
const labelClass =
  "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200";

const scenarioItems: ScenarioItem[] = [
  {
    id: 1,
    page: "Login",
    kind: "Positive",
    object: "Username input",
    versionA: "id=cr-input-abc-1",
    versionB: "id=cr-input-def-2",
    expected: "Same TestObject; label and placeholder stay Username.",
  },
  {
    id: 2,
    page: "Query Template",
    kind: "Positive",
    object: "Save button",
    versionA: "class=btn-primary",
    versionB: "class=button-main",
    expected: "Same TestObject; action remains Save template.",
  },
  {
    id: 3,
    page: "Login",
    kind: "Positive",
    object: "Password input",
    versionA: "Password field is second form control.",
    versionB: "Security wrapper is inserted before it, shifting XPath.",
    expected: "Same TestObject; label remains Password.",
  },
  {
    id: 4,
    page: "Query Template",
    kind: "Positive",
    object: "Name input",
    versionA: "Field is rendered directly in the grid.",
    versionB: "Field is inside .action-wrapper.",
    expected: "Same TestObject; label remains Name.",
  },
  {
    id: 5,
    page: "Query Template",
    kind: "Positive",
    object: "Template Save button",
    versionA: "Button is in the form footer.",
    versionB: "Button moves into sticky footer.",
    expected: "Same TestObject; same form and save action.",
  },
  {
    id: 6,
    page: "Query Template",
    kind: "Positive",
    object: "Template Save button",
    versionA: "Visible text is Save.",
    versionB: "Visible text is Save changes.",
    expected: "Same TestObject; same submit intent.",
  },
  {
    id: 7,
    page: "Dashboard",
    kind: "Positive",
    object: "Download button",
    versionA: "Text-only Download button.",
    versionB: "Download icon is added before same text.",
    expected: "Same TestObject.",
  },
  {
    id: 8,
    page: "Profile Settings",
    kind: "Positive",
    object: "Delete control",
    versionA: "Text button Delete.",
    versionB: "Icon-only button with aria-label=Delete.",
    expected: "Same TestObject because accessible name is stable.",
  },
  {
    id: 9,
    page: "Profile Settings",
    kind: "Positive",
    object: "Email input",
    versionA: "placeholder=Enter email",
    versionB: "placeholder=name@example.com",
    expected: "Same TestObject; label Email is stable.",
  },
  {
    id: 10,
    page: "Dashboard",
    kind: "Positive",
    object: "Submit button",
    versionA: "Text is Submit.",
    versionB: "Text is SUBMIT.",
    expected: "Same TestObject; casing only changed.",
  },
  {
    id: 11,
    page: "Profile Settings",
    kind: "Positive",
    object: "Modal close action",
    versionA: "Button text Cancel.",
    versionB: "Button text Close.",
    expected: "Borderline same TestObject; same close intent.",
  },
  {
    id: 12,
    page: "Study Queries",
    kind: "Positive",
    object: "Search input",
    versionA: "input type=text",
    versionB: "input type=search",
    expected: "Same TestObject; label/aria remains Search.",
  },
  {
    id: 13,
    page: "Checkout",
    kind: "Positive",
    object: "Shipping address input",
    versionA: "id=ship-address-1a, original CSS.",
    versionB: "id=ship-address-9b, layout/CSS changed.",
    expected: "Same TestObject; data-testid=shipping-address remains stable.",
  },
  {
    id: 14,
    page: "Admin Permissions",
    kind: "Positive",
    object: "Permission settings button",
    versionA: "Toolbar button on the left side.",
    versionB: "Toolbar order reversed; button moves right.",
    expected: "Same TestObject; aria-label stays Permission settings.",
  },
  {
    id: 15,
    page: "Study Queries",
    kind: "Positive",
    object: "Query table row actions",
    versionA: "Rows ordered Login timeout, Missing lab, Consent gap.",
    versionB: "Rows reordered Consent gap, Login timeout, Missing lab.",
    expected: "Same row-action family, matched by row identity.",
  },
  {
    id: 16,
    page: "Study Queries",
    kind: "Positive",
    object: "Query row Edit buttons",
    versionA: "No pagination above table.",
    versionB: "Pagination added above table, XPath shifts.",
    expected: "Same row Edit actions.",
  },
  {
    id: 17,
    page: "Study Queries",
    kind: "Positive",
    object: "Edit query form",
    versionA: "Edit opens inline panel.",
    versionB: "Edit opens modal dialog.",
    expected: "Same logical edit form; labels remain stable.",
  },
  {
    id: 18,
    page: "Profile Settings",
    kind: "Positive",
    object: "Timezone input",
    versionA: "Plain advanced settings section.",
    versionB: "Field is inside expanded accordion.",
    expected: "Same TestObject; label Timezone stays stable.",
  },
  {
    id: 19,
    page: "Profile Settings",
    kind: "Positive",
    object: "Email input",
    versionA: "Visible in main profile section.",
    versionB: "Moved into Profile tab panel.",
    expected: "Same TestObject; same profile email purpose.",
  },
  {
    id: 20,
    page: "Study Queries",
    kind: "Positive",
    object: "Assignee dropdown",
    versionA: "Dropdown inline in the page.",
    versionB: "Dropdown rendered under #portal-root.",
    expected: "Same TestObject; label and values remain Assignee/Mina/Nora.",
  },
  {
    id: 21,
    page: "Query Template",
    kind: "Negative",
    object: "Three generated text inputs",
    versionA: "ID, Name, Description.",
    versionB: "Case ID, Owner, Resolution.",
    expected: "Do not match; field meaning changed.",
  },
  {
    id: 22,
    page: "Query Template",
    kind: "Negative",
    object: "Primary action button",
    versionA: "Submit.",
    versionB: "Archive.",
    expected: "Do not match; action meaning changed.",
  },
  {
    id: 23,
    page: "Profile Settings + Admin Permissions",
    kind: "Negative",
    object: "Save buttons",
    versionA: "Profile Save.",
    versionB: "Permissions Save permissions exists on another page.",
    expected: "Do not merge across unrelated page context.",
  },
  {
    id: 24,
    page: "Admin Permissions",
    kind: "Negative",
    object: "Service checkboxes",
    versionA: "navigator-service, elearning-service, participant-service.",
    versionB: "Same group and structure.",
    expected: "Keep distinct by stable data-testid and label.",
  },
  {
    id: 25,
    page: "Study Queries",
    kind: "Negative",
    object: "Repeated Edit buttons",
    versionA: "Edit button per query row.",
    versionB: "Edit buttons remain repeated after row reorder.",
    expected: "Treat as row collection actions, not one static object.",
  },
  {
    id: 26,
    page: "Admin Permissions",
    kind: "Negative",
    object: "Trash icon buttons",
    versionA: "aria-label=Delete user.",
    versionB: "aria-label=Remove role.",
    expected: "Do not match; accessible action differs.",
  },
  {
    id: 27,
    page: "Study Queries",
    kind: "Negative",
    object: "Search input purpose",
    versionA: "placeholder=Search users.",
    versionB: "placeholder=Search roles.",
    expected: "Review/no-match risk; business object changed.",
  },
  {
    id: 28,
    page: "Profile Settings",
    kind: "Negative",
    object: "Notification/billing control",
    versionA: "Enable notifications checkbox.",
    versionB: "Enable billing switch concept.",
    expected: "Do not match; business meaning changes.",
  },
  {
    id: 29,
    page: "Admin Permissions",
    kind: "Negative",
    object: "Users link",
    versionA: "href=/admin/users.",
    versionB: "href=/admin/roles.",
    expected: "Treat as changed action/destination.",
  },
  {
    id: 30,
    page: "Query Template",
    kind: "Negative",
    object: "Generated ID fields",
    versionA: "Similar generated IDs with original labels.",
    versionB: "Similar generated IDs with different labels.",
    expected: "Do not match based only on ID pattern.",
  },
  {
    id: 31,
    page: "Dashboard",
    kind: "Ambiguous",
    object: "Toolbar icon buttons",
    versionA: "Three icon-only buttons without text/aria.",
    versionB: "Same weak signal pattern.",
    expected: "Ambiguous/manual review risk.",
  },
  {
    id: 32,
    page: "Dashboard",
    kind: "Ambiguous",
    object: "Repeated Open buttons",
    versionA: "Open buttons in card list.",
    versionB: "Open buttons remain but card titles changed.",
    expected: "Collection family or ambiguous, not one exact object.",
  },
  {
    id: 33,
    page: "Dashboard",
    kind: "Ambiguous",
    object: "Dynamic cards",
    versionA: "Titles Trial enrollment, Monitor review, Safety query.",
    versionB: "Titles Enrollment delta, Review queue, Safety signal.",
    expected: "Do not over-merge if title is identity.",
  },
  {
    id: 34,
    page: "Dashboard",
    kind: "Ambiguous",
    object: "Low-signal icon control",
    versionA: "Only generated class x92_a plus icon.",
    versionB: "Only generated class z77_b plus icon.",
    expected: "Low confidence/manual review.",
  },
  {
    id: 35,
    page: "Query Template",
    kind: "Ambiguous",
    object: "Duplicate Save buttons",
    versionA: "One hidden Save and one visible Save.",
    versionB: "Same duplicate pattern around changed Save UI.",
    expected: "Visible target should be selected, hidden duplicate ignored.",
  },
];

const queryRowsA = [
  { id: "q-100", issue: "Login timeout", owner: "Mina", status: "Pending" },
  { id: "q-200", issue: "Missing lab", owner: "Arun", status: "Approved" },
  { id: "q-300", issue: "Consent gap", owner: "Nora", status: "Pending" },
];

const queryRowsB = [
  { id: "query-row-300b", issue: "Consent gap", owner: "Nora", status: "Pending" },
  { id: "query-row-100b", issue: "Login timeout", owner: "Mina", status: "Pending" },
  { id: "query-row-200b", issue: "Missing lab", owner: "Arun", status: "Approved" },
];

const cardTitlesA = ["Trial enrollment", "Monitor review", "Safety query"];
const cardTitlesB = ["Enrollment delta", "Review queue", "Safety signal"];

function getVersion(searchParams: URLSearchParams): AppVersion {
  return searchParams.get("version")?.toUpperCase() === "B" ? "B" : "A";
}

function useActionLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const addLog = (action: string, detail: string) => {
    setEntries((current) => [{ action, detail }, ...current].slice(0, 10));
  };

  return { entries, addLog };
}

function VersionBadge({ version }: { version: AppVersion }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className="rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-gray-900"
        data-testid="true-test-version"
      >
        Version {version}
      </span>
      <a className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300" href="?version=A">
        Open A
      </a>
      <a className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300" href="?version=B">
        Open B
      </a>
    </div>
  );
}

function ActionLog({ entries }: { entries: LogEntry[] }) {
  return (
    <section className={panelClass} aria-label="Interaction results">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        Interaction results
      </h2>
      <div
        className="min-h-24 rounded-md border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
        data-testid="interaction-results"
        aria-live="polite"
      >
        {entries.length === 0 ? (
          <p>No actions recorded yet.</p>
        ) : (
          <ol className="space-y-1">
            {entries.map((entry, index) => (
              <li key={`${entry.action}-${index}`}>
                <strong>{entry.action}:</strong> {entry.detail}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function PageShell({
  version,
  routeName,
  children,
  entries,
}: {
  version: AppVersion;
  routeName: string;
  children: React.ReactNode;
  entries: LogEntry[];
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-3">
        <VersionBadge version={version} />
        <div>
          <h1 className="text-2xl font-bold text-gray-950 dark:text-white">
            TrueTest TestObject Matching: {routeName}
          </h1>
          <p className="mt-2 max-w-4xl text-sm text-gray-600 dark:text-gray-300">
            Static sample UI for recording the same business workflows across two
            implementation versions. Version B changes IDs, classes, wrappers,
            order, placement, and selected text while preserving intent except
            where the scenario is explicitly negative.
          </p>
        </div>
      </header>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">{children}</div>
        <aside className="space-y-6">
          <ScenarioReference routeName={routeName} />
          <ActionLog entries={entries} />
        </aside>
      </div>
    </div>
  );
}

function ScenarioReference({ routeName }: { routeName: string }) {
  const currentPageItems = scenarioItems.filter((item) =>
    item.page.includes(routeName),
  );
  const otherItems = scenarioItems.filter(
    (item) => !item.page.includes(routeName),
  );
  const groupedOtherItems = otherItems.reduce<Record<string, ScenarioItem[]>>(
    (groups, item) => {
      groups[item.page] = [...(groups[item.page] || []), item];
      return groups;
    },
    {},
  );

  return (
    <section className={panelClass} aria-label="Scenario reference">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        Scenario map
      </h2>
      <div className="space-y-5">
        <ScenarioSection
          title={`Changes on ${routeName}`}
          items={currentPageItems}
          emptyText="No scenario is mapped to this route."
        />
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Other pages
          </h3>
          <div className="space-y-3">
            {Object.entries(groupedOtherItems).map(([page, items]) => (
              <ScenarioSection key={page} title={page} items={items} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScenarioSection({
  title,
  items,
  compact = false,
  emptyText,
}: {
  title: string;
  items: ScenarioItem[];
  compact?: boolean;
  emptyText?: string;
}) {
  return (
    <div>
      <h3
        className={
          compact
            ? "mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            : "mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        }
      >
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-gray-600 dark:text-gray-300">{emptyText}</p>
      ) : (
        <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-200">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.id}. {item.object}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    item.kind === "Positive"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                      : item.kind === "Negative"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                  }`}
                >
                  {item.kind}
                </span>
              </div>
              <div>
                <strong>A:</strong> {item.versionA}
              </div>
              <div>
                <strong>B:</strong> {item.versionB}
              </div>
              {!compact && (
                <div className="mt-1 text-gray-600 dark:text-gray-300">
                  <strong>Expected:</strong> {item.expected}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
  dataTestId,
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  dataTestId?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className={textInputClass}
        data-testid={dataTestId}
      />
    </div>
  );
}

function LoginPage({ version, addLog }: { version: AppVersion; addLog: (action: string, detail: string) => void }) {
  const usernameId = version === "A" ? "cr-input-abc-1" : "cr-input-def-2";

  return (
    <section className={panelClass} data-scenario="flow-login">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Login
      </h2>
      <form
        className={version === "A" ? "space-y-4 auth-card-a" : "space-y-4 auth-panel-b"}
        onSubmit={(event) => {
          event.preventDefault();
          addLog("Login", `Signed in from Version ${version}`);
        }}
      >
        <Field id={usernameId} label="Username" placeholder="Enter username" />
        {version === "B" && <div className="rounded-md bg-gray-50 p-2 text-xs text-gray-500 dark:bg-gray-900">Security wrapper inserted above password</div>}
        <div className={version === "A" ? "password-row" : "password-shell password-row-v2"}>
          <Field id={version === "A" ? "cr-pass-abc-1" : "cr-pass-def-2"} label="Password" placeholder="Enter password" type="password" />
        </div>
        <button className={version === "A" ? primaryButtonA : primaryButtonB} type="submit">
          Sign in
        </button>
      </form>
    </section>
  );
}

function QueryTemplatePage({ version, addLog }: { version: AppVersion; addLog: (action: string, detail: string) => void }) {
  const saveButton = (
    <button
      className={version === "A" ? primaryButtonA : primaryButtonB}
      data-testid="query-template-save"
      onClick={() => addLog("Query template", "Saved template with Issue and Name")}
      type="button"
    >
      {version === "A" ? <Save className="h-4 w-4" aria-hidden="true" /> : null}
      {version === "A" ? "Save" : "Save changes"}
    </button>
  );

  return (
    <div className="space-y-6">
      <section className={panelClass} data-scenario="flow-create-query-template">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Create query template
        </h2>
        <div className={version === "A" ? "grid gap-4 md:grid-cols-2" : "query-layout-v2 grid gap-4 md:grid-cols-2"}>
          <Field id={version === "A" ? "issue-gen-11" : "issue-gen-91"} label="Issue" placeholder="Describe issue" />
          <div className={version === "A" ? "template-field-name" : "outer-wrap-v2"}>
            {version === "B" ? (
              <div className="action-wrapper">
                <Field id="name-gen-99" label="Name" placeholder="Template name" />
              </div>
            ) : (
              <Field id="name-gen-42" label="Name" placeholder="Template name" />
            )}
          </div>
        </div>
        {version === "A" ? (
          <div className="mt-5 flex justify-end">{saveButton}</div>
        ) : (
          <div className="sticky bottom-0 -mx-4 mt-5 flex justify-end border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="action-wrapper">{saveButton}</div>
          </div>
        )}
      </section>

      <section className={panelClass} data-scenario="negative-structure-different-meaning">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Negative field meaning
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field id={version === "A" ? "auto-field-110" : "auto-field-210"} label={version === "A" ? "ID" : "Case ID"} placeholder={version === "A" ? "Template ID" : "Case identifier"} />
          <Field id={version === "A" ? "auto-field-111" : "auto-field-211"} label={version === "A" ? "Name" : "Owner"} placeholder={version === "A" ? "Name" : "Owner name"} />
          <Field id={version === "A" ? "auto-field-112" : "auto-field-212"} label={version === "A" ? "Description" : "Resolution"} placeholder={version === "A" ? "Description" : "Resolution note"} />
        </div>
        <div className="mt-4">
          <button
            className={version === "A" ? primaryButtonA : `${buttonBaseClass} bg-gray-700 text-white hover:bg-gray-800`}
            onClick={() => addLog("Negative action", version === "A" ? "Submit clicked" : "Archive clicked")}
            type="button"
          >
            {version === "A" ? "Submit" : <><Archive className="h-4 w-4" aria-hidden="true" />Archive</>}
          </button>
        </div>
      </section>

      <section className={panelClass} data-scenario="hidden-duplicate-save">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Hidden duplicate target
        </h2>
        <button className={primaryButtonA} type="button" hidden>
          Save
        </button>
        <button className={version === "A" ? primaryButtonA : primaryButtonB} type="button" onClick={() => addLog("Visible Save", "Visible Save target clicked")}>
          Save
        </button>
      </section>
    </div>
  );
}

function StudiesQueriesPage({ version, addLog }: { version: AppVersion; addLog: (action: string, detail: string) => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const rows = version === "A" ? queryRowsA : queryRowsB;
  const filterType = version === "A" ? "text" : "search";
  const statusButton = (status: string, issue: string) => (
    <button
      className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-200"
      onClick={() => addLog("Status", `${status} selected for ${issue}`)}
      type="button"
    >
      {status}
    </button>
  );

  return (
    <div className="space-y-6">
      <section className={panelClass} data-scenario="flow-filter-queries">
        <div className={version === "A" ? "mb-4 flex items-center justify-between" : "mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Study 123 queries
          </h2>
          <div className={version === "A" ? "order-first md:order-none" : "md:order-last"}>
            <label className="sr-only" htmlFor="query-filter-search">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input
                id="query-filter-search"
                type={filterType}
                className={`${textInputClass} pl-9`}
                placeholder={version === "A" ? "Search users" : "Search roles"}
                aria-label="Search"
                onChange={(event) => addLog("Filter", `Search changed to ${event.currentTarget.value || "(empty)"}`)}
              />
            </div>
          </div>
        </div>

        {version === "B" && (
          <nav className="mb-3 flex gap-2" aria-label="Query pagination">
            <button className={secondaryButtonClass} type="button">Previous</button>
            <button className={secondaryButtonClass} type="button">1</button>
            <button className={secondaryButtonClass} type="button">Next</button>
          </nav>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700" data-testid="query-results-table">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="px-3 py-2">Issue</th>
                <th className="px-3 py-2">Owner</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map((row) => (
                <tr key={row.id} id={row.id} data-row-key={row.issue.toLowerCase().replaceAll(" ", "-")}>
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{row.issue}</td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-200">{row.owner}</td>
                  <td className="px-3 py-2">{row.status === "Pending" ? statusButton(row.status, row.issue) : row.status}</td>
                  <td className="px-3 py-2">
                    <button
                      className={secondaryButtonClass}
                      onClick={() => {
                        setEditOpen(true);
                        addLog("Edit", `Opened edit form for ${row.issue}`);
                      }}
                      type="button"
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {version === "A" ? (
        <section className={`${panelClass} ${editOpen ? "block" : "hidden"}`} data-scenario="inline-edit-panel">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Edit query
          </h2>
          <Field id="query-edit-title-a" label="Name" placeholder="Query title" />
          <div className="mt-4">
            <button className={primaryButtonA} onClick={() => addLog("Edit", "Saved row edit from inline panel")} type="button">
              Save
            </button>
          </div>
        </section>
      ) : (
        editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Edit query modal">
            <section className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl dark:bg-gray-800" data-scenario="modal-edit-form">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit query</h2>
                <button aria-label="Close" className={secondaryButtonClass} onClick={() => setEditOpen(false)} type="button">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <Field id="query-edit-title-b" label="Name" placeholder="Query title" />
              <div className="mt-4 flex justify-end">
                <button className={primaryButtonB} onClick={() => addLog("Edit", "Saved row edit from modal")} type="button">
                  Save
                </button>
              </div>
            </section>
          </div>
        )
      )}

      <section className={panelClass} data-scenario="portal-like-wrapper">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Assignee dropdown
        </h2>
        {version === "A" ? (
          <div>
            <label className={labelClass} htmlFor="assignee-select-a">Assignee</label>
            <select id="assignee-select-a" className={textInputClass} onChange={(event) => addLog("Assignee", event.currentTarget.value)}>
              <option>Mina</option>
              <option>Nora</option>
            </select>
          </div>
        ) : (
          <div id="portal-root" className="portal-container rounded-md border border-dashed border-gray-300 p-3 dark:border-gray-600">
            <label className={labelClass} htmlFor="assignee-select-b">Assignee</label>
            <select id="assignee-select-b" className={textInputClass} onChange={(event) => addLog("Assignee", event.currentTarget.value)}>
              <option>Mina</option>
              <option>Nora</option>
            </select>
          </div>
        )}
      </section>
    </div>
  );
}

function PermissionsPage({ version, addLog }: { version: AppVersion; addLog: (action: string, detail: string) => void }) {
  const services = [
    ["navigator-service", "Navigator service"],
    ["elearning-service", "E-learning service"],
    ["participant-service", "Participant service"],
  ];

  return (
    <div className="space-y-6">
      <section className={panelClass} data-scenario="flow-permission-update">
        <div className={version === "A" ? "mb-4 flex items-center justify-between" : "mb-4 flex flex-row-reverse items-center justify-between"}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Permissions
          </h2>
          <button
            aria-label="Permission settings"
            className={secondaryButtonClass}
            onClick={() => addLog("ARIA stable", "Permission settings opened")}
            type="button"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-3">
          {services.map(([id, label]) => (
            <label key={id} className="flex items-center gap-3 rounded-md border border-gray-200 p-3 dark:border-gray-700">
              <input
                id={id}
                data-testid={id}
                className="h-4 w-4"
                type="checkbox"
                onChange={(event) => addLog("Permission", `${label}: ${event.currentTarget.checked ? "on" : "off"}`)}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className={version === "A" ? primaryButtonA : primaryButtonB}
            onClick={() => addLog("Permissions", "Saved permission changes")}
            type="button"
          >
            Save permissions
          </button>
        </div>
      </section>

      <section className={panelClass} data-scenario="negative-same-icon-different-aria">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Role actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button aria-label="Delete user" className={dangerButtonClass} onClick={() => addLog("Delete user", "User delete clicked")} type="button">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button aria-label="Remove role" className={dangerButtonClass} onClick={() => addLog("Remove role", "Role remove clicked")} type="button">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            className={secondaryButtonClass}
            href={version === "A" ? "/admin/users?version=A" : "/admin/roles?version=B"}
            onClick={(event) => {
              event.preventDefault();
              addLog("Navigation", version === "A" ? "Users link points to users page" : "Users link points to roles page");
            }}
          >
            Users
          </a>
        </div>
      </section>
    </div>
  );
}

function CheckoutPage({ version, addLog }: { version: AppVersion; addLog: (action: string, detail: string) => void }) {
  return (
    <section className={panelClass} data-scenario="flow-checkout">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Checkout
      </h2>
      <div className={version === "A" ? "grid gap-4 md:grid-cols-2" : "checkout-shell-v2 grid gap-4 md:grid-cols-[1fr_280px]"}>
        <div className="space-y-4">
          <Field id={version === "A" ? "ship-address-1a" : "ship-address-9b"} label="Shipping address" placeholder="Street address" dataTestId="shipping-address" />
          <div>
            <span className={labelClass}>Shipping method</span>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
                <input name="shipping-method" type="radio" value="standard" onChange={() => addLog("Shipping", "Standard selected")} />
                Standard
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
                <input name="shipping-method" type="radio" value="express" onChange={() => addLog("Shipping", "Express selected")} />
                Express
              </label>
            </div>
          </div>
        </div>
        <aside className="space-y-4 rounded-md bg-gray-50 p-4 dark:bg-gray-900">
          <Field id={version === "A" ? "discount-a-1" : "discount-b-8"} label="Discount code" placeholder="Promo code" />
          <button className={secondaryButtonClass} onClick={() => addLog("Discount", "Discount applied")} type="button">
            Apply discount
          </button>
          <button className={version === "A" ? primaryButtonA : primaryButtonB} onClick={() => addLog("Checkout", "Order placed")} type="button">
            Place order
          </button>
        </aside>
      </div>
    </section>
  );
}

function ProfileSettingsPage({ version, addLog }: { version: AppVersion; addLog: (action: string, detail: string) => void }) {
  const [tab, setTab] = useState("profile");
  const settingsField = <Field id={version === "A" ? "profile-email-a" : "profile-email-b"} label="Email" placeholder={version === "A" ? "Enter email" : "name@example.com"} />;

  return (
    <div className="space-y-6">
      <section className={panelClass} data-scenario="profile-save-context">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Profile settings
        </h2>
        {version === "A" ? (
          <div className="space-y-4">{settingsField}</div>
        ) : (
          <div>
            <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700" role="tablist">
              <button className={tab === "profile" ? primaryButtonB : secondaryButtonClass} onClick={() => setTab("profile")} role="tab" type="button">Profile</button>
              <button className={tab === "notifications" ? primaryButtonB : secondaryButtonClass} onClick={() => setTab("notifications")} role="tab" type="button">Notifications</button>
            </div>
            {tab === "profile" && <div role="tabpanel">{settingsField}</div>}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <button className={version === "A" ? primaryButtonA : primaryButtonB} onClick={() => addLog("Profile", "Profile Save clicked")} type="button">
            Save
          </button>
          <button className={secondaryButtonClass} onClick={() => addLog("Profile modal", version === "A" ? "Cancel clicked" : "Close clicked")} type="button">
            {version === "A" ? "Cancel" : "Close"}
          </button>
          <button
            aria-label="Delete"
            className={dangerButtonClass}
            onClick={() => addLog("Profile", "Delete action clicked")}
            type="button"
          >
            {version === "A" ? "Delete" : <Trash2 className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </section>

      <section className={panelClass} data-scenario="accordion-refactor">
        <details open>
          <summary className="cursor-pointer text-lg font-semibold text-gray-900 dark:text-white">
            Advanced settings
          </summary>
          <div className="mt-4">
            <Field id={version === "A" ? "timezone-a" : "timezone-b"} label="Timezone" placeholder="UTC+7" />
          </div>
        </details>
      </section>
    </div>
  );
}

function DashboardPage({ version, addLog }: { version: AppVersion; addLog: (action: string, detail: string) => void }) {
  const titles = version === "A" ? cardTitlesA : cardTitlesB;

  return (
    <div className="space-y-6">
      <section className={panelClass} data-scenario="download-and-submit">
        <div className="flex flex-wrap gap-3">
          <button className={secondaryButtonClass} onClick={() => addLog("Download", "Report downloaded")} type="button">
            {version === "B" && <Download className="h-4 w-4" aria-hidden="true" />}
            Download
          </button>
          <button className={version === "A" ? primaryButtonA : primaryButtonB} onClick={() => addLog("Submit", "Dashboard submit clicked")} type="button">
            {version === "A" ? "Submit" : "SUBMIT"}
          </button>
        </div>
      </section>

      <section className={panelClass} data-scenario="ambiguous-icon-controls">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Ambiguous toolbar
        </h2>
        <div className="flex flex-wrap gap-2">
          <button className="gen-a18 rounded-md border p-2" onClick={() => addLog("Ambiguous", "First unlabeled icon clicked")} type="button"><MoreHorizontal className="h-5 w-5" /></button>
          <button className="gen-a18 rounded-md border p-2" onClick={() => addLog("Ambiguous", "Second unlabeled icon clicked")} type="button"><MoreHorizontal className="h-5 w-5" /></button>
          <button className="gen-a18 rounded-md border p-2" onClick={() => addLog("Ambiguous", "Third unlabeled icon clicked")} type="button"><MoreHorizontal className="h-5 w-5" /></button>
        </div>
      </section>

      <section className={panelClass} data-scenario="repeated-open-buttons">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Review queue
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {titles.map((title) => (
            <article key={title} className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Dynamic card title is the business identity.</p>
              <button className={`${secondaryButtonClass} mt-3`} onClick={() => addLog("Open", `${title} opened`)} type="button">
                Open
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={panelClass} data-scenario="generated-classes-only">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Low-signal control
        </h2>
        <button className={version === "A" ? "x92_a rounded-md bg-gray-700 px-4 py-2 text-white" : "z77_b rounded-md bg-gray-700 px-4 py-2 text-white"} onClick={() => addLog("Low signal", "Generated-class-only element clicked")} type="button">
          <span className="sr-only">Generated class only</span>
          <User className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

export const TrueTestMatchingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const version = getVersion(searchParams);
  const { entries, addLog } = useActionLog();

  const routeName = useMemo(() => {
    if (location.pathname.includes("query-template")) return "Query Template";
    if (location.pathname.includes("studies")) return "Study Queries";
    if (location.pathname.includes("admin/permissions")) return "Admin Permissions";
    if (location.pathname.includes("checkout")) return "Checkout";
    if (location.pathname.includes("profile/settings")) return "Profile Settings";
    if (location.pathname.includes("dashboard")) return "Dashboard";
    return "Login";
  }, [location.pathname]);

  let page: React.ReactNode;
  if (location.pathname.includes("query-template")) {
    page = <QueryTemplatePage version={version} addLog={addLog} />;
  } else if (location.pathname.includes("studies")) {
    page = <StudiesQueriesPage version={version} addLog={addLog} />;
  } else if (location.pathname.includes("admin/permissions")) {
    page = <PermissionsPage version={version} addLog={addLog} />;
  } else if (location.pathname.includes("checkout")) {
    page = <CheckoutPage version={version} addLog={addLog} />;
  } else if (location.pathname.includes("profile/settings")) {
    page = <ProfileSettingsPage version={version} addLog={addLog} />;
  } else if (location.pathname.includes("dashboard")) {
    page = <DashboardPage version={version} addLog={addLog} />;
  } else {
    page = <LoginPage version={version} addLog={addLog} />;
  }

  return (
    <PageShell version={version} routeName={routeName} entries={entries}>
      {page}
    </PageShell>
  );
};
