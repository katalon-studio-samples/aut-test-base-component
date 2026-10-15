import { CSSProperties, useRef, useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  MoreHorizontal,
  Users,
  ArrowDownUp,
  Sun,
  Moon,
  ArrowUpRight,
  Bell,
  Library,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Book,
  Reader,
  Loan,
  LibraryState,
  Command,
  Scale,
  TODAY,
  genres,
  seedLibrary,
  transact,
  available,
  activeLoans,
  eligible,
  loanStatus,
  addDays,
  displayDate,
  cardNames,
} from "./library-management/model";
import { Modal } from "./library-management/Modal";
import { BookForm, ReaderForm } from "./library-management/Forms";
import { ReservationBoard } from "./library-management/ReservationBoard";
import { SettingsPanel } from "./library-management/SettingsPanel";
import { QuickLookup, ReceiptFrame } from "./library-management/EmbeddedPanels";
import "./library-management/library.css";
const sections = [
  ["overview", "Overview"],
  ["catalog", "Book catalog"],
  ["readers", "Readers"],
  ["circulation", "Borrowing and returns"],
  ["reservations", "Reservations & classification"],
  ["settings", "Settings & announcements"],
  ["lookup", "Lookup & borrowing slips"],
];
type BookKey =
  | "id"
  | "title"
  | "author"
  | "genre"
  | "isbn"
  | "year"
  | "shelf"
  | "copies"
  | "available";
const columns: { key: BookKey; label: string }[] = [
  { key: "id", label: "Book ID" },
  { key: "title", label: "Book title" },
  { key: "author", label: "Author" },
  { key: "genre", label: "Genre" },
  { key: "isbn", label: "ISBN" },
  { key: "year", label: "Year" },
  { key: "shelf", label: "Shelf location" },
  { key: "copies", label: "Total copies" },
  { key: "available", label: "Available" },
];
const compare = (a: string | number, b: string | number) =>
  typeof a === "number" && typeof b === "number"
    ? a - b
    : String(a).localeCompare(String(b), "en", { numeric: true });
