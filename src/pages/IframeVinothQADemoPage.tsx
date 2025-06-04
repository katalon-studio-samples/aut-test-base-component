import React from "react";

export const IframeVinothQADemoPage: React.FC = () => (
  <div className="p-4">
    <h2 className="text-lg font-bold mb-4">Vinoth QA Demo Site Iframe</h2>
    <iframe
      src="https://vinothqaacademy.com/demo-site/"
      title="Vinoth QA Demo Site Iframe"
      width="1000"
      height="800"
      className="border"
      allowFullScreen
    />
  </div>
);
