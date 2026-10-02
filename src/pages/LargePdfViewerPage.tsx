import { useState } from "react";

export function LargePdfViewerPage() {
  const [pageCount, setPageCount] = useState(38);
  const [document, setDocument] = useState<{
    pages: number;
    revision: number;
  } | null>(null);
  const buttonClass =
    "rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50";

  return (
    <section className="space-y-4 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold">Large PDF Viewer</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Open a synthetic scanned document, scroll through its pages, and try the
        viewer controls. The 38-page document uses inline page images to
        exercise large Session Replay payloads.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="pdf-page-count">Document size</label>
        <select
          id="pdf-page-count"
          value={pageCount}
          onChange={(event) => setPageCount(Number(event.target.value))}
          className="rounded border p-2 dark:border-gray-600 dark:bg-gray-800"
          data-test="pdf-page-count"
        >
          <option value={2}>2 pages — small comparison</option>
          <option value={38}>38 pages — large document</option>
        </select>
        <button
          className={buttonClass}
          data-test="pdf-open"
          onClick={() =>
            setDocument((current) => ({
              pages: pageCount,
              revision: (current?.revision ?? 0) + 1,
            }))
          }
        >
          {document ? "Reload document" : "Open document"}
        </button>
        <button
          className={buttonClass}
          disabled={!document}
          data-test="pdf-close"
          onClick={() => setDocument(null)}
        >
          Close document
        </button>
      </div>
      {document ? (
        <iframe
          key={document.revision}
          title="Synthetic PDF page image viewer"
          data-test="pdf-viewer-frame"
          src={`/fixtures/large-pdf-viewer/index.html?pages=${document.pages}`}
          className="h-[75vh] min-h-96 w-full rounded-lg border border-gray-300 bg-gray-100"
        />
      ) : (
        <p
          role="status"
          className="rounded-lg border border-gray-300 p-8 dark:border-gray-700"
        >
          No document open. Choose a size and open the viewer.
        </p>
      )}
    </section>
  );
}
