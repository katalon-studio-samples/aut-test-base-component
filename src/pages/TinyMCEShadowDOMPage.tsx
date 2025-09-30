import React from "react";
import { ShadowDOMWrapper } from "../components/ShadowDOMWrapper";
import { TinyMCEShadowForm } from "../components/TinyMCEShadowForm";

export const TinyMCEShadowDOMPage: React.FC = () => {
  const handleFormSubmit = (content: string) => {
    console.log("Form submitted with content:", content);
    // You can add additional form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          TinyMCE in 4-Layer Shadow DOM
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Scenario</h2>
          <p className="text-gray-600 mb-4">
            This page demonstrates a TinyMCE rich text editor embedded within 4
            layers of Shadow DOM. This is a common challenge in test automation
            where components are deeply nested in shadow roots.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Layer 1: Outer shadow root container</li>
            <li>Layer 2: Second shadow root wrapper</li>
            <li>Layer 3: Third shadow root wrapper</li>
            <li>Layer 4: Final shadow root containing TinyMCE</li>
          </ul>
        </div>

        <ShadowDOMWrapper layers={4}>
          <TinyMCEShadowForm onSubmit={handleFormSubmit} />
        </ShadowDOMWrapper>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">
            Automation Testing Notes
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Shadow DOM Access:</strong> Use shadowRoot.querySelector()
              to traverse each layer
            </p>
            <p>
              <strong>TinyMCE Content:</strong> Access via iframe or
              contenteditable div within shadow DOM
            </p>
            <p>
              <strong>Form Submission:</strong> Test
              data-test="tinymce-submit-btn" button
            </p>
            <p>
              <strong>Content Validation:</strong> Check
              data-test="tinymce-content-preview" for output
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
