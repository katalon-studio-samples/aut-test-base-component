import React from "react";
import { HoverExample } from "../components/HoverExample";

export const HoverPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6">Hover States</h1>
      <p className="mb-6">
        Practice working with hover interactions and dynamic content changes on
        mouse events.
      </p>
      <HoverExample />
    </div>
  );
};
