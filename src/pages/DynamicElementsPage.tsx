import React from "react";
import { DynamicElements } from "../components/DynamicElements";

export const DynamicElementsPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Dynamic Elements
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Practice working with elements that change over time, including loading
        states, delayed rendering, and visibility changes.
      </p>
      <DynamicElements />
    </div>
  );
};
