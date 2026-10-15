export const TODAY = "2026-10-13";
export const genres = [
  "Literature",
  "Science",
  "History",
  "Technology",
  "Children",
  "Art",
] as const;
export const shelves = [
  "A1 · Literature",
  "A2 · Literature",
  "B1 · Science",
  "B2 · Technology",
  "C1 · History",
  "C2 · Art",
  "D1 · Children",
];
export type Scale = "small" | "city" | "central";
export type Stage = "new" | "held" | "ready" | "collected";
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  year: number;
  shelf: string;
  copies: number;
  damaged: number;
  damagedCopies: string[];
  description: string;
  cover: string;
}
export interface Reader {
  id: string;
  name: string;
  email: string;
  phone: string;
  card: "standard" | "student" | "research";
  expires: string;
  interests: string[];
  branches: string[];
  notify: boolean;
  note: string;
  photo: string;
}
export interface Loan {
  id: string;
  readerId: string;
  bookId: string;
  copyId: string;
  borrowed: string;
  due: string;
  returned: string;
  renewals: number;
  condition: string;
  note: string;
}
export interface Reservation {
  id: string;
  bookId: string;
  readerId: string;
  stage: Stage;
  date: string;
}
export interface Settings {
  days: number;
  limit: number;
  closing: string;
  color: string;
  closed: boolean;
}
export interface Activity {
  id: string;
  text: string;
  date: string;
  kind: "loan" | "return" | "reserve" | "catalog" | "reader" | "settings";
}
export interface LibraryState {
  scale: Scale;
  books: Book[];
  readers: Reader[];
  loans: Loan[];
  reservations: Reservation[];
  activities: Activity[];
  settings: Settings;
  announcement: string;
  shelves: string[];
  serial: number;
}
export const cardNames = {
  standard: "Standard",
  student: "Student",
  research: "Research",
};
export const stageNames: Record<Stage, string> = {
  new: "New requests",
  held: "Held",
  ready: "Ready for pickup",
  collected: "Collected",
};
export const addDays = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export const displayDate = (date: string) =>
  date ? date.split("-").reverse().join("/") : "—";
export const activeLoans = (state: LibraryState, readerId?: string) =>
  state.loans.filter(
    (l) => !l.returned && (!readerId || l.readerId === readerId),
  );
export const loanStatus = (loan: Loan) =>
  loan.returned ? "Returned" : loan.due < TODAY ? "Overdue" : "On loan";
