import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEShadowFormProps {
  onSubmit?: (content: string) => void;
}

export const TinyMCEShadowForm: React.FC<TinyMCEShadowFormProps> = ({
  onSubmit,
}) => {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const editorContent = editorRef.current?.getContent() || "";
      setContent(editorContent);
      onSubmit?.(editorContent);

      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">TinyMCE in Shadow DOM Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rich Text Content:
          </label>
          <Editor
            ref={editorRef}
            apiKey="tpryrl4eeliabkvy9u95rrssxcj1bwbmd133jfs2oozq4y2i"
            init={{
              height: 400,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "insertdatetime",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; margin: 10px; }",
              // Shadow DOM specific configurations
              target_list: false,
              link_list: false,
              image_list: false,
              object_resizing: true,
              resize: true,
              branding: false,
              promotion: false,
              // Ensure TinyMCE works within shadow DOM
              setup: (editor) => {
                editor.on("init", () => {
                  console.log("TinyMCE initialized in shadow DOM");
                  // Add test attributes for automation
                  const editorContainer = editor.getContainer();
                  if (editorContainer) {
                    editorContainer.setAttribute(
                      "data-test",
                      "tinymce-editor-container",
                    );
                  }
                });
                editor.on("change", () => {
                  console.log("TinyMCE content changed");
                });
              },
            }}
            onEditorChange={(content) => setContent(content)}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            data-test="tinymce-submit-btn"
            id="tinymce-submit-button"
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </button>

          <button
            type="button"
            onClick={() => {
              editorRef.current?.setContent("");
              setContent("");
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            data-test="tinymce-clear-btn"
          >
            Clear
          </button>
        </div>
      </form>

      {content && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Current Content:</h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            data-test="tinymce-content-preview"
          />
        </div>
      )}
    </div>
  );
};
