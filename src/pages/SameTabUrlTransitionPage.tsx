import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  ChevronsUpDown,
  ExternalLink,
  LogIn,
  Route,
  ShieldAlert,
  UserCog,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const BASE_PATH = "/same-tab-url-transition";
const MANUAL_SOURCE_PATH = `${BASE_PATH}/manual-source`;
const MANUAL_DESTINATION_PATH = `${BASE_PATH}/orders/123`;
const ROLE_SWITCH_PATH = `${BASE_PATH}/role-switch`;
const DROPDOWN_ROUTE_STATE_PATH = `${BASE_PATH}/dropdown-route-state`;
const ADMIN_DASHBOARD_PATH = `${BASE_PATH}/admin/dashboard`;
const LOGIN_REDIRECT_PATH = `${BASE_PATH}/login-redirect`;
const SESSION_REVIEW_PATH = `${BASE_PATH}/session-review`;
const GUARDED_REPORTS_PATH = `${BASE_PATH}/guarded-reports`;
const ACCESS_REVIEW_PATH = `${BASE_PATH}/access-review`;
const UNSUPPORTED_SCOPE_PATH = `${BASE_PATH}/unsupported-scope`;
const SUPPORTED_EXTENSION_REGEX = /\.(html|php|asp|aspx|jsp)$/;

const VALID_LOGIN = {
  username: "qa_admin",
  password: "letmein",
};

const buildRandomToken = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const DROPDOWN_ROUTE_OPTIONS = [
  {
    id: "overview",
    label: "Overview Queue",
    description: "Default queue for broad account review.",
    hint: "Low-risk route state update that should replay safely.",
  },
  {
    id: "exceptions",
    label: "Exceptions Queue",
    description: "Focused queue for exception-only review items.",
    hint: "URL changes to reflect the selected queue, but the page shell stays the same.",
  },
  {
    id: "returns",
    label: "Returns Queue",
    description: "Items waiting for return-specific investigation.",
    hint: "Represents a same-page state route selected from a dropdown option click.",
  },
] as const;

interface ScenarioCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  expectation: string;
}

