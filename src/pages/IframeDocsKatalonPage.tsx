import React from "react";

export const IframeDocsKatalonPage: React.FC = () => (
  <div className="p-4">
    <h2 className="text-lg font-bold mb-4">Cellphone Demo Iframe</h2>
    <iframe
      src="https://docs.katalon.com/"
      title="Katalon Docs Iframe"
      width="1000"
      height="800"
      className="border"
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      allow="autoplay; fullscreen"
    />
  </div>
);
