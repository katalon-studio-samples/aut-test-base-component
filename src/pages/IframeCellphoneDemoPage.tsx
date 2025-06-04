import React from "react";

export const IframeCellphoneDemoPage: React.FC = () => (
  <div className="p-4">
    <h2 className="text-lg font-bold mb-4">Cellphone Demo Iframe</h2>
    <iframe
      src="https://cellphone-demo.aut.katalon.com/"
      title="Cellphone Demo"
      width="1000"
      height="800"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
);