function PanelTitle({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="lib-panel-title">
      <div>
        <span className="lib-eyebrow">{number}</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
    </header>
  );
}
export function LibraryManagementPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    document.title = "Library Management · Knowledge Garden";
    document.documentElement.lang = "en";
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
    };
  }, []);
  const [state, setState] = useState<LibraryState>(() => seedLibrary());
  const stateRef = useRef(state);
  stateRef.current = state;
  const [resetKey, setResetKey] = useState(0);
  const [notice, setNotice] = useState<{
    message: string;
    error: boolean;
  } | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [shelfFilter, setShelfFilter] = useState("");
  const [sort, setSort] = useState<BookKey>("id");
  const [desc, setDesc] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkMenu, setBulkMenu] = useState(false);
  const [bulkShelf, setBulkShelf] = useState(state.shelves[0]);
  const [bulkModal, setBulkModal] = useState(false);
  const [bookForm, setBookForm] = useState<Book | null | undefined>(undefined);
  const [readerForm, setReaderForm] = useState<Reader | null | undefined>(
    undefined,
  );
  const [detail, setDetail] = useState<string | null>(null);
  const [reserveBook, setReserveBook] = useState<Book | null>(null);
  const [reserveReader, setReserveReader] = useState("");
  const [returnLoan, setReturnLoan] = useState<Loan | null>(null);
  const [returnCondition, setReturnCondition] = useState("good");
  const [returnNote, setReturnNote] = useState("");
  const [modalError, setModalError] = useState("");
  const [readerQuery, setReaderQuery] = useState("");
  const [readerCard, setReaderCard] = useState("");
  const [loanFilter, setLoanFilter] = useState("");
  const [loanQuery, setLoanQuery] = useState("");
  const [borrowReader, setBorrowReader] = useState("");
  const [borrowQuery, setBorrowQuery] = useState("");
  const [borrowBooks, setBorrowBooks] = useState<string[]>([]);
  const [borrowed, setBorrowed] = useState(TODAY);
  const [due, setDue] = useState(addDays(TODAY, state.settings.days));
  const [borrowNote, setBorrowNote] = useState("");
  const [borrowError, setBorrowError] = useState("");
  const toast = (message: string, error = false) =>
    setNotice({ message, error });
  const act = (command: Command) => {
    const result = transact(stateRef.current, command);
    if (!result.error) {
      stateRef.current = result.state;
      setState(result.state);
    }
    toast(result.message, result.error);
    return result;
  };
  const reset = (scale: Scale) => {
    const fresh = seedLibrary(scale);
    stateRef.current = fresh;
    setState(fresh);
    setQuery("");
    setGenre("");
    setStatus("");
    setShelfFilter("");
    setSelected([]);
    setBorrowBooks([]);
    setBorrowReader("");
    setReserveBook(null);
    setBookForm(undefined);
    setReaderForm(undefined);
    setDetail(null);
    setReturnLoan(null);
    setBulkModal(false);
    setBulkMenu(false);
    setReaderQuery("");
    setReaderCard("");
    setLoanQuery("");
    setLoanFilter("");
    setBorrowQuery("");
    setBorrowed(TODAY);
    setDue(addDays(TODAY, fresh.settings.days));
    setBorrowError("");
    setBorrowNote("");
    setResetKey((k) => k + 1);
    toast("Library sample data has been reset.");
  };
  const requestReserve = (book: Book) => {
    setReserveBook(book);
    setReserveReader(borrowReader);
    setModalError("");
  };
  const borrow = (
    readerId: string,
    bookIds: string[],
    date: string,
    deadline: string,
    note: string,
  ) => {
    const r = act({
      type: "borrow",
      readerId,
      bookIds,
      borrowed: date,
      due: deadline,
      note,
    });
    if (!r.error) {
      setBorrowBooks([]);
      setSelected([]);
      setBorrowError("");
    }
    return r;
  };
  const loans = activeLoans(state);
  const overdue = loans.filter((l) => l.due < TODAY);
  const reservations = state.reservations.filter(
    (r) => r.stage !== "collected",
  );
  const totalCopies = state.books.reduce((n, b) => n + b.copies, 0);
  const shelfBooks = state.books;
  const books = state.books
    .filter(
      (b) =>
        `${b.id} ${b.title} ${b.author} ${b.isbn}`
          .toLocaleLowerCase("en")
          .includes(query.toLocaleLowerCase("en")) &&
        (!genre || b.genre === genre) &&
        (!shelfFilter || b.shelf === shelfFilter) &&
        (!status ||
          (status === "available"
            ? available(state, b.id) > 0
            : available(state, b.id) === 0)),
    )
    .sort((a, b) => {
      const av = sort === "available" ? available(state, a.id) : a[sort];
      const bv = sort === "available" ? available(state, b.id) : b[sort];
      return (desc ? -1 : 1) * compare(av, bv) || compare(a.id, b.id);
    });
  const readers = state.readers.filter(
    (r) =>
      `${r.id} ${r.name} ${r.email}`
        .toLocaleLowerCase("en")
        .includes(readerQuery.toLocaleLowerCase("en")) &&
      (!readerCard || r.card === readerCard),
  );
  const shownLoans = state.loans.filter(
    (l) =>
      (!loanFilter || loanStatus(l) === loanFilter) &&
      `${l.id} ${state.books.find((b) => b.id === l.bookId)?.title} ${state.readers.find((r) => r.id === l.readerId)?.name}`
        .toLocaleLowerCase("en")
        .includes(loanQuery.toLocaleLowerCase("en")),
  );
  const detailBook = state.books.find((b) => b.id === detail);
  const allSelected =
    books.length > 0 && books.every((b) => selected.includes(b.id));
  const bookName = (id: string) =>
    state.books.find((b) => b.id === id)?.title || id;
  const readerName = (id: string) =>
    state.readers.find((r) => r.id === id)?.name || id;
  return (
    <div
      className={`library-app ${isDark ? "lib-dark" : ""}`}
      style={{ "--lib-category-color": state.settings.color } as CSSProperties}
      id="library-management"
    >
      <aside className="lib-sidebar">
        <a href="#lib-overview" className="lib-brand">
          <span>
            <Library size={23} />
          </span>
          <div>
            Library<span>Knowledge Garden</span>
          </div>
        </a>
        <p className="lib-sidebar-label">MANAGEMENT WORKSPACE</p>
        <nav aria-label="Library navigation">
          {sections.map(([id, label], i) => (
            <a key={id} href={`#lib-${id}`}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="lib-sidebar-note">
          <BookOpen size={21} />
          <strong>Read. Connect. Discover.</strong>
          <p>A shared space for books and book lovers.</p>
        </div>
        <a href="/" className="lib-back">
          Back to AUT <ArrowUpRight size={15} />
        </a>
      </aside>
      <main className="lib-main">
        <header className="lib-topbar">
          <div>
            <span className="lib-eyebrow">LIBRARY MANAGEMENT SYSTEM</span>
            <p>
              <span
                className={`lib-dot ${state.settings.closed ? "closed" : ""}`}
              />
              {state.settings.closed ? "Closed" : "Open"} · Closes at{" "}
              {state.settings.closing}
            </p>
          </div>
          <div className="lib-actions">
            <label className="lib-scale-label" htmlFor="lib-scale">
              Library size
              <select
                aria-label="Library size"
                id="lib-scale"
                value={state.scale}
                onChange={(e) => {
                  const scale = e.target.value as Scale;
                  if (
                    confirm(
                      "Change library size and reset sample data? Local changes will be lost.",
                    )
                  )
                    reset(scale);
                }}
              >
                <option value="small">Small branch</option>
                <option value="city">City library</option>
                <option value="central">Central library</option>
              </select>
            </label>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <section className="lib-hero" id="lib-overview">
          <div>
            <span className="lib-eyebrow">WELCOME BACK</span>
            <h1>
              Every book,
              <br />a new journey.
            </h1>
            <p>
              Manage your collection, connect with readers and keep books
              circulating in one place.
            </p>
            <div className="lib-actions">
              <a className="lib-button lib-primary" href="#lib-circulation">
                <Plus size={17} />
                Borrow books
              </a>
              <a className="lib-button" href="#lib-catalog">
                Explore the catalog
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="lib-hero-art" aria-label="Library collection">
            <img
              src="/library/covers/cover-0.svg"
              alt="Literature collection cover"
            />
            <img
              src="/library/covers/cover-3.svg"
              alt="Technology collection cover"
            />
            <span>
              KNOWLEDGE GARDEN
              <br />
              <strong>EST. 2026</strong>
            </span>
          </div>
        </section>
        <div className="lib-local-note">
          <Check size={16} />
          <span>
            Sample data; changes last only for this local session. Simulated
            date: <strong>{displayDate(TODAY)}</strong>. No emails, image
            uploads or business backend requests.
          </span>
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Reset sample data? Changes in this session will be lost.",
                )
              )
                reset(state.scale);
            }}
          >
            <RotateCcw size={15} />
            Reset sample data
          </button>
        </div>
        <nav className="lib-toc" aria-label="Quick navigation">
          {sections.map(([id, label]) => (
            <a key={id} href={`#lib-${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="lib-stats">
          <article>
            <span className="lib-stat-icon">
              <BookOpen size={20} />
            </span>
            <div>
              <p>Total titles</p>
              <strong data-testid="lib-stat-books">{state.books.length}</strong>
              <small>{totalCopies} copies in the collection</small>
            </div>
          </article>
          <article>
            <span className="lib-stat-icon">
              <ArrowDownUp size={20} />
            </span>
            <div>
              <p>Copies on loan</p>
              <strong data-testid="lib-stat-loans">{loans.length}</strong>
              <small>{state.readers.length} registered readers</small>
            </div>
          </article>
          <article>
            <span className="lib-stat-icon lib-warning">
              <Bell size={20} />
            </span>
            <div>
              <p>Overdue loans</p>
              <strong data-testid="lib-stat-overdue">{overdue.length}</strong>
              <small>Readers need return reminders</small>
            </div>
          </article>
          <article>
            <span className="lib-stat-icon lib-purple">
              <Users size={20} />
            </span>
            <div>
              <p>Reservations</p>
              <strong data-testid="lib-stat-reservations">
                {reservations.length}
              </strong>
              <small>
                {reservations.filter((r) => r.stage === "ready").length}{" "}
                reservations ready for pickup
              </small>
            </div>
          </article>
        </div>
        <div className="lib-overview-grid">
          <article className="lib-panel">
            <div className="lib-between">
              <h2>Recent activity</h2>
              <span className="lib-badge">Library activity log</span>
            </div>
            <ol className="lib-activity-list">
              {state.activities.slice(0, 10).map((a) => (
                <li key={a.id}>
                  <span className="lib-activity-dot" />
                  <div>
                    <strong>{a.text}</strong>
                    <time dateTime={a.date}>{displayDate(a.date)}</time>
                  </div>
                </li>
              ))}
            </ol>
          </article>
          <article className="lib-panel">
            <h2>Needs attention today</h2>
            <div className="lib-alert-list">
              {loans
                .filter((l) => l.due >= TODAY && l.due <= addDays(TODAY, 3))
                .slice(0, 5)
                .map((l) => (
                  <a
                    href="#lib-circulation"
                    key={l.id}
                    onClick={() => setLoanFilter("On loan")}
                  >
                    <Bell size={17} />
                    <div>
                      <strong>
                        {readerName(l.readerId)} · {l.id}
                      </strong>
                      <span>
                        {bookName(l.bookId)} · Due {displayDate(l.due)}
                      </span>
                    </div>
                  </a>
                ))}
              {reservations
                .filter((r) => r.stage === "new")
                .slice(0, 3)
                .map((r) => (
                  <a href="#lib-reservations" key={r.id}>
                    <BookOpen size={17} />
                    <div>
                      <strong>{r.id} · Request awaiting processing</strong>
                      <span>{bookName(r.bookId)}</span>
                    </div>
                  </a>
                ))}
              {!loans.some(
                (l) => l.due >= TODAY && l.due <= addDays(TODAY, 3),
              ) &&
                !reservations.some((r) => r.stage === "new") && (
                  <p>No pending requests or books due soon.</p>
                )}
            </div>
          </article>
        </div>
        <section className="lib-panel lib-section" id="lib-catalog">
          <PanelTitle
            number="01 / COLLECTION"
            title="Book catalog"
            subtitle="All titles are displayed together. Search and sort to explore the collection."
          >
            <button
              className="lib-primary"
              type="button"
              onClick={() => setBookForm(null)}
            >
              <Plus size={17} />
              Add book
            </button>
          </PanelTitle>
          <div className="lib-filterbar">
            <label className="lib-search-label" htmlFor="lib-book-search">
              <span>Search books</span>
              <div>
                <Search size={17} />
                <input
                  id="lib-book-search"
                  type="search"
                  placeholder="Title, author, ID or ISBN"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </label>
            <label htmlFor="lib-book-filter-genre">
              Genre
              <select
                aria-label="Genre"
                id="lib-book-filter-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">All genres</option>
                {genres.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </label>
            <label htmlFor="lib-book-filter-status">
              Availability
              <select
                aria-label="Availability"
                id="lib-book-filter-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </label>
            <label htmlFor="lib-book-filter-shelf">
              Bookshelf
              <select
                aria-label="Bookshelf"
                id="lib-book-filter-shelf"
                value={shelfFilter}
                onChange={(e) => setShelfFilter(e.target.value)}
              >
                <option value="">All shelves</option>
                {state.shelves.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="lib-table-toolbar">
            <span>
              <strong>{books.length}</strong> titles · {selected.length}{" "}
              selected
            </span>
            <div className="lib-actions">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGenre("");
                  setStatus("");
                  setShelfFilter("");
                }}
              >
                Clear filters
              </button>
              <div className="lib-menu-wrap">
                <button
                  type="button"
                  aria-expanded={bulkMenu}
                  aria-haspopup="menu"
                  onClick={() => setBulkMenu(!bulkMenu)}
                >
                  <MoreHorizontal size={19} />
                  Book actions
                </button>
                {bulkMenu && (
                  <div className="lib-dropdown" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      disabled={!selected.length}
                      onClick={() => {
                        setBulkShelf(state.shelves[0]);
                        setBulkModal(true);
                        setBulkMenu(false);
                      }}
                    >
                      Move selected books to a shelf
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={!selected.length}
                      onClick={() => {
                        setBorrowBooks(selected);
                        setBulkMenu(false);
                        document
                          .getElementById("lib-circulation")
                          ?.scrollIntoView();
                      }}
                    >
                      Add selected books to borrowing slip
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSelected([]);
                        setBulkMenu(false);
                      }}
                    >
                      Deselect all
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="lib-table-scroll"
            tabIndex={0}
            aria-label="Catalog table; scroll horizontally to see all columns"
          >
            <table id="lib-books-table">
              <caption className="lib-sr-only">Library catalog</caption>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all displayed books"
                      checked={allSelected}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [
                                ...new Set([
                                  ...selected,
                                  ...books.map((b) => b.id),
                                ]),
                              ]
                            : selected.filter(
                                (id) => !books.some((b) => b.id === id),
                              ),
                        )
                      }
                    />
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      aria-sort={
                        sort === c.key
                          ? desc
                            ? "descending"
                            : "ascending"
                          : "none"
                      }
                    >
                      <button
                        type="button"
                        aria-label={`Sort books by ${c.label}`}
                        onClick={() => {
                          setDesc(sort === c.key ? !desc : false);
                          setSort(c.key);
                        }}
                      >
                        {c.label}
                        <span aria-hidden="true">
                          {sort === c.key ? (desc ? "↓" : "↑") : "↕"}
                        </span>
                      </button>
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => {
                  const left = available(state, b.id);
                  return (
                    <tr key={b.id} id={`lib-book-row-${b.id}`}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select book ${b.id}`}
                          checked={selected.includes(b.id)}
                          onChange={(e) =>
                            setSelected(
                              e.target.checked
                                ? [...selected, b.id]
                                : selected.filter((id) => id !== b.id),
                            )
                          }
                        />
                      </td>
                      <td>
                        <span className="lib-code">{b.id}</span>
                      </td>
                      <td>
                        <strong>{b.title}</strong>
                      </td>
                      <td>{b.author}</td>
                      <td>
                        <span className="lib-genre">{b.genre}</span>
                      </td>
                      <td>{b.isbn}</td>
                      <td>{b.year}</td>
                      <td>{b.shelf}</td>
                      <td>{b.copies}</td>
                      <td>
                        <span
                          tabIndex={0}
                          className={`lib-status-tooltip lib-badge ${left ? "lib-green" : "lib-amber"}`}
                        >
                          {left} copies
                          <span role="tooltip">
                            {left
                              ? "Copies that are not on loan, reserved or damaged."
                              : "No copies available to borrow; reservations are still accepted."}
                          </span>
                        </span>
                      </td>
                      <td>
                        <div className="lib-row-actions">
                          <button
                            type="button"
                            aria-label={`View book details ${b.id}`}
                            onClick={() => setDetail(b.id)}
                          >
                            <Eye size={16} />
                            Xem
                          </button>
                          <button
                            type="button"
                            aria-label={`Edit book details ${b.id}`}
                            onClick={() => setBookForm(b)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            aria-label={`Reserve book ${b.id}`}
                            onClick={() => requestReserve(b)}
                          >
                            Reserve
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!books.length && (
              <p className="lib-empty">No books match the filters.</p>
            )}
          </div>
        </section>
        <section className="lib-panel lib-section" id="lib-readers">
          <PanelTitle
            number="02 / COMMUNITY"
            title="Reader management"
            subtitle="Library cards, reading interests and circulation history for each reader."
          >
            <button
              type="button"
              className="lib-primary"
              onClick={() => setReaderForm(null)}
            >
              <Plus size={17} />
              Register reader
            </button>
          </PanelTitle>
          <div className="lib-filterbar">
            <label className="lib-search-label" htmlFor="lib-reader-search">
              <span>Search readers</span>
              <div>
                <Search size={17} />
                <input
                  id="lib-reader-search"
                  type="search"
                  placeholder="Name, ID or email"
                  value={readerQuery}
                  onChange={(e) => setReaderQuery(e.target.value)}
                />
              </div>
            </label>
            <label htmlFor="lib-reader-filter-card">
              Reader card type
              <select
                aria-label="Reader card type"
                id="lib-reader-filter-card"
                value={readerCard}
                onChange={(e) => setReaderCard(e.target.value)}
              >
                <option value="">All card types</option>
                {Object.entries(cardNames).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <span className="lib-filter-count">{readers.length} readers</span>
          </div>
          <div
            className="lib-table-scroll"
            tabIndex={0}
            aria-label="Readers table; scroll horizontally to see all columns"
          >
            <table id="lib-readers-table">
              <caption className="lib-sr-only">Library readers</caption>
              <thead>
                <tr>
                  <th>Reader ID</th>
                  <th>Full name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Card type</th>
                  <th>Expiry date</th>
                  <th>On loan</th>
                  <th>Notifications</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {readers.map((r) => (
                  <tr key={r.id} id={`lib-reader-row-${r.id}`}>
                    <td className="lib-code">{r.id}</td>
                    <td>
                      <strong>{r.name}</strong>
                    </td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{cardNames[r.card]}</td>
                    <td>
                      <span
                        className={`lib-badge ${r.expires < TODAY ? "lib-amber" : "lib-green"}`}
                      >
                        {displayDate(r.expires)}
                      </span>
                    </td>
                    <td>{activeLoans(state, r.id).length}</td>
                    <td>{r.notify ? "Enabled" : "Disabled"}</td>
                    <td>
                      <button
                        type="button"
                        aria-label={`Update reader ${r.id}`}
                        onClick={() => setReaderForm(r)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!readers.length && <p className="lib-empty">No readers found.</p>}
          </div>
        </section>
        <section className="lib-panel lib-section" id="lib-circulation">
          <PanelTitle
            number="03 / CIRCULATION"
            title="Borrowing and returns"
            subtitle="Check the reader card, loan limit and availability before creating a borrowing slip."
          />
          <form
            className="lib-borrow-form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const r = borrow(
                borrowReader,
                borrowBooks,
                borrowed,
                due,
                borrowNote,
              );
              setBorrowError(r.error ? r.message : "");
            }}
          >
            <div className="lib-form-grid">
              <label htmlFor="lib-borrow-reader">
                Borrowing reader
                <select
                  aria-label="Borrowing reader"
                  id="lib-borrow-reader"
                  value={borrowReader}
                  onChange={(e) => setBorrowReader(e.target.value)}
                  required
                >
                  <option value="">Select reader</option>
                  {Object.entries(cardNames).map(([value, label]) => (
                    <optgroup label={label} key={value}>
                      {state.readers
                        .filter((r) => r.card === value)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.id} · {r.name}
                            {r.expires < TODAY ? " · Card expired" : ""}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <label htmlFor="lib-borrow-search">
                Search books for the slip
                <input
                  id="lib-borrow-search"
                  type="search"
                  value={borrowQuery}
                  placeholder="Book title or ID"
                  onChange={(e) => setBorrowQuery(e.target.value)}
                />
              </label>
              <label className="lib-full" htmlFor="lib-borrow-books">
                Select books for the slip
                <select
                  aria-label="Select books for the slip"
                  id="lib-borrow-books"
                  multiple
                  value={borrowBooks}
                  onChange={(e) =>
                    setBorrowBooks(
                      Array.from(e.target.selectedOptions, (o) => o.value),
                    )
                  }
                >
                  {genres.map((g) => (
                    <optgroup key={g} label={g}>
                      {state.books
                        .filter(
                          (b) =>
                            b.genre === g &&
                            `${b.id} ${b.title}`
                              .toLocaleLowerCase("en")
                              .includes(borrowQuery.toLocaleLowerCase("en")),
                        )
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.id} · {b.title} · Available:{" "}
                            {available(state, b.id)} copies
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <small>
                  Use Ctrl/Cmd to select multiple books. Selected{" "}
                  {borrowBooks.length} books; maximum {state.settings.limit}{" "}
                  active loans per reader.
                </small>
              </label>
              <label htmlFor="lib-borrow-date">
                Borrowed date
                <input
                  type="date"
                  id="lib-borrow-date"
                  max={TODAY}
                  value={borrowed}
                  onChange={(e) => setBorrowed(e.target.value)}
                />
              </label>
              <label htmlFor="lib-borrow-due">
                Due date
                <input
                  type="date"
                  id="lib-borrow-due"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                />
              </label>
              <label className="lib-full" htmlFor="lib-borrow-note">
                Loan notes
                <textarea
                  id="lib-borrow-note"
                  rows={2}
                  maxLength={500}
                  value={borrowNote}
                  onChange={(e) => setBorrowNote(e.target.value)}
                />
              </label>
            </div>
            <div className="lib-between lib-wrap">
              <div className="lib-help">
                {borrowReader
                  ? eligible(state, borrowReader) ||
                    `Card valid · On loan ${activeLoans(state, borrowReader).length}/${state.settings.limit} books.`
                  : `Default loan period ${state.settings.days} days; maximum 30 days.`}
              </div>
              <div className="lib-actions">
                <button
                  type="button"
                  onClick={() => {
                    setBorrowed(TODAY);
                    setDue(addDays(TODAY, state.settings.days));
                  }}
                >
                  Apply default loan period
                </button>
                <button type="submit" className="lib-primary">
                  <Check size={17} />
                  Confirm borrowing
                </button>
              </div>
            </div>
            {borrowError && (
              <p className="lib-error" role="alert">
                {borrowError}
              </p>
            )}
          </form>
          <div className="lib-filterbar">
            <label className="lib-search-label" htmlFor="lib-loan-search">
              <span>Search loans</span>
              <div>
                <Search size={17} />
                <input
                  id="lib-loan-search"
                  type="search"
                  value={loanQuery}
                  onChange={(e) => setLoanQuery(e.target.value)}
                  placeholder="Slip, book or reader"
                />
              </div>
            </label>
            <label htmlFor="lib-loan-filter">
              Loan status
              <select
                aria-label="Loan status"
                id="lib-loan-filter"
                value={loanFilter}
                onChange={(e) => setLoanFilter(e.target.value)}
              >
                <option value="">All loans</option>
                {["On loan", "Overdue", "Returned"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <span className="lib-filter-count">{shownLoans.length} loans</span>
          </div>
          <div
            className="lib-table-scroll"
            tabIndex={0}
            aria-label="Loans table; scroll horizontally to see all columns"
          >
            <table id="lib-loans-table">
              <caption className="lib-sr-only">Book loans and returns</caption>
              <thead>
                <tr>
                  <th>Slip ID</th>
                  <th>Reader</th>
                  <th>Book</th>
                  <th>Copy ID</th>
                  <th>Borrowed date</th>
                  <th>Due date</th>
                  <th>Returned date</th>
                  <th>Status</th>
                  <th>Renew</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shownLoans.map((l) => (
                  <tr key={l.id} id={`lib-loan-row-${l.id}`}>
                    <td className="lib-code">{l.id}</td>
                    <td>{readerName(l.readerId)}</td>
                    <td>
                      <strong>{bookName(l.bookId)}</strong>
                    </td>
                    <td>{l.copyId}</td>
                    <td>{displayDate(l.borrowed)}</td>
                    <td>{displayDate(l.due)}</td>
                    <td>{displayDate(l.returned)}</td>
                    <td>
                      <span
                        className={`lib-badge ${loanStatus(l) === "Overdue" ? "lib-amber" : "lib-green"}`}
                      >
                        {loanStatus(l)}
                      </span>
                    </td>
                    <td>{l.renewals}/1</td>
                    <td>
                      <div className="lib-row-actions">
                        <button
                          type="button"
                          disabled={!!l.returned}
                          aria-label={`Return loan ${l.id}`}
                          onClick={() => {
                            setReturnLoan(l);
                            setReturnCondition("good");
                            setReturnNote("");
                            setModalError("");
                          }}
                        >
                          Return book
                        </button>
                        <button
                          type="button"
                          disabled={
                            !!l.returned || l.renewals >= 1 || l.due < TODAY
                          }
                          aria-label={`Renew loan ${l.id}`}
                          onClick={() => act({ type: "renew", id: l.id })}
                        >
                          Renew
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!shownLoans.length && (
              <p className="lib-empty">No matching loans.</p>
            )}
          </div>
        </section>
        <section className="lib-panel lib-section" id="lib-reservations">
          <PanelTitle
            number="04 / COORDINATION"
            title="Reservations and classification"
            subtitle="Hold books for readers and reorganize the collection by shelf."
          />
          <ReservationBoard
            key={resetKey}
            state={state}
            act={act}
            onCollection={(g, s) => {
              setGenre(g);
              setShelfFilter(s);
              setQuery("");
              setStatus("");
            }}
          />
        </section>
        <section className="lib-panel lib-section" id="lib-settings">
          <PanelTitle
            number="05 / OPERATIONS"
            title="Settings and announcements"
            subtitle="Adjust loan policies, opening hours and reader announcements."
          />
          <SettingsPanel key={resetKey} state={state} act={act} toast={toast} />
        </section>
        <section className="lib-panel lib-section" id="lib-lookup">
          <PanelTitle
            number="06 / READER SERVICES"
            title="Quick lookup and borrowing slips"
            subtitle="Two reader service points using the same library data."
          />
          <div className="lib-embedded-grid">
            <QuickLookup
              key={resetKey}
              state={state}
              onReserve={requestReserve}
            />
            <div>
              <ReceiptFrame
                key={resetKey}
                state={state}
                dark={isDark}
                readerId={borrowReader}
                bookIds={borrowBooks}
                onBorrow={borrow}
              />
            </div>
          </div>
        </section>
        <footer className="lib-footer">
          <span>Knowledge Garden · Local library management</span>
          <a href="#lib-overview">Back to top ↑</a>
        </footer>
      </main>
      {notice && (
        <div
          className={`lib-toast ${notice.error ? "error" : ""}`}
          role={notice.error ? "alert" : "status"}
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {bookForm !== undefined && (
        <BookForm
          book={bookForm}
          state={state}
          onSave={(book, create) => act({ type: "book", book, create })}
          onClose={() => setBookForm(undefined)}
        />
      )}
      {readerForm !== undefined && (
        <ReaderForm
          reader={readerForm}
          onSave={(reader, create) => act({ type: "reader", reader, create })}
          onClose={() => setReaderForm(undefined)}
        />
      )}
      {detailBook && (
        <Modal
          title={`Book details ${detailBook.id}`}
          onClose={() => setDetail(null)}
          wide
        >
          <div className="lib-book-detail">
            <img
              src={detailBook.cover}
              alt={`Book cover ${detailBook.title}`}
              width={150}
              height={200}
            />
            <div>
              <span className="lib-genre">{detailBook.genre}</span>
              <h3>{detailBook.title}</h3>
              <p>
                {detailBook.author} · {detailBook.year}
              </p>
              <p>
                ISBN {detailBook.isbn} · Shelf {detailBook.shelf}
              </p>
              <p>{detailBook.description}</p>
              <div className="lib-actions">
                <button
                  type="button"
                  onClick={() => {
                    setDetail(null);
                    setBookForm(detailBook);
                  }}
                >
                  Edit book details
                </button>
                <button
                  type="button"
                  className="lib-primary"
                  onClick={() => {
                    setDetail(null);
                    requestReserve(detailBook);
                  }}
                >
                  Reserve book
                </button>
              </div>
            </div>
          </div>
          <div className="lib-dialog-body">
            <h3>Book copies</h3>
            <div className="lib-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Copy ID</th>
                    <th>Availability</th>
                    <th>Reader / due date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: detailBook.copies }, (_, i) => {
                    const id = `${detailBook.id}-C${i + 1}`;
                    const loan = state.loans.find(
                      (l) => l.copyId === id && !l.returned,
                    );
                    const freeIds = Array.from(
                      { length: detailBook.copies },
                      (_, j) => `${detailBook.id}-C${j + 1}`,
                    ).filter(
                      (copy) =>
                        !detailBook.damagedCopies.includes(copy) &&
                        !state.loans.some(
                          (l) => l.copyId === copy && !l.returned,
                        ),
                    );
                    const held = state.reservations.filter(
                      (r) =>
                        r.bookId === detailBook.id &&
                        ["held", "ready"].includes(r.stage),
                    ).length;
                    const holding = freeIds.slice(0, held).includes(id);
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>
                          {loan
                            ? "On loan"
                            : detailBook.damagedCopies.includes(id)
                              ? "Damaged, out of circulation"
                              : holding
                                ? "Held for a reservation"
                                : "Available to borrow"}
                        </td>
                        <td>
                          {loan
                            ? `${readerName(loan.readerId)} · ${displayDate(loan.due)}`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
      {reserveBook && (
        <Modal
          title={`Reserve book ${reserveBook.id}`}
          onClose={() => setReserveBook(null)}
        >
          <form
            className="lib-form"
            onSubmit={(e) => {
              e.preventDefault();
              const r = act({
                type: "reserve",
                bookId: reserveBook.id,
                readerId: reserveReader,
              });
              if (r.error) setModalError(r.message);
              else setReserveBook(null);
            }}
          >
            <h3>{reserveBook.title}</h3>
            <p className="lib-help">
              Available: {available(state, reserveBook.id)} copies. New requests
              do not hold a copy; process them on the reservation board.
            </p>
            <label htmlFor="lib-reserve-reader">
              Reserving reader
              <select
                aria-label="Reserving reader"
                id="lib-reserve-reader"
                value={reserveReader}
                onChange={(e) => setReserveReader(e.target.value)}
              >
                <option value="">Select reader</option>
                {state.readers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} · {r.name}
                  </option>
                ))}
              </select>
            </label>
            {modalError && (
              <p className="lib-error" role="alert">
                {modalError}
              </p>
            )}
            <div className="lib-form-actions">
              <button type="button" onClick={() => setReserveBook(null)}>
                Cancel
              </button>
              <button type="submit" className="lib-primary">
                Confirm reservation
              </button>
            </div>
          </form>
        </Modal>
      )}
      {returnLoan && (
        <Modal
          title={`Return loan ${returnLoan.id}`}
          onClose={() => setReturnLoan(null)}
        >
          <form
            className="lib-form"
            onSubmit={(e) => {
              e.preventDefault();
              const r = act({
                type: "return",
                id: returnLoan.id,
                condition: returnCondition,
                note: returnNote,
              });
              if (r.error) setModalError(r.message);
              else setReturnLoan(null);
            }}
          >
            <h3>{bookName(returnLoan.bookId)}</h3>
            <p className="lib-help">
              {readerName(returnLoan.readerId)} · Copy {returnLoan.copyId}
            </p>
            <label htmlFor="lib-return-condition">
              Return condition
              <select
                aria-label="Return condition"
                id="lib-return-condition"
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value)}
              >
                <option value="good">Good, return to circulation</option>
                <option value="worn">Slightly worn, keep in circulation</option>
                <option value="damaged">
                  Damaged, remove from circulation
                </option>
              </select>
            </label>
            <label htmlFor="lib-return-note">
              Return notes
              <textarea
                id="lib-return-note"
                rows={3}
                maxLength={500}
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
              />
            </label>
            {modalError && (
              <p className="lib-error" role="alert">
                {modalError}
              </p>
            )}
            <div className="lib-form-actions">
              <button type="button" onClick={() => setReturnLoan(null)}>
                Cancel
              </button>
              <button type="submit" className="lib-primary">
                Confirm return
              </button>
            </div>
          </form>
        </Modal>
      )}
      {bulkModal && (
        <Modal title="Move selected books" onClose={() => setBulkModal(false)}>
          <form
            className="lib-form"
            onSubmit={(e) => {
              e.preventDefault();
              const r = act({
                type: "shelf",
                bookIds: selected,
                shelf: bulkShelf,
              });
              if (!r.error) {
                setBulkModal(false);
                setSelected([]);
              }
            }}
          >
            <p>Move {selected.length} titles to a new shelf.</p>
            <label htmlFor="lib-bulk-shelf">
              Destination shelf
              <select
                aria-label="Destination shelf"
                id="lib-bulk-shelf"
                value={bulkShelf}
                onChange={(e) => setBulkShelf(e.target.value)}
              >
                {shelfBooks.length > 0 &&
                  state.shelves.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <div className="lib-form-actions">
              <button type="button" onClick={() => setBulkModal(false)}>
                Cancel
              </button>
              <button type="submit" className="lib-primary">
                Confirm shelf move
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
