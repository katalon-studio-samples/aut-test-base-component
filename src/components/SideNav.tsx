import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    category: "Basic",
    items: [
      { path: "/about", label: "About" },
      { path: "/forms", label: "Forms" },
      { path: "/tables", label: "Tables" },
      {
        label: "Input",
        children: [
          { path: "/input/checkbox", label: "Input Checkbox" },
          { path: "/input/text", label: "Input Text" },
        ],
      },
    ],
  },
  {
    category: "Interaction",
    items: [
      { path: "/drag-drop", label: "Drag & Drop" },
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
      { path: "/key-value-form", label: "Key-Value Form" },
      { path: "/rich-text-editor", label: "Rich Text Editor" },
      { path: "/combobox", label: "Combo Box" },
    ],
  },
  {
    category: "Advanced",
    items: [
      { path: "/context-menu", label: "Context Menu" },
      { path: "/multi-tiered-menu", label: "Multi Tiered Menu" },
      { path: "/notifications", label: "Notifications" },
      { path: "/ab-testing", label: "A/B Testing" },
      { path: "/auth", label: "Authentication" },
      { path: "/checkboxes", label: "Checkboxes" },
      { path: "/exit-intent", label: "Exit Intent" },
      { path: "/alerts", label: "Alerts" },
      { path: "/open-popup", label: "Open Popup" },
    ],
  },
];

export const SideNav: React.FC<SideNavProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

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
                const key = `${category.category}-${item.label}-${idx}`;
                if (hasChildren && !hasPath) {
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className="flex items-center px-3 py-2 text-sm rounded-md w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => handleToggle(key)}
                        aria-expanded={!!expanded[key]}
                        data-test={`nav-collapse-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        <ChevronRight
                          className={`w-4 h-4 mr-2 transition-transform ${expanded[key] ? "rotate-90" : ""}`}
                        />
                        {item.label}
                      </button>
                      {expanded[key] && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <Link
                                to={child.path}
                                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                  location.pathname === child.path
                                    ? "bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                                data-test={`nav-${child.path.slice(1)}`}
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
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2 text-sm rounded-md ${
                        location.pathname === item.path
                          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      data-test={`nav-${item.path?.slice(1)}`}
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
                              to={child.path}
                              className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                location.pathname === child.path
                                  ? "bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                              data-test={`nav-${child.path.slice(1)}`}
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
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};
