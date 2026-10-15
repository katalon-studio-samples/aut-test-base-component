import { useEffect, useRef, useState } from "react";
import { Book, Reader, LibraryState, genres, cardNames, TODAY } from "./model";
import { Modal } from "./Modal";
type Result = { message: string; error: boolean };
export function BookForm({
  book,
  state,
  onSave,
  onClose,
}: {
  book: Book | null;
  state: LibraryState;
  onSave: (book: Book, create: boolean) => Result;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Book>(() =>
    book
      ? { ...book }
      : {
          id: "",
          title: "",
          author: "",
          genre: genres[0],
          isbn: "",
          year: 2026,
          shelf: state.shelves[0],
          copies: 1,
          damaged: 0,
          damagedCopies: [],
          description: "",
          cover: "/library/covers/cover-0.svg",
        },
  );
  const [error, setError] = useState("");
  const patch = (changes: Partial<Book>) =>
    setDraft((prev) => ({ ...prev, ...changes }));
  return (
    <Modal
      title={book ? `Edit book ${book.id}` : "Add a title"}
      onClose={onClose}
      wide
    >
      <form
        className="lib-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const r = onSave(draft, !book);
          if (r.error) setError(r.message);
          else onClose();
        }}
      >
        <div className="lib-form-grid">
          <label htmlFor="lib-book-title">
            Book title
            <input
              id="lib-book-title"
              value={draft.title}
              onChange={(e) => patch({ title: e.target.value })}
              required
              maxLength={160}
            />
          </label>
          <label htmlFor="lib-book-author">
            Author
            <input
              id="lib-book-author"
              value={draft.author}
              onChange={(e) => patch({ author: e.target.value })}
              required
              maxLength={100}
            />
          </label>
          <label htmlFor="lib-book-genre">
            Book genre
            <select
              aria-label="Book genre"
              id="lib-book-genre"
              value={draft.genre}
              onChange={(e) => patch({ genre: e.target.value })}
            >
              <optgroup label="Collection">
                {genres.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </optgroup>
            </select>
          </label>
          <label htmlFor="lib-book-isbn">
            ISBN (13 digits)
            <input
              id="lib-book-isbn"
              inputMode="numeric"
              value={draft.isbn}
              onChange={(e) => patch({ isbn: e.target.value })}
              required
              maxLength={13}
            />
          </label>
          <label htmlFor="lib-book-year">
            Publication year
            <input
              id="lib-book-year"
              type="number"
              min={1450}
              max={2026}
              value={draft.year || ""}
              onChange={(e) => patch({ year: Number(e.target.value) })}
            />
          </label>
          <label htmlFor="lib-book-copies">
            Total copies
            <input
              id="lib-book-copies"
              type="number"
              min={1}
              max={100}
              value={draft.copies || ""}
              onChange={(e) => patch({ copies: Number(e.target.value) })}
            />
          </label>
          <label htmlFor="lib-book-shelf">
            Shelf location
            <select
              aria-label="Shelf location"
              id="lib-book-shelf"
              value={draft.shelf}
              onChange={(e) => patch({ shelf: e.target.value })}
            >
              {state.shelves.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label htmlFor="lib-book-cover">
            Cover from local collection
            <select
              aria-label="Cover from local collection"
              id="lib-book-cover"
              value={draft.cover}
              onChange={(e) => patch({ cover: e.target.value })}
            >
              {genres.map((g, i) => (
                <option key={g} value={`/library/covers/cover-${i}.svg`}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="lib-full" htmlFor="lib-book-description">
            Book description
            <textarea
              id="lib-book-description"
              rows={4}
              maxLength={1200}
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </label>
        </div>
        {error && (
          <p className="lib-error" role="alert">
            {error}
          </p>
        )}
        <div className="lib-form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="lib-primary" type="submit">
            Save book
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function ReaderForm({
  reader,
  onSave,
  onClose,
}: {
  reader: Reader | null;
  onSave: (reader: Reader, create: boolean) => Result;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Reader>(() =>
    reader
      ? structuredClone(reader)
      : {
          id: "",
          name: "",
          email: "",
          phone: "",
          card: "standard",
          expires: "2027-10-13",
          interests: [],
          branches: ["Central"],
          notify: true,
          note: "",
          photo: "",
        },
  );
  const [error, setError] = useState("");
  const fileRef = useRef<FileReader | null>(null);
  useEffect(() => () => fileRef.current?.abort(), []);
  const patch = (changes: Partial<Reader>) =>
    setDraft((prev) => ({ ...prev, ...changes }));
  const image = (file: File | undefined) => {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError(
        "Choose a PNG/JPEG/WebP image up to 2 MB; it is stored only in this local session.",
      );
      return;
    }
    fileRef.current?.abort();
    const r = new FileReader();
    fileRef.current = r;
    r.onload = () => {
      patch({ photo: String(r.result) });
      setError("");
    };
    r.onerror = () =>
      setError("Unable to read the image. Please select the local file again.");
    r.readAsDataURL(file);
  };
  return (
    <Modal
      title={reader ? `Update reader ${reader.id}` : "Register reader"}
      onClose={onClose}
      wide
    >
      <form
        className="lib-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const r = onSave(draft, !reader);
          if (r.error) setError(r.message);
          else onClose();
        }}
      >
        <div className="lib-form-grid">
          <label htmlFor="lib-reader-name">
            Reader name
            <input
              id="lib-reader-name"
              type="text"
              required
              maxLength={100}
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </label>
          <label htmlFor="lib-reader-email">
            Reader email
            <input
              id="lib-reader-email"
              type="email"
              required
              maxLength={120}
              placeholder="docgia@example.test"
              value={draft.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
          </label>
          <label htmlFor="lib-reader-phone">
            Reader phone
            <input
              id="lib-reader-phone"
              type="tel"
              required
              maxLength={11}
              placeholder="0000000001"
              value={draft.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </label>
          <label htmlFor="lib-reader-expires">
            Card expiry date
            <input
              id="lib-reader-expires"
              type="date"
              required
              min={TODAY}
              value={draft.expires}
              onChange={(e) => patch({ expires: e.target.value })}
            />
          </label>
          <fieldset className="lib-full">
            <legend>Card type</legend>
            <div className="lib-choice-row">
              {Object.entries(cardNames).map(([value, label]) => (
                <label className="lib-choice" key={value}>
                  <input
                    type="radio"
                    name="lib-reader-card"
                    value={value}
                    checked={draft.card === value}
                    onChange={() => patch({ card: value as Reader["card"] })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="lib-full">
            <legend>Reading interests</legend>
            <div className="lib-choice-row">
              {genres.map((g) => (
                <label className="lib-choice" key={g}>
                  <input
                    type="checkbox"
                    checked={draft.interests.includes(g)}
                    onChange={(e) =>
                      patch({
                        interests: e.target.checked
                          ? [...draft.interests, g]
                          : draft.interests.filter((x) => x !== g),
                      })
                    }
                  />
                  {g}
                </label>
              ))}
            </div>
          </fieldset>
          <label htmlFor="lib-reader-branches">
            Preferred branches
            <select
              aria-label="Preferred branches"
              id="lib-reader-branches"
              multiple
              value={draft.branches}
              onChange={(e) =>
                patch({
                  branches: Array.from(
                    e.target.selectedOptions,
                    (o) => o.value,
                  ),
                })
              }
            >
              <optgroup label="City branches">
                <option>Central</option>
                <option>East branch</option>
              </optgroup>
              <optgroup label="Outer branches">
                <option>West branch</option>
                <option>Mobile library</option>
              </optgroup>
            </select>
            <small>Use Ctrl/Cmd to select multiple branches.</small>
          </label>
          <div className="lib-stack">
            <span className="lib-label">Reader notifications</span>
            <button
              type="button"
              id="lib-reader-notify"
              role="switch"
              aria-checked={draft.notify}
              aria-label="Receive library notifications"
              className={`lib-switch ${draft.notify ? "on" : ""}`}
              onClick={() => patch({ notify: !draft.notify })}
            >
              <span />
              {draft.notify ? "Enabled" : "Disabled"}
            </button>
            <small>Saves your preference only; no email or SMS is sent.</small>
          </div>
          <label className="lib-full" htmlFor="lib-reader-note">
            Reader notes
            <textarea
              id="lib-reader-note"
              rows={3}
              maxLength={500}
              value={draft.note}
              onChange={(e) => patch({ note: e.target.value })}
            />
          </label>
          <label htmlFor="lib-reader-photo">
            Local card photo
            <input
              id="lib-reader-photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => image(e.target.files?.[0])}
            />
            <small>No upload; PNG/JPEG/WebP, up to 2 MB.</small>
          </label>
          <div>
            {draft.photo ? (
              <>
                <img
                  className="lib-reader-photo"
                  src={draft.photo}
                  alt={`Card photo ${draft.name || "new reader"}`}
                />
                <button type="button" onClick={() => patch({ photo: "" })}>
                  Remove card photo
                </button>
              </>
            ) : (
              <p className="lib-muted">No card photo selected.</p>
            )}
          </div>
        </div>
        {error && (
          <p className="lib-error" role="alert">
            {error}
          </p>
        )}
        <div className="lib-form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="lib-primary" type="submit">
            Save reader
          </button>
        </div>
      </form>
    </Modal>
  );
}
