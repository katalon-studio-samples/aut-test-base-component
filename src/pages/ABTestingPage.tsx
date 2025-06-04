import React, { useEffect, useState } from "react";
import { getVariant, variants, type Variant } from "../utils/abTesting";

export const ABTestingPage: React.FC = () => {
  const [variant, setVariant] = useState<Variant>("A");
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setVariant(getVariant());
  }, []);

  const currentVariant = variants[variant];

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="px-4 py-6 sm:px-0" data-test="ab-testing-page">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        A/B Testing Example
      </h1>

      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${
          currentVariant.layout === "split"
            ? "md:grid md:grid-cols-2 gap-6"
            : ""
        }`}
      >
        <div className="p-6">
          <h2
            className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
            data-test="variant-title"
          >
            {currentVariant.title}
          </h2>
          <p
            className="mb-6 text-gray-600 dark:text-gray-300"
            data-test="variant-description"
          >
            {currentVariant.description}
          </p>
          <button
            onClick={handleClick}
            className={`px-4 py-2 text-white rounded ${currentVariant.buttonColor}`}
            data-test="variant-button"
          >
            Click Me ({clickCount})
          </button>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
          <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
            Testing Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>Current variant: {variant}</li>
            <li>Button clicks: {clickCount}</li>
            <li>Layout style: {currentVariant.layout}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
