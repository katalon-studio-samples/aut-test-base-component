import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

interface ShadowDOMWrapperProps {
  children: React.ReactNode;
  layers?: number;
}

export const ShadowDOMWrapper: React.FC<ShadowDOMWrapperProps> = ({
  children,
  layers = 4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous shadow DOM if it exists
    if (containerRef.current.shadowRoot) {
      if (rootRef.current) {
        rootRef.current.unmount();
      }
      containerRef.current.innerHTML = "";
    }

    const createShadowLayers = (
      element: HTMLElement,
      remainingLayers: number,
    ): ShadowRoot => {
      // Check if shadow root already exists
      let shadowRoot = element.shadowRoot;
      if (!shadowRoot) {
        shadowRoot = element.attachShadow({ mode: "open" });
      } else {
        // Clear existing content
        shadowRoot.innerHTML = "";
      }

      // Add styles to shadow root
      const style = document.createElement("style");
      style.textContent = `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body, html {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        .shadow-layer {
          width: 100%;
          padding: 15px;
          border: 2px dashed #3b82f6;
          margin: 5px 0;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
        }
        .shadow-layer-label {
          font-size: 12px;
          color: #3b82f6;
          margin-bottom: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        /* TinyMCE specific styles */
        .tox {
          font-family: inherit;
        }
        /* Form styles */
        .p-6 { padding: 1.5rem; }
        .max-w-4xl { max-width: 56rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .font-bold { font-weight: 700; }
        .mb-6 { margin-bottom: 1.5rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .block { display: block; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .font-medium { font-weight: 500; }
        .mb-2 { margin-bottom: 0.5rem; }
        .flex { display: flex; }
        .gap-4 { gap: 1rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .bg-blue-600 { background-color: rgb(37 99 235); }
        .bg-gray-500 { background-color: rgb(107 114 128); }
        .text-white { color: rgb(255 255 255); }
        .rounded { border-radius: 0.25rem; }
        .hover\\:bg-blue-700:hover { background-color: rgb(29 78 216); }
        .hover\\:bg-gray-600:hover { background-color: rgb(75 85 99); }
        .disabled\\:opacity-50:disabled { opacity: 0.5; }
        .mt-6 { margin-top: 1.5rem; }
        .p-4 { padding: 1rem; }
        .bg-gray-100 { background-color: rgb(243 244 246); }
        .font-semibold { font-weight: 600; }
        .prose { color: rgb(55 65 81); }
        .max-w-none { max-width: none; }
        button {
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        button:disabled {
          cursor: not-allowed;
        }
      `;
      shadowRoot.appendChild(style);

      if (remainingLayers > 1) {
        const wrapper = document.createElement("div");
        wrapper.className = "shadow-layer";

        const label = document.createElement("div");
        label.className = "shadow-layer-label";
        label.textContent = `Shadow DOM Layer ${layers - remainingLayers + 1}`;
        wrapper.appendChild(label);

        const nextContainer = document.createElement("div");
        wrapper.appendChild(nextContainer);
        shadowRoot.appendChild(wrapper);

        return createShadowLayers(nextContainer, remainingLayers - 1);
      } else {
        const finalWrapper = document.createElement("div");
        finalWrapper.className = "shadow-layer";

        const label = document.createElement("div");
        label.className = "shadow-layer-label";
        label.textContent = `Shadow DOM Layer ${layers} (Final - TinyMCE Container)`;
        finalWrapper.appendChild(label);

        const contentContainer = document.createElement("div");
        finalWrapper.appendChild(contentContainer);
        shadowRoot.appendChild(finalWrapper);

        // Render React component in the final shadow root
        rootRef.current = createRoot(contentContainer);
        rootRef.current.render(children as React.ReactElement);

        return shadowRoot;
      }
    };

    createShadowLayers(containerRef.current, layers);

    // Cleanup function
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [children, layers]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-blue-600">
        🔗 Component with {layers} Shadow DOM Layers
      </h3>
      <div
        ref={containerRef}
        className="border-2 border-blue-300 p-4 rounded-lg bg-blue-50"
        data-test="shadow-dom-container"
      />
    </div>
  );
};
