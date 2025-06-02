import React, { useRef, useEffect, useState } from 'react';

const initialHtml = `
<div
  class="ua-chrome ProseMirror pm-table-resizing-plugin"
  aria-label="Description area, start typing to enter text."
  aria-multiline="true"
  role="textbox"
  id="ak-editor-textarea"
  data-editor-id="238fe438-e4f3-4258-a014-aebf19fc2bb5"
  contenteditable="true"
  data-gramm="false"
  translate="no"
  spellcheck="false"
>
  <p></p>
</div>
`;

export const RichTextEditorExamplePage: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [savedHtml, setSavedHtml] = useState(initialHtml);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = savedHtml;
      checkEmpty();
    }
    // eslint-disable-next-line
  }, [savedHtml]);

  const checkEmpty = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText.trim();
      setIsEmpty(!text);
    }
  };

  const handleInput = () => {
    checkEmpty();
  };

  const handleSave = () => {
    if (editorRef.current) {
      setSavedHtml(editorRef.current.innerHTML);
    }
  };

  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = savedHtml;
      checkEmpty();
    }
  };

  const format = (command: string) => {
    document.execCommand(command, false);
    checkEmpty();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Rich Text Editor Example</h2>
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onMouseDown={e => { e.preventDefault(); format('bold'); }}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onMouseDown={e => { e.preventDefault(); format('italic'); }}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onMouseDown={e => { e.preventDefault(); format('underline'); }}
        >
          <u>U</u>
        </button>
      </div>
        <div className="relative">
            <div
                ref={editorRef}
                className="border rounded p-2 min-h-[300px] bg-white"
                contentEditable
                suppressContentEditableWarning
                style={{ outline: 'none' }}
                aria-label="Description area, start typing to enter text."
                spellCheck={false}
                onInput={handleInput}
            />
            {isEmpty && (
                <span
                    style={{
                        position: 'absolute',
                        top: 8,
                        left: 12,
                        color: '#aaa',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
      Add a description
    </span>
            )}
        </div>
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};