export const available = (state: LibraryState, id: string) => {
  const book = state.books.find((b) => b.id === id);
  if (!book) return 0;
  return Math.max(
    0,
    book.copies -
      book.damaged -
      state.loans.filter((l) => l.bookId === id && !l.returned).length -
      state.reservations.filter(
        (r) => r.bookId === id && ["held", "ready"].includes(r.stage),
      ).length,
  );
};
export const eligible = (state: LibraryState, id: string) => {
  const reader = state.readers.find((r) => r.id === id);
  if (!reader) return "Select a reader.";
  if (reader.expires < TODAY) return "The reader card has expired.";
  if (activeLoans(state, id).some((l) => l.due < TODAY))
    return "The reader must return overdue books before borrowing more.";
  if (activeLoans(state, id).length >= state.settings.limit)
    return `Loan limit reached: ${state.settings.limit} books.`;
  if (state.settings.closed)
    return "The library is closed; open it in Settings before lending books.";
  return "";
};
const isbnFor = (i: number) => {
  const digits = `978${String(i + 100000000).padStart(9, "0")}`;
  const sum = [...digits].reduce(
    (n, d, j) => n + Number(d) * (j % 2 ? 3 : 1),
    0,
  );
  return digits + ((10 - (sum % 10)) % 10);
};
export function seedLibrary(scale: Scale = "city"): LibraryState {
  const size = {
    small: [150, 35, 45, 12],
    city: [300, 50, 50, 18],
    central: [500, 120, 160, 36],
  }[scale];
  const titles = [
    "Seasons in Bloom",
    "Maps of Knowledge",
    "The Flow of Time",
    "The Digital World",
    "The Garden of Imagination",
    "Colors of Memory",
  ];
  const topics = [
    "The City",
    "Seas and Islands",
    "Nature",
    "Journeys",
    "The Sky",
    "Life",
  ];
  const authors = [
    "An Nhiên",
    "Minh Khoa",
    "Hà Phương",
    "Quang Duy",
    "Thu Mai",
    "Lâm Sơn",
    "Ngọc Anh",
    "Bảo Nam",
  ];
  const books: Book[] = Array.from({ length: size[0] }, (_, i) => ({
    id: `S${String(i + 1).padStart(4, "0")}`,
    title: `${titles[i % 6]}: ${topics[Math.floor(i / 6) % 6]} · Volume ${Math.floor(i / 36) + 1}`,
    author: authors[i % authors.length],
    genre: genres[i % 6],
    isbn: isbnFor(i + 1),
    year: 1998 + (i % 28),
    shelf: shelves[i % shelves.length],
    copies: 2 + (i % 5),
    damaged: i % 53 === 0 ? 1 : 0,
    damagedCopies:
      i % 53 === 0
        ? [`S${String(i + 1).padStart(4, "0")}-C${2 + (i % 5)}`]
        : [],
    description: `A title from the ${genres[i % 6].toLowerCase()} collection, taking readers on a journey through ${topics[Math.floor(i / 6) % 6].toLowerCase()}. Sample content for the local library, including chapters, references and discussion questions.`,
    cover: `/library/covers/cover-${i % 6}.svg`,
  }));
  const names = [
    "Nguyễn Minh",
    "Trần Hà",
    "Lê An",
    "Phạm Linh",
    "Hoàng Nam",
    "Vũ Mai",
    "Đỗ Khánh",
    "Bùi Thu",
  ];
  const readers: Reader[] = Array.from({ length: size[1] }, (_, i) => ({
    id: `DG${String(i + 1).padStart(3, "0")}`,
    name: `${names[i % names.length]} ${String(i + 1).padStart(3, "0")}`,
    email: `docgia${String(i + 1).padStart(3, "0")}@example.test`,
    phone: `000${String(i + 1).padStart(7, "0")}`,
    card: (["standard", "student", "research"] as const)[i % 3],
    expires: i % 17 === 16 ? "2026-10-10" : "2027-10-13",
    interests: [genres[i % 6]],
    branches: ["Central"],
    notify: i % 3 !== 0,
    note: i % 4 === 0 ? "Prefer contact in the afternoon." : "",
    photo: "",
  }));
  const loans: Loan[] = Array.from({ length: size[2] }, (_, i) => {
    const book = books[(i * 7 + 2) % books.length];
    return {
      id: `PM${String(i + 1).padStart(4, "0")}`,
      readerId: readers[i % readers.length].id,
      bookId: book.id,
      copyId: `${book.id}-C${i % 4 === 3 ? 2 : 1}`,
      borrowed: i % 5 === 0 ? "2026-09-20" : "2026-10-03",
      due:
        i % 5 === 0 ? "2026-10-04" : i % 5 === 1 ? "2026-10-15" : "2026-10-20",
      returned: i % 4 === 3 ? "2026-10-09" : "",
      renewals: 0,
      condition: i % 4 === 3 ? "good" : "",
      note: "",
    };
  });
  const reservations: Reservation[] = Array.from(
    { length: size[3] },
    (_, i) => ({
      id: `DC${String(i + 1).padStart(3, "0")}`,
      bookId: books[(i * 11 + 1) % books.length].id,
      readerId: readers[(i + 10) % readers.length].id,
      stage: (["new", "held", "ready"] as const)[i % 3],
      date: "2026-10-12",
    }),
  );
  return {
    scale,
    books,
    readers,
    loans,
    reservations,
    activities: loans
      .slice(-12)
      .reverse()
      .map((l) => ({
        id: `ACT-${l.id}`,
        text: `${l.id} · ${l.returned ? "Book returned" : "Book loaned"} · ${books.find((b) => b.id === l.bookId)!.title}`,
        date: l.returned || l.borrowed,
        kind: l.returned ? "return" : "loan",
      })),
    settings: {
      days: 14,
      limit: 6,
      closing: "18:00",
      color: "#7162c2",
      closed: false,
    },
    announcement:
      "<p><strong>Reading Week</strong> · Visit the library to discover new collections and sign up for a weekend discussion.</p>",
    shelves: [...shelves],
    serial: 1000,
  };
}
export type Command =
  | { type: "book"; book: Book; create: boolean }
  | { type: "reader"; reader: Reader; create: boolean }
  | {
      type: "borrow";
      readerId: string;
      bookIds: string[];
      borrowed: string;
      due: string;
      note: string;
    }
  | { type: "return"; id: string; condition: string; note: string }
  | { type: "renew"; id: string }
  | { type: "reserve"; bookId: string; readerId: string }
  | { type: "stage"; id: string; stage: Stage }
  | { type: "shelf"; bookIds: string[]; shelf: string; genre?: string }
  | { type: "settings"; changes: Partial<Settings> }
  | { type: "announcement"; html: string };
