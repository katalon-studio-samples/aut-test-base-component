import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { available, Book, LibraryState, TODAY, addDays } from "./model";
const shadowCSS = `:host{display:block;color:var(--lib-text,#203a37);font:14px system-ui}*{box-sizing:border-box}section{padding:18px;border:1px solid var(--lib-border,#d6e0da);border-radius:12px;background:var(--lib-panel,#fff)}h3{margin:0 0 8px}p{color:var(--lib-muted,#617871);line-height:1.6}label{display:grid;gap:6px;margin:16px 0}input{height:42px;width:100%;padding:10px;border:1px solid var(--lib-border,#b3c6bf);border-radius:7px;background:var(--lib-panel,#fff);color:inherit;font:inherit}button{padding:9px 12px;border:1px solid var(--lib-border,#b3c6bf);border-radius:7px;background:var(--lib-panel,#fff);color:inherit;font:inherit;cursor:pointer}button:focus-visible,input:focus-visible{outline:3px solid #d9ad47;outline-offset:3px}article{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--lib-border,#d6e0da);padding:14px 0}strong{display:block}small{display:block;color:var(--lib-muted,#617871);margin-top:5px}button{flex-shrink:0}@media(max-width:500px){article{align-items:flex-start;flex-direction:column}input{font-size:16px}}`;
export function QuickLookup({
  state,
  onReserve,
}: {
  state: LibraryState;
  onReserve: (book: Book) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<{
    outer: HTMLElement;
    inner: HTMLElement;
  } | null>(null);
  const [query, setQuery] = useState("");
  useLayoutEffect(() => {
    const root =
      host.current!.shadowRoot || host.current!.attachShadow({ mode: "open" });
    root.replaceChildren();
    const style = document.createElement("style");
    style.textContent = shadowCSS;
    const outer = document.createElement("div");
    const nested = document.createElement("div");
    nested.id = "lib-nested-lookup";
    const innerRoot = nested.attachShadow({ mode: "open" });
    const innerStyle = document.createElement("style");
    innerStyle.textContent = shadowCSS;
    const inner = document.createElement("div");
    innerRoot.append(innerStyle, inner);
    root.append(style, outer, nested);
    setTargets({ outer, inner });
  }, []);
  const matches = state.books
    .filter((b) =>
      `${b.id} ${b.title} ${b.author}`
        .toLocaleLowerCase("en")
        .includes(query.toLocaleLowerCase("en")),
    )
    .slice(0, 5);
  return (
    <div id="lib-shadow-lookup" ref={host}>
      {targets && (
        <>
          {createPortal(
            <section>
              <h3>Quick book lookup</h3>
              <p>
                Search by title, author or book ID; results use the same catalog
                availability.
              </p>
              <label htmlFor="lib-shadow-query">
                Quick lookup keyword
                <input
                  id="lib-shadow-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </section>,
            targets.outer,
          )}
          {createPortal(
            <section aria-label="Quick lookup results">
              <h3>Collection suggestions</h3>
              {matches.map((b) => (
                <article key={b.id}>
                  <div>
                    <strong>{b.title}</strong>
                    <small>
                      {b.id} · {b.author} · Available: {available(state, b.id)}{" "}
                      copies
                    </small>
                  </div>
                  <button
                    id={`lib-shadow-reserve-${b.id}`}
                    onClick={() => onReserve(b)}
                  >
                    Reserve {b.id}
                  </button>
                </article>
              ))}
              {!matches.length && <p>No matching books found.</p>}
            </section>,
            targets.inner,
          )}
        </>
      )}
    </div>
  );
}
export function ReceiptFrame({
  state,
  readerId,
  bookIds,
  onBorrow,
  dark,
}: {
  state: LibraryState;
  readerId: string;
  bookIds: string[];
  dark: boolean;
  onBorrow: (
    readerId: string,
    bookIds: string[],
    borrowed: string,
    due: string,
    note: string,
  ) => { message: string; error: boolean };
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const callback = useRef(onBorrow);
  callback.current = onBorrow;
  const themeRef = useRef(dark);
  themeRef.current = dark;
  const selectionRef = useRef({ readerId, bookIds });
  selectionRef.current = { readerId, bookIds };
  const send = () => {
    const s = stateRef.current;
    ref.current?.contentWindow?.postMessage(
      {
        type: "library:receipt-data",
        today: TODAY,
        due: addDays(TODAY, s.settings.days),
        readers: s.readers.map((r) => ({
          id: r.id,
          name: r.name,
          expires: r.expires,
        })),
        books: s.books.map((b) => ({
          id: b.id,
          title: b.title,
          available: available(s, b.id),
        })),
        selected: selectionRef.current,
        theme: themeRef.current ? "dark" : "light",
      },
      location.origin,
    );
  };
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== ref.current?.contentWindow ||
        !event.data ||
        typeof event.data !== "object"
      )
        return;
      if (event.data.type === "library:receipt-ready") send();
      if (event.data.type === "library:receipt-borrow") {
        const data = event.data;
        if (
          typeof data.readerId !== "string" ||
          !Array.isArray(data.bookIds) ||
          data.bookIds.length > 10 ||
          !data.bookIds.every((id: unknown) => typeof id === "string") ||
          typeof data.borrowed !== "string" ||
          typeof data.due !== "string" ||
          typeof data.note !== "string"
        )
          return;
        const result = callback.current(
          data.readerId,
          data.bookIds,
          data.borrowed,
          data.due,
          data.note.slice(0, 500),
        );
        ref.current?.contentWindow?.postMessage(
          { type: "library:receipt-result", ...result },
          location.origin,
        );
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(send, [state, readerId, bookIds, dark]);
  return (
    <iframe
      id="lib-receipt-frame"
      ref={ref}
      title="Library borrowing slip"
      src="/library/frames/receipt.html"
      onLoad={send}
    />
  );
}
