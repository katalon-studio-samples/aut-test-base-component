import React, { useState, useEffect } from "react";
import type { IframeContent } from "../types";

const iframeContents: IframeContent[] = [
  {
    id: "iframe1",
    title: "Simple Content",
    content: `
      <html>
        <head>
          <style>
            body { font-family: system-ui; padding: 2rem; }
            button { padding: 0.5rem 1rem; margin: 0.5rem; }
          </style>
        </head>
        <body>
          <h1>Iframe Content 1</h1>
          <button onclick="window.top.postMessage('Button 1 clicked', '*')">
            Click Me
          </button>
        </body>
      </html>
    `,
  },
  {
    id: "iframe2",
    title: "Nested Elements",
    content: `
      <html>
        <head>
          <style>
            body { font-family: system-ui; padding: 2rem; }
            .nested { margin-left: 2rem; }
          </style>
        </head>
        <body>
          <div class="level-1">
            <h2>Level 1</h2>
            <div class="level-2 nested">
              <h3>Level 2</h3>
              <div class="level-3 nested">
                <h4>Level 3</h4>
                <button onclick="window.top.postMessage('Nested button clicked', '*')">
                  Nested Button
                </button>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  },
];

export const IframeExample: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        setMessages((prev) => [...prev, event.data]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="space-y-6" data-test="iframe-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {iframeContents.map(({ id, title, content }) => (
          <div
            key={id}
            className="border rounded-lg p-4"
            data-test={`iframe-wrapper-${id}`}
          >
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <iframe
              srcDoc={content}
              className="w-full h-64 border-0 bg-white"
              sandbox="allow-scripts"
              data-test={`iframe-${id}`}
            />
          </div>
        ))}
      </div>

      {messages.length > 0 && (
        <div
          className="mt-4 p-4 bg-gray-50 rounded-lg"
          data-test="iframe-messages"
        >
          <h3 className="text-lg font-medium mb-2">Messages from iframes:</h3>
          <ul className="space-y-1">
            {messages.map((message, index) => (
              <li key={index} data-test={`iframe-message-${index}`}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
