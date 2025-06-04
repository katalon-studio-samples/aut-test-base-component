import React, { useState, useEffect } from "react";
import { simulateNetworkDelay } from "../utils/delay";
import { Loader } from "lucide-react";

export const DynamicElements: React.FC = () => {
  const [loadTime, setLoadTime] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string[]>([]);
  const [showHidden, setShowHidden] = useState(false);

  const loadContent = async () => {
    setIsLoading(true);
    setContent([]);

    await simulateNetworkDelay(loadTime * 1000, loadTime * 1000);

    setContent(["Dynamic Content 1", "Dynamic Content 2", "Dynamic Content 3"]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadContent();
  }, [loadTime]);

  return (
    <div className="space-y-6" data-test="dynamic-elements">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Load Time Configuration
        </h3>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max="30"
            value={loadTime}
            onChange={(e) => setLoadTime(Number(e.target.value))}
            className="w-48"
            data-test="load-time-slider"
          />
          <span
            className="text-gray-900 dark:text-white"
            data-test="load-time-value"
          >
            {loadTime}s
          </span>
          <button
            onClick={loadContent}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            data-test="reload-button"
          >
            Reload
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Dynamic Content
        </h3>
        <div
          className="min-h-[200px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          data-test="content-area"
        >
          {isLoading ? (
            <div
              className="flex items-center justify-center h-32"
              data-test="loading-indicator"
            >
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <ul className="space-y-2">
              {content.map((item, index) => (
                <li
                  key={index}
                  className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm text-gray-900 dark:text-white"
                  data-test={`dynamic-item-${index}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Hidden Elements
        </h3>
        <button
          onClick={() => setShowHidden(!showHidden)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          data-test="toggle-hidden-button"
        >
          Toggle Hidden Content
        </button>

        <div className={showHidden ? "" : "hidden"} data-test="hidden-content">
          <p className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded text-gray-800 dark:text-yellow-100">
            This content is sometimes hidden!
          </p>
        </div>
      </div>

      <div
        className="opacity-0 absolute"
        aria-hidden="true"
        data-test="invisible-element"
      >
        This element is always present but invisible
      </div>
    </div>
  );
};
