import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, FileText, ChevronDown } from "lucide-react";

const URL_EXTENSIONS = [
  { value: "", label: "No Extension" },
  { value: ".html", label: ".html" },
  { value: ".php", label: ".php" },
  { value: ".asp", label: ".asp" },
  { value: ".aspx", label: ".aspx" },
  { value: ".jsp", label: ".jsp" },
];

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, urlExtension, setUrlExtension } = useTheme();
  const [showExtensionDropdown, setShowExtensionDropdown] = useState(false);

  const handleExtensionChange = (extension: string) => {
    setUrlExtension(extension);
    setShowExtensionDropdown(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {/* URL Extension Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowExtensionDropdown(!showExtensionDropdown)}
          className={`p-2 rounded-md shadow-md transition-all duration-200 flex items-center gap-1 ${
            urlExtension
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          aria-label="Select URL extension"
          title="Select URL extension"
        >
          <FileText className="h-4 w-4" />
          <span className="text-xs font-medium">{urlExtension || "None"}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Dropdown Menu */}
        {showExtensionDropdown && (
          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 min-w-[120px]">
            {URL_EXTENSIONS.map((ext) => (
              <button
                key={ext.value}
                onClick={() => handleExtensionChange(ext.value)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  urlExtension === ext.value
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {ext.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  );
};
