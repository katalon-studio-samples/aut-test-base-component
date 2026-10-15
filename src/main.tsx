import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// The library route must not load or fabricate an SDK object.
if (
  !/^\/traffic-agent-performance(?:\.(?:html|php|asp|aspx|jsp))?\/?$/.test(
    location.pathname,
  )
) {
  void import("./utils/trueTestDetector");
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Root element not found");
}
