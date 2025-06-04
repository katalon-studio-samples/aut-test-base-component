import React from "react";

export const IframeSameDomainPage: React.FC = () => (
  <div className="p-4">
    <h2 className="text-lg font-bold mb-4">Same Domain Iframe</h2>
    <iframe
      src="https://base-component.aut.katalon.com"
      className="w-full h-[100vh] border-0 bg-white"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      data-test="iframe-educenter"
    />
  </div>
);
