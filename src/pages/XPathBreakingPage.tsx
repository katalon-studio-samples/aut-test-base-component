import React, { useState } from "react";

export const XPathBreakingPage: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<string>("");

  const handleElementClick = (elementInfo: string) => {
    setSelectedElement(elementInfo);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        XPath Breaking Characters Test Page
      </h1>

      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-sm text-red-700 dark:text-red-300 mb-2">
          ⚠️ This page contains elements with characters that commonly break
          XPath selectors:
        </p>
        <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
          <li>Single quotes (') and double quotes (") in attribute values</li>
          <li>Square brackets [ ] and parentheses ( ) in IDs and classes</li>
          <li>XML special characters: &amp;, &lt;, &gt;</li>
          <li>Namespace colons (:) in attribute names</li>
          <li>Mixed quote scenarios that require XPath escaping</li>
        </ul>
      </div>

      <div className="space-y-8">
        {/* Section 1: Quote Characters */}
        <section className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            1. Quote Characters in Attributes
          </h2>
          <div className="space-y-4">
            {/* Single quotes in attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                id="btn-single-quote"
                data-testid="button-with-'single'-quotes"
                title="Button with 'single' quotes in title"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() =>
                  handleElementClick(
                    "Button with single quotes in data-testid and title",
                  )
                }
              >
                Single Quote Button
              </button>

              <input
                id="input-double-quote"
                data-testid='input-with-"double"-quotes'
                placeholder='Enter "quoted" text here'
                title='Input with "double" quotes'
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-200"
                onClick={() =>
                  handleElementClick(
                    "Input with double quotes in multiple attributes",
                  )
                }
              />
            </div>

            {/* Mixed quotes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                id="div-mixed-quotes"
                data-testid={"element-with-'single'-and-\"double\"-quotes"}
                title={"Mixed: 'single' and \"double\" quotes"}
                className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded cursor-pointer"
                onClick={() =>
                  handleElementClick("Div with both single and double quotes")
                }
              >
                Mixed Quotes Element
              </div>

              <span
                id="span-apostrophe"
                data-name="user's-data"
                title={'John\'s Profile - "Admin" Role'}
                className="p-3 bg-green-100 dark:bg-green-900/30 rounded cursor-pointer inline-block"
                onClick={() =>
                  handleElementClick(
                    "Span with apostrophes and quotes in realistic context",
                  )
                }
              >
                User's "Admin" Profile
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Brackets and Parentheses */}
        <section className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            2. Brackets and Parentheses in Locators
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                id="btn[array-style]"
                className="btn-class[0] px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                data-index="[0]"
                onClick={() =>
                  handleElementClick(
                    "Button with square brackets in ID and class",
                  )
                }
              >
                Array[0] Button
              </button>

              <input
                id="input(function-style)"
                className="input-class(param) px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-200"
                data-function="getValue()"
                placeholder="function() input"
                onClick={() =>
                  handleElementClick("Input with parentheses in ID and class")
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                id="element[complex](mixed)"
                className="class[array](function) p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded cursor-pointer"
                data-selector="[complex](selector)"
                onClick={() =>
                  handleElementClick(
                    "Element with mixed brackets and parentheses",
                  )
                }
              >
                Complex[Array](Function) Element
              </div>

              <select
                id="select[options]"
                className="form-select[dropdown] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-200"
                data-options="[option1, option2]"
                onClick={() =>
                  handleElementClick(
                    "Select with brackets in multiple attributes",
                  )
                }
              >
                <option value="opt[1]">Option[1]</option>
                <option value="opt[2]">Option[2]</option>
                <option value="func()">Function()</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: XML Special Characters */}
        <section className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            3. XML Special Characters (&amp;, &lt;, &gt;)
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                id="btn-ampersand"
                data-testid="button&with&ampersands"
                title="Save & Exit"
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                onClick={() =>
                  handleElementClick("Button with ampersands in data-testid")
                }
              >
                Save &amp; Exit
              </button>

              <div
                id="div-less-than"
                data-comparison="value<100"
                title="Value < 100"
                className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded cursor-pointer"
                onClick={() =>
                  handleElementClick("Div with less-than symbol in attributes")
                }
              >
                Value &lt; 100
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                id="input-greater-than"
                data-validation="score>50"
                placeholder="Score > 50"
                title="Enter score > 50"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-200"
                onClick={() =>
                  handleElementClick(
                    "Input with greater-than symbol in attributes",
                  )
                }
              />

              <span
                id="span-mixed-xml"
                data-formula="a&b<c>d"
                title="Formula: a & b < c > d"
                className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded cursor-pointer inline-block"
                onClick={() =>
                  handleElementClick("Span with mixed XML special characters")
                }
              >
                Formula: a &amp; b &lt; c &gt; d
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Namespace Colons */}
        <section className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            4. Namespace Colons in Attributes
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                id="element-namespace"
                data-ns:type="custom"
                data-xml:lang="en"
                className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded cursor-pointer"
                onClick={() =>
                  handleElementClick(
                    "Element with namespace colons in data attributes",
                  )
                }
              >
                Namespace Element
              </div>

              <button
                id="btn-custom-ns"
                data-app:version="1.0"
                data-user:role="admin"
                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                onClick={() =>
                  handleElementClick("Button with custom namespace attributes")
                }
              >
                Custom:Namespace Button
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                id="input-xml-ns"
                data-xml:id="unique-id"
                data-html:class="form-input"
                placeholder="XML namespace input"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-200"
                onClick={() =>
                  handleElementClick("Input with XML namespace attributes")
                }
              />

              <select
                id="select-multi-ns"
                data-app:config="dropdown"
                data-ui:theme="dark"
                data-test:automation="enabled"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-200"
                onClick={() =>
                  handleElementClick(
                    "Select with multiple namespace attributes",
                  )
                }
              >
                <option value="ns:value1">ns:value1</option>
                <option value="app:value2">app:value2</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 5: Extreme Cases */}
        <section className="border border-red-300 dark:border-red-600 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
          <h2 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200">
            5. Extreme XPath Breaking Cases
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <button
                id="btn-nightmare"
                className="class[0]'quote'&amp;(func)"
                data-testid="element-with-'quotes'-&-[brackets]-(parens)"
                title="Nightmare: 'quotes' & [brackets] (parens) < > symbols"
                data-xml:ns="app:test"
                data-formula={"a&b<c>d'e\"f[g](h)"}
                onClick={() =>
                  handleElementClick(
                    "NIGHTMARE ELEMENT: All problematic characters combined",
                  )
                }
              >
                🔥 Nightmare Element: 'quotes' &amp; [brackets] (parens) &lt;
                &gt; symbols
              </button>

              <div
                id="div[array]'quote'&lt;xml&gt;"
                className={"extreme-case'with\"quotes&[brackets](parens)"}
                data-testid={
                  "extreme-'case'-with-\"all\"-&-[problematic]-(characters)"
                }
                title={
                  "Extreme case with 'all' \"problematic\" & [characters] (combined) < together >"
                }
                data-app:config={"test'data\"with&special<chars>"}
                onClick={() =>
                  handleElementClick("EXTREME CASE: Maximum XPath complexity")
                }
              >
                <span className="text-red-600 dark:text-red-400 font-bold">
                  ⚠️ EXTREME: All XPath breaking characters in one element
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Element Info */}
        {selectedElement && (
          <section className="border border-green-300 dark:border-green-600 rounded-lg p-6 bg-green-50 dark:bg-green-900/10">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              Selected Element Information
            </h3>
            <p className="text-green-700 dark:text-green-300">
              {selectedElement}
            </p>
            <div className="mt-3 text-sm text-green-600 dark:text-green-400">
              <p>
                <strong>XPath Challenge:</strong> This element requires careful
                XPath escaping or alternative locator strategies.
              </p>
            </div>
          </section>
        )}

        {/* XPath Examples and Solutions */}
        <section className="border border-blue-300 dark:border-blue-600 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/10">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
            XPath Escaping Examples
          </h2>
          <div className="space-y-3 text-sm font-mono">
            <div>
              <p className="text-blue-700 dark:text-blue-300 mb-1">
                <strong>Single Quote Problem:</strong>
              </p>
              <p className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-red-700 dark:text-red-300">
                ❌ //button[@title='Button with 'single' quotes']
              </p>
              <p className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-700 dark:text-green-300">
                ✅ //button[@title="Button with 'single' quotes"]
              </p>
            </div>

            <div>
              <p className="text-blue-700 dark:text-blue-300 mb-1">
                <strong>Double Quote Problem:</strong>
              </p>
              <p className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-red-700 dark:text-red-300">
                ❌ //input[@placeholder="Enter "quoted" text here"]
              </p>
              <p className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-700 dark:text-green-300">
                ✅ //input[@placeholder='Enter "quoted" text here']
              </p>
            </div>

            <div>
              <p className="text-blue-700 dark:text-blue-300 mb-1">
                <strong>Mixed Quotes Problem:</strong>
              </p>
              <p className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-red-700 dark:text-red-300">
                ❌ //span[@title="John's Profile - "Admin" Role"]
              </p>
              <p className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-700 dark:text-green-300">
                ✅ //span[@title=concat("John's Profile - ", '"', "Admin", '"',
                " Role")]
              </p>
            </div>

            <div>
              <p className="text-blue-700 dark:text-blue-300 mb-1">
                <strong>Brackets in ID:</strong>
              </p>
              <p className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-red-700 dark:text-red-300">
                ❌ //button[@id='btn[array-style]'] (works but may be fragile)
              </p>
              <p className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-700 dark:text-green-300">
                ✅ //button[contains(@id, 'btn') and contains(@id,
                'array-style')]
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
