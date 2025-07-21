import React from "react";

// Helper to get URL param
function getUrlParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export const IframeSameDomainPage: React.FC = () => {
  // Get url param if present
  const urlParam = typeof window !== "undefined" ? getUrlParam("url") : null;
  // Default to current origin if no param
  const src = urlParam || window.location.origin;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Same Domain Iframe</h2>
      <iframe
        src={src}
        className="w-full h-[100vh] border-0 bg-white"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        data-test="iframe-educenter"
        title="Same Domain Iframe"
        name="iframe-same-domain"
      />
      <div className="mt-4 text-gray-500 text-sm">
        <div>
          Iframe src: <span className="font-mono">{src}</span>
        </div>
        <div>
          Provide <span className="font-mono">?url=...</span> in the query
          string to override the iframe source.
        </div>
      </div>
    </div>
  );
};
