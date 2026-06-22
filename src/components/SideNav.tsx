import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    category: "Basic",
    items: [
      { path: "/native-element", label: "Native HTML Elements" },
      { path: "/about", label: "About" },
      { path: "/forms", label: "Forms" },
      { path: "/msu-simulation-form", label: "MSU Simulation Form" },
      { path: "/sauce-login", label: "Sauce Login" },
      { path: "/tables", label: "Tables" },
      { path: "/ag-grid", label: "AG Grid Table" },
      {
        label: "Input",
        children: [
          { path: "/input/checkbox", label: "Input Checkbox" },
          { path: "/input/text", label: "Input Text" },
          { path: "/input/radio-search-submit", label: "Radio Search Submit" },
          { path: "/input/form-inputs", label: "Form Input Types" },
        ],
      },
      { path: "/list-card", label: "List Card" },
      { path: "/pii-controls", label: "PII Controls" },
      { path: "/unique-test-data", label: "Numeric Input" },
      { path: "/settings", label: "TrueTest Settings" },
    ],
  },
  {
    category: "Interaction",
    items: [
      { path: "/drag-drop", label: "Drag & Drop" },
      { path: "/form-builder-html5", label: "Form Builder (HTML5)" },
      { path: "/dynamic-elements", label: "Dynamic Elements" },
      { path: "/hover", label: "Hover States" },
      { path: "/key-press", label: "Key Press" },
      { path: "/slider", label: "Slider" },
    ],
  },
  {
    category: "Content",
    items: [
      { path: "/file-upload", label: "File Upload" },
      { path: "/file-upload/es", label: "File Upload (ES DOM)" },
      { path: "/file-download", label: "File Download" },
      {
        path: "/iframes",
        label: "Iframes",
        children: [
          { path: "/iframes", label: "Iframes Home" },
          { path: "/iframes/cellphone-demo", label: "Cellphone Demo" },
          { path: "/iframes/vinoth-demo", label: "Vinoth QA Demo" },
          { path: "/iframes/docs-katalon", label: "Docs Katalon" },
          { path: "/iframes/same-domain", label: "Base Component Iframe" },
        ],
      },
      { path: "/broken-images", label: "Broken Images" },
      { path: "/shadow-dom", label: "Shadow DOM" },
      { path: "/shadow-book-borrow", label: "Shadow Book Borrow" },
      { path: "/tinymce-shadow-dom", label: "TinyMCE Shadow DOM" },
      { path: "/key-value-form", label: "Key-Value Form" },
      { path: "/rich-text-editor", label: "Rich Text Editor" },
      { path: "/monaco-editor", label: "Monaco Editor" },
      { path: "/combobox", label: "Combo Box" },
      { path: "/unicode-combobox", label: "Unicode Combo Box" },
      { path: "/xpath-breaking", label: "XPath Breaking Characters" },
      { path: "/nested-text-locator-poc", label: "Nested Text Locator POC" },
      { path: "/dynamic-id-locator", label: "Dynamic ID Locator" },
      { path: "/scenario-toggle", label: "Scenario Toggle" },
    ],
  },
  {
    category: "Advanced",
    items: [
      { path: "/context-menu", label: "Context Menu" },
      { path: "/multi-tiered-menu", label: "Multi Tiered Menu" },
      {
        path: "/multi-tiered-menu-innertext",
        label: "Multi Tiered Menu InnerText",
      },
      { path: "/notifications", label: "Notifications" },
      { path: "/toast-delay-scenario", label: "Toast Delay Scenario" },
      { path: "/ab-testing", label: "A/B Testing" },
      {
        label: "TrueTest Matching",
        children: [
          { path: "/login?version=A", label: "Login - Version A" },
          { path: "/login?version=B", label: "Login - Version B" },
          { path: "/query-template?version=A", label: "Query Template - A" },
          { path: "/query-template?version=B", label: "Query Template - B" },
          {
            path: "/studies/123/queries/456?version=A",
            label: "Study Queries - A",
          },
          {
            path: "/studies/123/queries/456?version=B",
            label: "Study Queries - B",
          },
          { path: "/admin/permissions?version=A", label: "Permissions - A" },
          { path: "/admin/permissions?version=B", label: "Permissions - B" },
          { path: "/checkout?version=A", label: "Checkout - A" },
          { path: "/checkout?version=B", label: "Checkout - B" },
          { path: "/profile/settings?version=A", label: "Profile - A" },
          { path: "/profile/settings?version=B", label: "Profile - B" },
          { path: "/dashboard?version=A", label: "Dashboard - A" },
          { path: "/dashboard?version=B", label: "Dashboard - B" },
        ],
      },
      {
        path: "/true-test-clustering/index.html?version=A#/query-template",
        label: "TrueTest Clustering Static",
        external: true,
      },
      { path: "/auth", label: "Authentication" },
      { path: "/checkboxes", label: "Checkboxes" },
      { path: "/exit-intent", label: "Exit Intent" },
      { path: "/alerts", label: "Alerts" },
      { path: "/open-popup", label: "Open Popup" },
      { path: "/open-new-tab", label: "Open New Tab" },
      { path: "/same-tab-url-transition", label: "Same-Tab URL Transition" },
      { path: "/challenging-form", label: "Challenging Form" },
      { path: "/ng-select-dropdown", label: "Ng-Select Dropdown" },
      { path: "/ctrl-click-table", label: "Ctrl+Click Table" },
    ],
  },
];

