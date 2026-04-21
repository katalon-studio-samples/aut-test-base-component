import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

type EditorLanguage = "javascript" | "typescript" | "json" | "html";
type EditorTheme = "vs-light" | "vs-dark";

const initialCodeByLanguage: Record<EditorLanguage, string> = {
  javascript: `function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting("Monaco"));
`,
  typescript: `type User = {
  id: number;
  name: string;
};

const user: User = { id: 1, name: "Monaco" };
console.log(user);
`,
  json: `{
  "name": "Monaco Editor Sample",
  "version": 1,
  "features": ["syntax-highlighting", "line-numbers", "code-folding"]
}`,
  html: `<section class="editor-sample">
  <h2>Monaco Editor</h2>
  <p>This is a sample HTML snippet.</p>
</section>`,
};

export const MonacoEditorPage = () => {
  const [language, setLanguage] = useState<EditorLanguage>("javascript");
  const [theme, setTheme] = useState<EditorTheme>("vs-light");
  const [value, setValue] = useState(initialCodeByLanguage.javascript);

  const currentInitialCode = useMemo(
    () => initialCodeByLanguage[language],
    [language],
  );

  const handleLanguageChange = (nextLanguage: EditorLanguage) => {
    setLanguage(nextLanguage);
    setValue(initialCodeByLanguage[nextLanguage]);
  };

  const handleReset = () => {
    setValue(currentInitialCode);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Monaco Editor Sample</h2>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Language
          <select
            className="ml-2 px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
            value={language}
            onChange={(event) =>
              handleLanguageChange(event.target.value as EditorLanguage)
            }
            data-test="monaco-language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
          </select>
        </label>

        <label className="text-sm text-gray-700 dark:text-gray-200">
          Theme
          <select
            className="ml-2 px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
            value={theme}
            onChange={(event) => setTheme(event.target.value as EditorTheme)}
            data-test="monaco-theme-select"
          >
            <option value="vs-light">Light</option>
            <option value="vs-dark">Dark</option>
          </select>
        </label>

        <button
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={handleReset}
          data-test="monaco-reset-button"
        >
          Reset
        </button>
      </div>

      <div className="border rounded overflow-hidden" data-test="monaco-editor">
        <Editor
          height="520px"
          language={language}
          theme={theme}
          value={value}
          onChange={(nextValue) => setValue(nextValue ?? "")}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