export function transact(
  state: LibraryState,
  command: Command,
): { state: LibraryState; message: string; error: boolean } {
  const fail = (message: string) => ({ state, message, error: true });
  const next = structuredClone(state);
  let message = "";
  let kind: Activity["kind"] = "catalog";
  if (command.type === "book") {
    const b = command.book;
    if (
      !b.title.trim() ||
      !b.author.trim() ||
      !b.shelf.trim() ||
      !genres.includes(b.genre as (typeof genres)[number])
    )
      return fail("Enter a valid title, author, genre and shelf location.");
    if (!/^\d{13}$/.test(b.isbn))
      return fail("ISBN must contain exactly 13 digits.");
    if (state.books.some((x) => x.id !== b.id && x.isbn === b.isbn))
      return fail("This ISBN already exists in the catalog.");
    if (
      !Number.isInteger(b.year) ||
      b.year < 1450 ||
      b.year > 2026 ||
      !Number.isInteger(b.copies) ||
      b.copies < 1 ||
      b.copies > 100
    )
      return fail(
        "Publication year: 1450–2026; total copies: an integer from 1–100.",
      );
    const old = state.books.find((x) => x.id === b.id);
    const used = old ? old.copies - available(state, old.id) : 0;
    const occupiedCopies = old
      ? [
          ...old.damagedCopies,
          ...state.loans
            .filter((l) => l.bookId === old.id && !l.returned)
            .map((l) => l.copyId),
        ]
      : [];
    const highestCopy = Math.max(
      0,
      ...occupiedCopies.map((id) => Number(id.split("-C")[1])),
    );
    if (b.copies < highestCopy)
      return fail(
        `Cannot remove copies on loan or damaged copies; keep at least ${highestCopy} copies.`,
      );
    if (b.copies < used)
      return fail(
        `At least ${used} copies are required to retain loaned, reserved or damaged copies.`,
      );
    if (!command.create && !old) return fail("The book to edit was not found.");
    const saved = { ...b, id: command.create ? `S${++next.serial}` : b.id };
    if (command.create) next.books.push(saved);
    else next.books = next.books.map((x) => (x.id === b.id ? saved : x));
    if (!next.shelves.includes(b.shelf)) next.shelves.push(b.shelf);
    message = `${command.create ? "Added" : "Updated"} book “${b.title}”.`;
  } else if (command.type === "reader") {
    const r = command.reader;
    if (
      !r.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email) ||
      !/^\d{10,11}$/.test(r.phone) ||
      !validDate(r.expires) ||
      r.expires < TODAY
    )
      return fail(
        "Enter a full name, email, 10–11 digit phone number and expiry date on or after the simulated date.",
      );
    if (
      state.readers.some(
        (x) => x.id !== r.id && x.email.toLowerCase() === r.email.toLowerCase(),
      )
    )
      return fail("This email is already registered.");
    if (!command.create && !state.readers.some((x) => x.id === r.id))
      return fail("The reader to edit was not found.");
    const saved = { ...r, id: command.create ? `DG${++next.serial}` : r.id };
    if (command.create) next.readers.push(saved);
    else next.readers = next.readers.map((x) => (x.id === r.id ? saved : x));
    message = `Saved reader ${r.name}.`;
    kind = "reader";
  } else if (command.type === "borrow") {
    const error = eligible(state, command.readerId);
    if (error) return fail(error);
    const ids = [...new Set(command.bookIds)];
    if (!ids.length) return fail("Select at least one book.");
    if (
      activeLoans(state, command.readerId).length + ids.length >
      state.settings.limit
    )
      return fail(`Maximum loan limit: ${state.settings.limit} active loans.`);
    if (
      !validDate(command.borrowed) ||
      !validDate(command.due) ||
      command.borrowed > TODAY ||
      command.due <= command.borrowed ||
      command.due < TODAY ||
      command.due > addDays(command.borrowed, 30)
    )
      return fail(
        "The borrowing date cannot be after the simulated date; the due date must be on or after the simulated date, after borrowing and within 30 days.",
      );
    for (const id of ids) {
      const book = next.books.find((b) => b.id === id);
      if (!book) return fail("Book not found.");
      const ready = next.reservations.find(
        (r) =>
          r.bookId === id &&
          r.readerId === command.readerId &&
          r.stage === "ready",
      );
      if (!ready && available(next, id) < 1)
        return fail(`“${book.title}” has no copies available to borrow.`);
      if (activeLoans(next, command.readerId).some((l) => l.bookId === id))
        return fail("The reader already has this title on loan.");
      if (ready) ready.stage = "collected";
      const occupied = next.loans
        .filter((l) => !l.returned && l.bookId === id)
        .map((l) => l.copyId);
      const copy = Array.from(
        { length: book.copies },
        (_, i) => `${id}-C${i + 1}`,
      ).find((c) => !occupied.includes(c) && !book.damagedCopies.includes(c));
      if (!copy) return fail("No copies are available.");
      next.loans.unshift({
        id: `PM${++next.serial}`,
        readerId: command.readerId,
        bookId: id,
        copyId: copy,
        borrowed: command.borrowed,
        due: command.due,
        returned: "",
        renewals: 0,
        condition: "",
        note: command.note,
      });
    }
    message = `Loaned ${ids.length} books; due ${displayDate(command.due)}.`;
    kind = "loan";
  } else if (command.type === "return") {
    const l = next.loans.find((x) => x.id === command.id);
    if (!l || l.returned)
      return fail("This loan has already been returned or does not exist.");
    if (!["good", "worn", "damaged"].includes(command.condition))
      return fail("Select the return condition.");
    l.returned = TODAY;
    l.condition = command.condition;
    l.note = command.note;
    if (command.condition === "damaged") {
      const book = next.books.find((b) => b.id === l.bookId)!;
      book.damaged++;
      book.damagedCopies.push(l.copyId);
    }
    message = `Returned ${l.id}${command.condition === "damaged" ? "; damaged copy removed from circulation" : "; availability updated"}.`;
    kind = "return";
  } else if (command.type === "renew") {
    const l = next.loans.find((x) => x.id === command.id);
    if (!l || l.returned) return fail("Only active loans can be renewed.");
    if (l.due < TODAY)
      return fail("Overdue books must be returned and cannot be renewed.");
    if (l.renewals >= 1) return fail("Each loan can be renewed only once.");
    if (next.readers.find((r) => r.id === l.readerId)!.expires < TODAY)
      return fail("The reader card has expired.");
    if (
      next.reservations.some(
        (r) => r.bookId === l.bookId && r.stage !== "collected",
      )
    )
      return fail("This book has reservations and cannot be renewed.");
    l.due = addDays(l.due, 7);
    l.renewals++;
    message = `Renewed ${l.id} to ${displayDate(l.due)}.`;
    kind = "loan";
  } else if (command.type === "reserve") {
    const r = state.readers.find((x) => x.id === command.readerId);
    if (!r || r.expires < TODAY)
      return fail("Select a reader with a valid card to reserve a book.");
    if (!state.books.some((x) => x.id === command.bookId))
      return fail("Book not found.");
    if (
      state.reservations.some(
        (x) =>
          x.bookId === command.bookId &&
          x.readerId === command.readerId &&
          x.stage !== "collected",
      )
    )
      return fail("The reader already has a reservation for this book.");
    next.reservations.unshift({
      id: `DC${++next.serial}`,
      readerId: command.readerId,
      bookId: command.bookId,
      date: TODAY,
      stage: "new",
    });
    message = "Reservation created in the New requests column.";
    kind = "reserve";
  } else if (command.type === "stage") {
    const r = next.reservations.find((x) => x.id === command.id);
    if (!r || r.stage === "collected" || command.stage === "collected")
      return fail("The request is no longer on the processing board.");
    if (r.stage === command.stage)
      return {
        state,
        message: "The request is already in this column.",
        error: false,
      };
    if (
      ["held", "ready"].includes(command.stage) &&
      r.stage === "new" &&
      available(state, r.bookId) < 1
    )
      return fail("No copy is available to hold for this request.");
    r.stage = command.stage;
    message = `${r.id}: ${stageNames[command.stage]}.`;
    kind = "reserve";
  } else if (command.type === "shelf") {
    if (
      !command.shelf.trim() ||
      command.shelf.length > 60 ||
      !command.bookIds.length
    )
      return fail(
        "Select books and enter a shelf name of up to 60 characters.",
      );
    if (
      command.genre &&
      !genres.includes(command.genre as (typeof genres)[number])
    )
      return fail("Invalid genre.");
    if (!next.shelves.includes(command.shelf)) next.shelves.push(command.shelf);
    next.books = next.books.map((b) =>
      command.bookIds.includes(b.id)
        ? { ...b, shelf: command.shelf, genre: command.genre || b.genre }
        : b,
    );
    message = `Moved ${command.bookIds.length} books to ${command.shelf}.`;
  } else if (command.type === "settings") {
    const settings = { ...state.settings, ...command.changes };
    if (
      !Number.isInteger(settings.days) ||
      settings.days < 1 ||
      settings.days > 30 ||
      !Number.isInteger(settings.limit) ||
      settings.limit < 1 ||
      settings.limit > 10 ||
      !/^\d{2}:\d{2}$/.test(settings.closing) ||
      !/^#[\da-f]{6}$/i.test(settings.color)
    )
      return fail("Settings are outside the allowed range.");
    next.settings = settings;
    message = "Library policy updated.";
    kind = "settings";
  } else {
    next.announcement = command.html;
    message = "Announcement draft saved.";
    kind = "settings";
  }
  next.activities.unshift({
    id: `ACT${++next.serial}`,
    text: message,
    date: TODAY,
    kind,
  });
  next.activities = next.activities.slice(0, 50);
  return { state: next, message, error: false };
}