export const SideNav: React.FC<SideNavProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { getFormattedPath } = useTheme();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const formatPath = (path: string) => {
    const suffixIndex = path.search(/[?#]/);
    if (suffixIndex === -1) {
      return getFormattedPath(path);
    }

    return `${getFormattedPath(path.slice(0, suffixIndex))}${path.slice(suffixIndex)}`;
  };

  const isActivePath = (path?: string) => {
    if (!path) {
      return false;
    }

    const formattedPath = formatPath(path);
    const hasQueryOrHash = /[?#]/.test(path);

    if (hasQueryOrHash) {
      return `${location.pathname}${location.search}` === formattedPath;
    }

    return location.pathname === formattedPath;
  };

  const getDataTestPath = (path?: string) =>
    path?.replace(/^\//, "").replace(/[^a-zA-Z0-9_-]+/g, "-") || "";

  const handleToggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLinkClick = () => {
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg h-screen overflow-y-auto transition-all duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      fixed md:translate-x-0 md:sticky top-0 left-0 w-64`}
    >
      {/* ...Home link... */}
      <nav className="p-4">
        {menuItems.map((category) => (
          <div key={category.category} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {category.category}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item, idx) => {
                const hasChildren = !!item.children;
                const hasPath = !!item.path;
                const isExternal = !!item.external;
                const key = `${category.category}-${item.label}-${idx}`;
                if (hasChildren && !hasPath) {
                  const isExpanded =
                    expanded[key] ??
                    item.children.some((child) => isActivePath(child.path));

                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className="flex items-center px-3 py-2 text-sm rounded-md w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => handleToggle(key)}
                        aria-expanded={isExpanded}
                        data-test={`nav-collapse-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        <ChevronRight
                          className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                        {item.label}
                      </button>
                      {isExpanded && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <Link
                                to={formatPath(child.path)}
                                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                  isActivePath(child.path)
                                    ? "bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                                data-test={`nav-${getDataTestPath(child.path)}`}
                                onClick={handleLinkClick}
                              >
                                <ChevronRight className="w-4 h-4 mr-2" />
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }
                // Default rendering for items with path
                return (
                  <li key={item.path || key}>
                    {isExternal ? (
                      <a
                        href={item.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-md ${
                          isActivePath(item.path)
                            ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                        data-test={`nav-${getDataTestPath(item.path)}`}
                        onClick={handleLinkClick}
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {item.label}
                      </a>
                    ) : (
                      <>
                        <Link
                          to={formatPath(item.path)}
                          className={`flex items-center px-3 py-2 text-sm rounded-md ${
                            isActivePath(item.path)
                              ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                          data-test={`nav-${getDataTestPath(item.path)}`}
                          onClick={handleLinkClick}
                        >
                          <ChevronRight className="w-4 h-4 mr-2" />
                          {item.label}
                        </Link>
                        {hasChildren && hasPath && (
                          <ul className="ml-6 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.path}>
                                <Link
                                  to={formatPath(child.path)}
                                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                    isActivePath(child.path)
                                      ? "bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  }`}
                                  data-test={`nav-${getDataTestPath(child.path)}`}
                                  onClick={handleLinkClick}
                                >
                                  <ChevronRight className="w-4 h-4 mr-2" />
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};