const normalizePath = (pathname: string) =>
  pathname.replace(SUPPORTED_EXTENSION_REGEX, "");

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  icon,
  title,
  description,
  path,
  expectation,
}) => {
  const { getFormattedPath } = useTheme();

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>
      <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Expected Generation
        </p>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {expectation}
        </p>
      </div>
      <Link
        to={getFormattedPath(path)}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        data-test={`open-${path.split("/").pop()}-scenario`}
      >
        Open Scenario
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export const SameTabUrlTransitionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { getFormattedPath } = useTheme();
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isGuardChecking, setIsGuardChecking] = useState(false);
  const [orderReviewed, setOrderReviewed] = useState(false);
  const [orderTimelineOpened, setOrderTimelineOpened] = useState(false);
  const [dropdownDetailsOpened, setDropdownDetailsOpened] = useState(false);
  const [adminAuditOpened, setAdminAuditOpened] = useState(false);
  const [adminFilter, setAdminFilter] = useState("today");
  const [sessionApproved, setSessionApproved] = useState(false);
  const [sessionCommentAdded, setSessionCommentAdded] = useState(false);
  const [accessReviewRequested, setAccessReviewRequested] = useState(false);

  const currentPath = useMemo(
    () => normalizePath(location.pathname),
    [location.pathname],
  );

  useEffect(() => {
    setIsDropdownMenuOpen(false);
    setIsRoleSwitching(false);
    setIsLoggingIn(false);
    setIsGuardChecking(false);
    setLoginError("");
  }, [currentPath]);

  const selectedDropdownRouteOption =
    DROPDOWN_ROUTE_OPTIONS.find(
      (option) => option.id === searchParams.get("view"),
    ) || DROPDOWN_ROUTE_OPTIONS[0];

  const buildPath = (path: string, query?: URLSearchParams) => {
    const search = query && query.toString() ? `?${query.toString()}` : "";
    return `${getFormattedPath(path)}${search}`;
  };

  const buildAbsoluteUrl = (path: string, query?: URLSearchParams) => {
    const relative = buildPath(path, query);
    if (typeof window === "undefined") {
      return relative;
    }
    return `${window.location.origin}${relative}`;
  };

  const currentUrlDisplay =
    typeof window === "undefined"
      ? buildAbsoluteUrl(currentPath)
      : window.location.href;

  const handleRoleSwitch = async () => {
    setIsRoleSwitching(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const query = new URLSearchParams({
      source: "role-switch-click",
      previousRole: "analyst",
      nextRole: "admin",
    });
    navigate(buildPath(ADMIN_DASHBOARD_PATH, query));
  };

  const handleDropdownRouteChange = (viewId: string) => {
    const query = new URLSearchParams({
      view: viewId,
      source: "dropdown-option-click",
    });

    setIsDropdownMenuOpen(false);
    setDropdownDetailsOpened(false);
    navigate(buildPath(DROPDOWN_ROUTE_STATE_PATH, query));
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      credentials.username !== VALID_LOGIN.username ||
      credentials.password !== VALID_LOGIN.password
    ) {
      setLoginError(
        "Use the valid credentials shown below to trigger the redirect.",
      );
      setIsLoggingIn(false);
      return;
    }

    const query = new URLSearchParams({
      source: "login-submit",
      session: buildRandomToken("session"),
      token: buildRandomToken("token"),
      destinationHint: "/secure/review",
    });
    navigate(buildPath(SESSION_REVIEW_PATH, query));
  };

  const handleGuardedRoute = async () => {
    setIsGuardChecking(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const query = new URLSearchParams({
      source: "route-guard-click",
      attempted: "/reports/quarterly",
      activeRole: "viewer",
    });
    navigate(buildPath(ACCESS_REVIEW_PATH, query));
  };

  const shell = (
    title: string,
    description: string,
    content: React.ReactNode,
  ) => (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              TrueTest URL Transition Flow
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="max-w-3xl text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="font-semibold text-gray-900 dark:text-white">
              Current URL
            </div>
            <code className="mt-2 block break-all">{currentUrlDisplay}</code>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={getFormattedPath(BASE_PATH)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            data-test="same-tab-overview-link"
          >
            <Route className="h-4 w-4" />
            Overview
          </Link>
          <Link
            to={getFormattedPath(MANUAL_SOURCE_PATH)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            data-test="manual-source-link"
          >
            Manual Source
          </Link>
          <Link
            to={getFormattedPath(ROLE_SWITCH_PATH)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            data-test="role-switch-link"
          >
            Role Switch
          </Link>
          <Link
            to={getFormattedPath(DROPDOWN_ROUTE_STATE_PATH)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            data-test="dropdown-route-link"
          >
            Dropdown Route
          </Link>
          <Link
            to={getFormattedPath(LOGIN_REDIRECT_PATH)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            data-test="login-redirect-link"
          >
            Login Redirect
          </Link>
          <Link
            to={getFormattedPath(GUARDED_REPORTS_PATH)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            data-test="guarded-route-link"
          >
            Route Guard
          </Link>
          <Link
            to={getFormattedPath(UNSUPPORTED_SCOPE_PATH)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            data-test="unsupported-scope-link"
          >
            Unsupported Scope
          </Link>
        </div>
      </div>

      {content}
    </div>
  );

  if (currentPath === BASE_PATH) {
    return shell(
      "Same-Tab URL Transition Test Page",
      "This AUT page covers replay-sensitive navigation flows: manual same-tab navigation, captured-action redirects, dropdown-driven URL updates that keep the same page, dynamic URLs that should be reviewed before replay, and same-tab exits from supported tracking scope.",
      <div className="grid gap-6 lg:grid-cols-2">
        <ScenarioCard
          icon={<Route className="h-6 w-6" />}
          title="Manual Address-Bar Navigation"
          description="Start on a source page, then manually replace the browser URL in the same tab before interacting on the destination page."
          path={MANUAL_SOURCE_PATH}
          expectation="Generation should insert a navigate step before the first destination-page action because there is no captured UI action that explains the route change."
        />
        <ScenarioCard
          icon={<UserCog className="h-6 w-6" />}
          title="Role Switch Redirect"
          description="A click action changes the active role and the app redirects to a new same-scope route."
          path={ROLE_SWITCH_PATH}
          expectation="Generation should preserve the click and resulting destination route. It should not silently drop the transition or require a manual navigation step afterward."
        />
        <ScenarioCard
          icon={<ChevronsUpDown className="h-6 w-6" />}
          title="Dropdown Option Changes URL"
          description="Selecting an option from a dropdown updates the same-tab URL while the page shell stays on the same route."
          path={DROPDOWN_ROUTE_STATE_PATH}
          expectation="Generation should preserve the dropdown option click and the resulting route-state URL change without inserting an unnecessary standalone navigate step."
        />
        <ScenarioCard
          icon={<LogIn className="h-6 w-6" />}
          title="Login Redirect To Dynamic URL"
          description="Submitting valid credentials redirects to a session-specific destination with dynamic values in the URL."
          path={LOGIN_REDIRECT_PATH}
          expectation="Generation should keep the login submit, then flag or comment the session-specific destination for review rather than generating an unsafe hard-coded navigation."
        />
        <ScenarioCard
          icon={<ShieldAlert className="h-6 w-6" />}
          title="Route Guard Redirect"
          description="A protected route request is intercepted by client-side authorization logic and rerouted automatically."
          path={GUARDED_REPORTS_PATH}
          expectation="Generation should preserve the click and the redirected destination route because the redirect is a deterministic result of the captured action."
        />
        <ScenarioCard
          icon={<ExternalLink className="h-6 w-6" />}
          title="Unsupported Cross-Domain Exit"
          description="The same tab leaves the supported tracking scope and opens a different domain."
          path={UNSUPPORTED_SCOPE_PATH}
          expectation="Generation should surface the limitation for review instead of treating later steps as if no transition happened."
        />
      </div>,
    );
  }

  if (currentPath === MANUAL_SOURCE_PATH) {
    const destinationUrl = buildAbsoluteUrl(MANUAL_DESTINATION_PATH);

    return shell(
      "Manual Same-Tab Navigation Source",
      "Use this page to reproduce a top-level URL transition with no captured triggering action. The important step is the manual address-bar change from this route to the destination route below.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6">
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
            Test Steps
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-amber-900 dark:text-amber-100 list-decimal list-inside">
            <li>Begin recording while this page is open.</li>
            <li>Do not click another AUT control on this page.</li>
            <li>
              Manually replace the browser URL with the destination shown below.
            </li>
            <li>
              On the destination page, continue with the provided order actions.
            </li>
          </ol>

          <div className="mt-6 rounded-lg bg-white/80 dark:bg-gray-950/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Destination URL To Type
            </div>
            <code
              className="mt-2 block break-all text-sm text-gray-900 dark:text-gray-100"
              data-test="manual-destination-url"
            >
              {destinationUrl}
            </code>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Expected Generation
          </h2>
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            Because the route change has no captured UI trigger, generated
            replay should insert a navigate step before the first
            destination-page action.
          </p>
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            If generation cannot safely reconstruct the typed destination, it
            should flag the transition for review instead of silently dropping
            it.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === MANUAL_DESTINATION_PATH) {
    return shell(
      "Manual Navigation Destination",
      "This page is the destination for the address-bar change. Interact here after manually typing the URL from the source page so replay generation has destination-page actions to anchor.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                Order Details
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                Order #123
              </h2>
            </div>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
              Awaiting review
            </span>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Customer
              </dt>
              <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                Alex Johnson
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Fulfillment
              </dt>
              <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                Same-day courier
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setOrderTimelineOpened((value) => !value)}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              data-test="open-order-timeline-btn"
            >
              {orderTimelineOpened
                ? "Hide Order Timeline"
                : "Open Order Timeline"}
            </button>
            <button
              type="button"
              onClick={() => setOrderReviewed((value) => !value)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                orderReviewed
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              }`}
              data-test="mark-order-reviewed-btn"
            >
              {orderReviewed ? "Reviewed" : "Mark Order Reviewed"}
            </button>
          </div>

          {orderTimelineOpened && (
            <div
              className="mt-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4"
              data-test="order-timeline-panel"
            >
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Timeline
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-blue-900 dark:text-blue-100">
                <li>09:02 - Payment authorized</li>
                <li>09:06 - Inventory reserved</li>
                <li>09:13 - Pack slip generated</li>
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Expected Replay Rule
          </h2>
          <p className="mt-4 text-sm text-blue-900 dark:text-blue-100">
            Generated replay should navigate to this order route before
            replaying the destination actions if the transition came from a
            manual URL change with no captured trigger.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === ROLE_SWITCH_PATH) {
    return shell(
      "Role Switch Redirect",
      "This scenario models a captured click that triggers a deterministic same-tab redirect from a standard home route to an admin dashboard.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Active role
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              Analyst
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-700 dark:text-gray-300">
            Clicking the button below simulates a role change that automatically
            redirects the same tab to the admin dashboard.
          </p>

          <button
            type="button"
            onClick={handleRoleSwitch}
            disabled={isRoleSwitching}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            data-test="switch-role-button"
          >
            <UserCog className="h-4 w-4" />
            {isRoleSwitching ? "Switching Role..." : "Switch Role To Admin"}
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Expected Generation
          </h2>
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            Preserve the click and the resulting admin route transition. Do not
            drop the redirect or require a manual navigate step afterward unless
            one is required for deterministic replay.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === ADMIN_DASHBOARD_PATH) {
    const source = searchParams.get("source") || "unknown";
    const previousRole = searchParams.get("previousRole") || "unknown";
    const nextRole = searchParams.get("nextRole") || "admin";

    return shell(
      "Admin Dashboard Destination",
      "This destination page is reached automatically after the role-switch action. Continue interacting here to verify that generated replay keeps both the trigger and the resulting route.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Redirect source
              </div>
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                {source}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Previous role
              </div>
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                {previousRole}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Current role
              </div>
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                {nextRole}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dashboard filter
              <select
                value={adminFilter}
                onChange={(event) => setAdminFilter(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                data-test="admin-dashboard-filter"
              >
                <option value="today">Today</option>
                <option value="this-week">This week</option>
                <option value="open-items">Open items</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setAdminAuditOpened((value) => !value)}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              data-test="open-audit-queue-btn"
            >
              {adminAuditOpened ? "Hide Audit Queue" : "Open Audit Queue"}
            </button>
          </div>

          {adminAuditOpened && (
            <div
              className="mt-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4"
              data-test="audit-queue-panel"
            >
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Audit Queue
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-blue-900 dark:text-blue-100">
                <li>Review late-order exceptions</li>
                <li>Approve discount overrides</li>
                <li>Verify pending access changes</li>
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Expected Replay Rule
          </h2>
          <p className="mt-4 text-sm text-blue-900 dark:text-blue-100">
            Generated replay should keep the Switch Role click and preserve this
            destination route as its result.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === DROPDOWN_ROUTE_STATE_PATH) {
    const source = searchParams.get("source") || "none";

    return shell(
      "Dropdown Option Updates URL, Same Page Stays Open",
      "This scenario models a captured dropdown-option click that updates the same-tab URL with safe route-state query parameters while keeping the user on the same page shell.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Active queue source
            </div>
            <div className="mt-2 font-semibold text-gray-900 dark:text-white">
              {source}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Review queue
            </label>

            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setIsDropdownMenuOpen((value) => !value)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-white hover:border-blue-500"
                data-test="dropdown-route-trigger"
                aria-expanded={isDropdownMenuOpen}
                aria-haspopup="listbox"
              >
                <span>
                  <span className="block text-sm font-semibold">
                    {selectedDropdownRouteOption.label}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {selectedDropdownRouteOption.description}
                  </span>
                </span>
                <ChevronsUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {isDropdownMenuOpen && (
                <div
                  className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
                  data-test="dropdown-route-menu"
                  role="listbox"
                >
                  {DROPDOWN_ROUTE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleDropdownRouteChange(option.id)}
                      className={`block w-full border-b border-gray-100 dark:border-gray-800 px-4 py-3 text-left last:border-b-0 ${
                        selectedDropdownRouteOption.id === option.id
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                          : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      data-test={`dropdown-route-option-${option.id}`}
                    >
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Current queue hint
            </div>
            <p
              className="mt-2 text-sm text-blue-900 dark:text-blue-100"
              data-test="dropdown-route-hint"
            >
              {selectedDropdownRouteOption.hint}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDropdownDetailsOpened((value) => !value)}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            data-test="open-selected-queue-btn"
          >
            {dropdownDetailsOpened
              ? "Hide Queue Details"
              : "Open Queue Details"}
          </button>

          {dropdownDetailsOpened && (
            <div
              className="mt-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4"
              data-test="selected-queue-panel"
            >
              <h2 className="font-semibold text-blue-900 dark:text-blue-100">
                {selectedDropdownRouteOption.label}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-blue-900 dark:text-blue-100">
                <li>
                  Queue remains on the same page shell after the URL update.
                </li>
                <li>
                  Selected queue is encoded in the URL query for deterministic
                  replay.
                </li>
                <li>
                  Follow-up actions can be executed without leaving this page.
                </li>
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Expected Replay Rule
          </h2>
          <p className="mt-4 text-sm text-blue-900 dark:text-blue-100">
            Generated replay should preserve the dropdown option click and the
            resulting query-string transition on this same page. It should not
            add a manual navigate step unless one is needed to make replay
            deterministic.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === LOGIN_REDIRECT_PATH) {
    return shell(
      "Login Redirect With Dynamic URL",
      "Submitting valid credentials triggers a same-tab redirect to a session-specific destination. The URL values are intentionally unstable so replay generation has to review them instead of hard-coding them blindly.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <form
            onSubmit={handleLoginSubmit}
            className="space-y-4"
            data-test="dynamic-login-form"
          >
            <div>
              <label
                htmlFor="dynamic-login-username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="dynamic-login-username"
                type="text"
                value={credentials.username}
                onChange={(event) =>
                  setCredentials((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                data-test="dynamic-login-username"
              />
            </div>

            <div>
              <label
                htmlFor="dynamic-login-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="dynamic-login-password"
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                data-test="dynamic-login-password"
              />
            </div>

            {loginError && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
                data-test="dynamic-login-error"
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              data-test="dynamic-login-submit"
            >
              <LogIn className="h-4 w-4" />
              {isLoggingIn ? "Signing In..." : "Sign In And Redirect"}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Valid credentials
            </div>
            <div className="mt-2 text-sm text-gray-900 dark:text-white">
              Username: <code>{VALID_LOGIN.username}</code>
            </div>
            <div className="mt-1 text-sm text-gray-900 dark:text-white">
              Password: <code>{VALID_LOGIN.password}</code>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6">
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
            Expected Generation
          </h2>
          <p className="mt-4 text-sm text-amber-900 dark:text-amber-100">
            Preserve the submit action and the resulting redirect, but review
            the destination URL before replay because it contains
            session-specific values.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === SESSION_REVIEW_PATH) {
    const sessionId = searchParams.get("session") || "unknown-session";
    const token = searchParams.get("token") || "unknown-token";
    const source = searchParams.get("source") || "unknown-source";

    return shell(
      "Dynamic Session Review Destination",
      "The destination URL contains intentionally unstable session values. This is useful for validating that generation comments or flags the transition instead of replaying a broken hard-coded URL.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div
            className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4"
            data-test="dynamic-url-warning"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-300" />
              <div>
                <h2 className="font-semibold text-amber-900 dark:text-amber-100">
                  Review before replay
                </h2>
                <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">
                  Session IDs and tokens on this route are generated at submit
                  time and should be reviewed before they are replayed directly.
                </p>
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Redirect source
              </dt>
              <dd className="mt-1 font-semibold text-gray-900 dark:text-white">
                {source}
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Session ID
              </dt>
              <dd className="mt-1 break-all font-semibold text-gray-900 dark:text-white">
                {sessionId}
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4 sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Replay-sensitive token
              </dt>
              <dd className="mt-1 break-all font-semibold text-gray-900 dark:text-white">
                {token}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSessionApproved((value) => !value)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                sessionApproved
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              data-test="approve-session-review-btn"
            >
              {sessionApproved ? "Review Approved" : "Approve Review"}
            </button>
            <button
              type="button"
              onClick={() => setSessionCommentAdded((value) => !value)}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              data-test="add-session-comment-btn"
            >
              {sessionCommentAdded ? "Comment Added" : "Add Review Comment"}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6">
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
            Expected Replay Rule
          </h2>
          <p className="mt-4 text-sm text-amber-900 dark:text-amber-100">
            Keep the login submit and capture the resulting destination, but
            review or comment the session-specific URL instead of replaying it
            blindly.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === GUARDED_REPORTS_PATH) {
    return shell(
      "Route Guard Redirect",
      "This scenario models a protected route request where a captured click triggers client-side authorization logic and redirects to an access-review page in the same tab.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Active role
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              Viewer
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-700 dark:text-gray-300">
            Quarterly reports require manager access. The button below simulates
            a route guard that intercepts the request and redirects the same
            tab.
          </p>

          <button
            type="button"
            onClick={handleGuardedRoute}
            disabled={isGuardChecking}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            data-test="open-guarded-report-btn"
          >
            <ShieldAlert className="h-4 w-4" />
            {isGuardChecking ? "Checking Access..." : "Open Quarterly Reports"}
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Expected Generation
          </h2>
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            Generated replay should preserve the click and the redirected access
            review route as one connected flow.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === ACCESS_REVIEW_PATH) {
    const attempted = searchParams.get("attempted") || "/reports/quarterly";
    const activeRole = searchParams.get("activeRole") || "viewer";

    return shell(
      "Access Review Destination",
      "This page represents a route-guard redirect target. Follow-up actions here help verify that the redirect is preserved as part of the same captured flow.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
            <h2 className="font-semibold text-amber-900 dark:text-amber-100">
              Access redirected by guard
            </h2>
            <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">
              The requested route was blocked because the current role does not
              meet the access rule.
            </p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Attempted route
              </dt>
              <dd className="mt-1 font-semibold text-gray-900 dark:text-white">
                {attempted}
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Active role
              </dt>
              <dd className="mt-1 font-semibold text-gray-900 dark:text-white">
                {activeRole}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => setAccessReviewRequested((value) => !value)}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            data-test="request-access-review-btn"
          >
            {accessReviewRequested
              ? "Access Review Requested"
              : "Request Access Review"}
          </button>
        </section>

        <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Expected Replay Rule
          </h2>
          <p className="mt-4 text-sm text-blue-900 dark:text-blue-100">
            The redirect remains attributable to the captured click and should
            not be dropped from generated replay.
          </p>
        </section>
      </div>,
    );
  }

  if (currentPath === UNSUPPORTED_SCOPE_PATH) {
    return shell(
      "Unsupported Cross-Domain Exit",
      "This scenario leaves the current AUT scope in the same browser tab. Use it to validate that generation flags the limitation for review instead of pretending later steps belong to the original supported scope.",
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
            Same-tab exit action
          </h2>
          <p className="mt-4 text-sm text-red-900 dark:text-red-100">
            Clicking the button below leaves this AUT in the current tab and
            opens <code>example.com</code>. Use your browser Back button to
            return.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.assign(
                "https://example.com/?from=same-tab-url-transition-aut",
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            data-test="leave-supported-scope-btn"
          >
            <ExternalLink className="h-4 w-4" />
            Leave Supported Scope In Same Tab
          </button>
        </section>

        <section className="rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Expected Generation
          </h2>
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            Replay generation should surface this cross-domain limitation for
            review instead of silently ignoring the scope exit or treating later
            actions as if they happened on the original app.
          </p>
        </section>
      </div>,
    );
  }

  return shell(
    "Unknown Transition Scenario",
    "This route is not one of the supported test flows. Use the overview to start from a known transition scenario.",
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <Link
        to={getFormattedPath(BASE_PATH)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        data-test="return-to-transition-overview-btn"
      >
        Return To Overview
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>,
  );
};
