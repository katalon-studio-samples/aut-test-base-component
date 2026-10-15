import { useRef, useState, useEffect } from "react";
import { GripVertical, Layers, ArrowRight } from "lucide-react";
import { Command, LibraryState, Stage, stageNames, genres } from "./model";
const stages: Stage[] = ["new", "held", "ready"];
export function ReservationBoard({
  state,
  act,
  onCollection,
}: {
  state: LibraryState;
  act: (command: Command) => unknown;
  onCollection: (genre: string, shelf: string) => void;
}) {
  const [bookId, setBookId] = useState(state.books[0].id);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(
    null,
  );
  const dragRef = useRef<{ id: string; x: number; y: number } | null>(null);
  // WebKit may emit only compatibility mouse events immediately after an HTML5 drop.
  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (!dragRef.current) return;
      if (!(event.buttons & 1)) {
        dragRef.current = null;
        setDrag(null);
        return;
      }
      const next = { ...dragRef.current, x: event.clientX, y: event.clientY };
      dragRef.current = next;
      setDrag(next);
    };
    const finish = (event: MouseEvent) => {
      if (!dragRef.current) return;
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest<HTMLElement>("[data-pointer-stage]");
      if (target)
        act({
          type: "stage",
          id: dragRef.current.id,
          stage: target.dataset.pointerStage as Stage,
        });
      dragRef.current = null;
      setDrag(null);
    };
    const cancel = () => {
      dragRef.current = null;
      setDrag(null);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", finish);
    window.addEventListener("blur", cancel);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", finish);
      window.removeEventListener("blur", cancel);
    };
  }, [act]);
  const lookupBook = (id: string) => state.books.find((b) => b.id === id)!;
  const lookupReader = (id: string) => state.readers.find((r) => r.id === id)!;
  const selected = state.books.find((b) => b.id === bookId) || state.books[0];
  const genreShelves: Record<string, string[]> = {
    Literature: ["A1 · Literature", "A2 · Literature"],
    Science: ["B1 · Science"],
    History: ["C1 · History"],
    Technology: ["B2 · Technology"],
    Children: ["D1 · Children"],
    Art: ["C2 · Art"],
  };
  return (
    <div className="lib-stack lib-board-content">
      <p className="lib-help">
        Drag requests to a new column or use the Move request control. Held and
        Ready for pickup each reserve one copy; moving back to New requests
        releases it. Lending a ready book to its reserving reader completes the
        request.
      </p>
      <div className="lib-kanban">
        {stages.map((stage) => (
          <div
            className="lib-kanban-column"
            key={stage}
            id={`lib-board-${stage}`}
            data-testid={`lib-board-${stage}`}
            onDragOver={(e) => {
              if (
                e.dataTransfer.types.includes(
                  "application/x-library-reservation",
                )
              )
                e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData(
                "application/x-library-reservation",
              );
              if (id) act({ type: "stage", id, stage });
            }}
          >
            <h3>
              {stageNames[stage]}
              <span>
                {state.reservations.filter((r) => r.stage === stage).length}
              </span>
            </h3>
            {state.reservations
              .filter((r) => r.stage === stage)
              .map((r) => (
                <article
                  className="lib-reservation"
                  key={r.id}
                  id={`lib-reservation-${r.id}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/x-library-reservation",
                      r.id,
                    );
                    e.dataTransfer.effectAllowed = "move";
                  }}
                >
                  <div className="lib-between">
                    <span className="lib-code">{r.id}</span>
                    <GripVertical size={17} aria-hidden="true" />
                  </div>
                  <h4>{lookupBook(r.bookId).title}</h4>
                  <p>{lookupReader(r.readerId).name}</p>
                  <small>
                    {r.bookId} · {r.date}
                  </small>
                  <label className="lib-choice">
                    Move request
                    <select
                      aria-label={`Move request ${r.id}`}
                      value={r.stage}
                      onChange={(e) =>
                        act({
                          type: "stage",
                          id: r.id,
                          stage: e.target.value as Stage,
                        })
                      }
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {stageNames[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                </article>
              ))}
          </div>
        ))}
      </div>
      <div className="lib-subpanel">
        <h3>Mouse dispatch board</h3>
        <p className="lib-help">
          Drag a card to the processing area on the right. You can also press
          the right arrow key to move to the next stage.
        </p>
        <div className="lib-pointer-board">
          <div className="lib-pointer-pool">
            {state.reservations
              .filter((r) => r.stage !== "collected")
              .slice(0, 6)
              .map((r) => (
                <button
                  type="button"
                  key={r.id}
                  id={`lib-pointer-${r.id}`}
                  className="lib-pointer-item"
                  onMouseDown={(e) => {
                    if (e.button !== 0 || dragRef.current) return;
                    e.preventDefault();
                    const next = { id: r.id, x: e.clientX, y: e.clientY };
                    dragRef.current = next;
                    setDrag(next);
                  }}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    const next = { id: r.id, x: e.clientX, y: e.clientY };
                    dragRef.current = next;
                    setDrag(next);
                  }}
                  onPointerMove={(e) => {
                    if (
                      e.currentTarget.hasPointerCapture(e.pointerId) &&
                      dragRef.current
                    ) {
                      const next = {
                        ...dragRef.current,
                        x: e.clientX,
                        y: e.clientY,
                      };
                      dragRef.current = next;
                      setDrag(next);
                    }
                  }}
                  onPointerUp={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId))
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    const target = document
                      .elementFromPoint(e.clientX, e.clientY)
                      ?.closest<HTMLElement>("[data-pointer-stage]");
                    if (target && dragRef.current)
                      act({
                        type: "stage",
                        id: dragRef.current.id,
                        stage: target.dataset.pointerStage as Stage,
                      });
                    dragRef.current = null;
                    setDrag(null);
                  }}
                  onPointerCancel={() => {
                    dragRef.current = null;
                    setDrag(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      act({
                        type: "stage",
                        id: r.id,
                        stage: stages[(stages.indexOf(r.stage) + 1) % 3],
                      });
                    }
                  }}
                  aria-label={`Drag request ${r.id} with the mouse`}
                >
                  <GripVertical size={15} />
                  <span>
                    {r.id}
                    <small>{stageNames[r.stage]}</small>
                  </span>
                </button>
              ))}
          </div>
          <div className="lib-pointer-targets">
            {stages.map((s) => (
              <div
                key={s}
                id={`lib-pointer-target-${s}`}
                data-pointer-stage={s}
              >
                <ArrowRight size={18} />
                {stageNames[s]}
              </div>
            ))}
          </div>
        </div>
        {drag && (
          <div
            className="lib-drag-ghost"
            style={{ left: drag.x + 12, top: drag.y + 12 }}
          >
            {drag.id}
          </div>
        )}
      </div>
      <div className="lib-subpanel">
        <div className="lib-between lib-wrap">
          <div>
            <h3>Classification and shelf moves</h3>
            <p className="lib-help">
              Drag a book card into a collection to change both its genre and
              shelf location.
            </p>
          </div>
          <div
            className="lib-hover-menu"
            onMouseEnter={() => setHoverOpen(true)}
            onMouseLeave={() => setHoverOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={hoverOpen}
              onClick={() => setHoverOpen(!hoverOpen)}
            >
              <Layers size={17} />
              Collection
            </button>
            <ul className="lib-menu-tree" hidden={!hoverOpen}>
              {genres.map((g) => (
                <li key={g}>
                  <button type="button" aria-haspopup="menu">
                    {g}
                    <span>›</span>
                  </button>
                  <ul>
                    {genreShelves[g].map((s) => (
                      <li key={s}>
                        <a
                          href="#lib-catalog"
                          onClick={() => {
                            onCollection(g, s);
                            setHoverOpen(false);
                          }}
                        >
                          {s}
                          <small>
                            {
                              state.books.filter(
                                (b) => b.genre === g && b.shelf === s,
                              ).length
                            }{" "}
                            titles
                          </small>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lib-shelf-workspace">
          <div>
            <label htmlFor="lib-classify-book">
              Select a book to move
              <select
                aria-label="Select a book to move"
                id="lib-classify-book"
                value={selected.id}
                onChange={(e) => setBookId(e.target.value)}
              >
                {state.books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} · {b.title}
                  </option>
                ))}
              </select>
            </label>
            <article
              id="lib-shelf-drag-book"
              className="lib-book-token"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/x-library-book",
                  selected.id,
                );
                e.dataTransfer.effectAllowed = "move";
              }}
            >
              <img
                src={selected.cover}
                alt={`Cover ${selected.title}`}
                width={62}
                height={82}
              />
              <div>
                <strong>{selected.title}</strong>
                <p>
                  {selected.genre} · {selected.shelf}
                </p>
                <small>Drag this book to a new shelf</small>
              </div>
            </article>
          </div>
          <div className="lib-shelf-targets">
            {genres.map((g) => (
              <div
                key={g}
                id={`lib-shelf-target-${genres.indexOf(g)}`}
                className="lib-shelf-target"
                onDragOver={(e) => {
                  if (
                    e.dataTransfer.types.includes("application/x-library-book")
                  )
                    e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData(
                    "application/x-library-book",
                  );
                  if (id)
                    act({
                      type: "shelf",
                      bookIds: [id],
                      shelf: genreShelves[g][0],
                      genre: g,
                    });
                }}
              >
                <strong>{g}</strong>
                <span>{genreShelves[g][0]}</span>
                <button
                  type="button"
                  onClick={() =>
                    act({
                      type: "shelf",
                      bookIds: [selected.id],
                      shelf: genreShelves[g][0],
                      genre: g,
                    })
                  }
                  aria-label={`Move ${selected.id} to ${g}`}
                >
                  Move to shelf
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
