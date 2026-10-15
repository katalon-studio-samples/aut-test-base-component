import { useRef, useState, useLayoutEffect } from "react";
import { Bold, Italic, List, Save } from "lucide-react";
import { Command, LibraryState } from "./model";
import { CustomSlider } from "./CustomSlider";
import { cleanAnnouncement } from "./editor";
export function SettingsPanel({
  state,
  act,
  toast,
}: {
  state: LibraryState;
  act: (command: Command) => unknown;
  toast: (message: string, error?: boolean) => void;
}) {
  const editor = useRef<HTMLDivElement>(null);
  const initialMarkup = useRef(state.announcement);
  useLayoutEffect(() => {
    if (editor.current) editor.current.innerHTML = initialMarkup.current;
  }, []);
  const [tab, setTab] = useState("draft");
  const [preview, setPreview] = useState(state.announcement);
  const format = (command: string) => {
    editor.current?.focus();
    document.execCommand(command, false);
    setPreview(cleanAnnouncement(editor.current?.innerHTML || ""));
  };
  return (
    <div className="lib-settings-grid">
      <div className="lib-stack">
        <div className="lib-subpanel">
          <h3>Circulation policy</h3>
          <label htmlFor="lib-default-days">
            Default loan period: <strong>{state.settings.days} days</strong>
            <input
              type="range"
              id="lib-default-days"
              min={1}
              max={30}
              value={state.settings.days}
              onChange={(e) =>
                act({
                  type: "settings",
                  changes: { days: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className="lib-label" htmlFor="lib-limit-slider">
            Loan limit: {state.settings.limit} active loans per reader
          </label>
          <CustomSlider
            value={state.settings.limit}
            onChange={(value) =>
              act({ type: "settings", changes: { limit: value } })
            }
          />
          <div className="lib-form-grid">
            <label htmlFor="lib-closing-time">
              Closing time
              <input
                type="time"
                id="lib-closing-time"
                value={state.settings.closing}
                onChange={(e) =>
                  act({
                    type: "settings",
                    changes: { closing: e.target.value },
                  })
                }
              />
            </label>
            <label htmlFor="lib-category-color">
              Genre label color
              <input
                type="color"
                id="lib-category-color"
                value={state.settings.color}
                onChange={(e) =>
                  act({ type: "settings", changes: { color: e.target.value } })
                }
              />
            </label>
          </div>
        </div>
        <div className="lib-subpanel lib-rules">
          <h3>Borrowing guide</h3>
          <details open>
            <summary>Cards and limits</summary>
            <p>
              Cards must be valid on the simulated date. Additional borrowing is
              blocked for overdue books or when the reader has reached{" "}
              {state.settings.limit} active loans. All card types use the same
              limit in this application.
            </p>
          </details>
          <details>
            <summary>Loan periods and renewals</summary>
            <p>
              Default {state.settings.days} days; choose up to 30 days from the
              borrowing date. Each loan can be renewed once for 7 days if the
              card is valid, the book is not overdue and there are no
              reservations.
            </p>
          </details>
          <details>
            <summary>Return conditions</summary>
            <p>
              Books in good or slightly worn condition return to circulation.
              Damaged copies are recorded and reduce the number available to
              borrow.
            </p>
          </details>
          <details>
            <summary>Reservations and holds</summary>
            <p>
              New requests do not reserve a copy. Held / Ready for pickup
              reserve one copy. Moving back to New requests releases it; lending
              to the reserving reader at Ready for pickup completes the request.
            </p>
          </details>
        </div>
        <div className="lib-subpanel">
          <h3>End-of-day actions</h3>
          <div className="lib-actions">
            <button
              type="button"
              onClick={() =>
                alert(
                  `The library has ${state.loans.filter((l) => !l.returned && l.due < "2026-10-13").length} overdue loans and ${state.reservations.filter((r) => r.stage === "new").length} new requests to process.`,
                )
              }
            >
              View alerts
            </button>
            <button
              type="button"
              onClick={() => {
                if (state.settings.closed)
                  act({ type: "settings", changes: { closed: false } });
                else if (
                  confirm(
                    "Close the library? Borrowing will pause; returns will still be accepted.",
                  )
                )
                  act({ type: "settings", changes: { closed: true } });
              }}
            >
              {state.settings.closed
                ? "Open library"
                : "Confirm library closure"}
            </button>
            <button
              type="button"
              onClick={() => {
                const name = prompt(
                  "Enter a new shelf name (up to 60 characters):",
                );
                if (name !== null) {
                  if (!name.trim() || name.trim().length > 60)
                    toast("Shelf names must contain 1–60 characters.", true);
                  else
                    act({
                      type: "shelf",
                      bookIds: [state.books[0].id],
                      shelf: name.trim(),
                    });
                }
              }}
            >
              Enter shelf name
            </button>
          </div>
          <p className="lib-help">
            The new shelf is created and receives title {state.books[0].id}.
            Dialogs open only when you select an action.
          </p>
        </div>
      </div>
      <div className="lib-subpanel lib-announcement-panel">
        <h3>Library announcements</h3>
        <p className="lib-help">
          Write locally, preview and save a draft. No emails or external
          publishing.
        </p>
        <div
          className="lib-tabs"
          role="tablist"
          aria-label="Compose announcement"
        >
          <button
            type="button"
            id="lib-draft-tab"
            role="tab"
            aria-selected={tab === "draft"}
            aria-controls="lib-draft-panel"
            onClick={() => setTab("draft")}
          >
            Draft
          </button>
          <button
            type="button"
            id="lib-preview-tab"
            role="tab"
            aria-selected={tab === "preview"}
            aria-controls="lib-preview-panel"
            onClick={() => {
              setPreview(cleanAnnouncement(editor.current?.innerHTML || ""));
              setTab("preview");
            }}
          >
            Preview
          </button>
        </div>
        <div
          id="lib-draft-panel"
          role="tabpanel"
          aria-labelledby="lib-draft-tab"
          hidden={tab !== "draft"}
        >
          <div
            className="lib-editor-toolbar"
            aria-label="Announcement formatting"
          >
            <button
              type="button"
              aria-label="Bold"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => format("bold")}
            >
              <Bold size={17} />
            </button>
            <button
              type="button"
              aria-label="Italic"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => format("italic")}
            >
              <Italic size={17} />
            </button>
            <button
              type="button"
              aria-label="Announcement list"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => format("insertUnorderedList")}
            >
              <List size={17} />
            </button>
          </div>
          <div
            id="lib-announcement-editor"
            ref={editor}
            className="lib-editor"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Library announcement content"
            aria-multiline="true"
            onPaste={(e) => {
              e.preventDefault();
              const html = e.clipboardData.getData("text/html");
              if (html)
                document.execCommand(
                  "insertHTML",
                  false,
                  cleanAnnouncement(html),
                );
              else
                document.execCommand(
                  "insertText",
                  false,
                  e.clipboardData.getData("text/plain"),
                );
              setPreview(cleanAnnouncement(e.currentTarget.innerHTML));
            }}
            onInput={(e) =>
              setPreview(cleanAnnouncement(e.currentTarget.innerHTML))
            }
          />
        </div>
        <div
          id="lib-preview-panel"
          role="tabpanel"
          aria-labelledby="lib-preview-tab"
          hidden={tab !== "preview"}
          className="lib-announcement-preview"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
        <button
          type="button"
          className="lib-primary"
          onClick={() => {
            const html = cleanAnnouncement(editor.current?.innerHTML || "");
            setPreview(html);
            act({ type: "announcement", html });
          }}
        >
          <Save size={17} />
          Save draft
        </button>
        <p className="lib-help">
          Supports paragraphs, bold/italic text and lists only. Pasted content
          cannot run scripts.
        </p>
      </div>
    </div>
  );
}
