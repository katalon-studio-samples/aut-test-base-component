import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { currency } from "./order-history/orders";
import { Modal } from "./pharmacy-workflow/Modal";
import { ReturnCard } from "./pharmacy-workflow/ReturnCard";
import {
  STORE_KEY,
  Store,
  Product,
  ReturnItem,
  ReturnRow,
  SubmittedReturn,
  byId,
  credit,
  emptyStore,
  invoices,
  loadStore,
  products,
  quantity,
  remaining,
  rowError,
  validQuantity,
  validateReturn,
} from "./pharmacy-workflow/model";
import "./pharmacy-workflow/workflow.css";

const BASE = "/truephamacy-workflow";
const paths = {
  search: `${BASE}/search`,
  cart: `${BASE}/cart`,
  returns: `${BASE}/returns/return-request`,
  history: `${BASE}/returns/history`,
  invoices: `${BASE}/invoices`,
};
// Register before BrowserRouter installs its history listener, so a dirty draft
// can restore POP without letting the router render the destination first.
let blockPop: ((event: PopStateEvent) => void) | null = null;
const relayPop = (event: PopStateEvent) => blockPop?.(event);
window.addEventListener("popstate", relayPop);
if (import.meta.hot) {
  import.meta.hot.dispose(() =>
    window.removeEventListener("popstate", relayPop),
  );
}
const catalogColumns = [
  { key: "quantity", label: "Qty" },
  { key: "name", label: "Product name" },
  { key: "stock", label: "Stock" },
  { key: "ndc", label: "NDC" },
  { key: "cin", label: "CIN" },
  { key: "packaging", label: "Packaging" },
  { key: "cents", label: "Unit cost" },
  { key: "favorite", label: "Favorites" },
] as const;
type CatalogSortKey = (typeof catalogColumns)[number]["key"];
type View = keyof typeof paths;
type PendingNavigation = { url: string; fullLoad?: boolean; popDelta?: number };
function currentView(path: string): View {
  if (path.includes("/returns/history")) return "history";
  if (path.includes("/returns/return-request")) return "returns";
  if (path.includes("/cart")) return "cart";
  if (path.includes("/invoices")) return "invoices";
  return "search";
}
export function PharmacyWorkflowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const view = currentView(location.pathname);
  const [store, setStore] = useState<Store>(loadStore);
  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get("q") || "",
  );
  const [category, setCategory] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(200);
  const [sortKey, setSortKey] = useState<CatalogSortKey>("name");
  const [descending, setDescending] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<ReturnItem[]>([]);
  const [comment, setComment] = useState("");
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<PendingNavigation | null>(null);
  const [picker, setPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [match, setMatch] = useState<{
    productId: string;
    rowId: string;
  } | null>(null);
  const [invoiceChoice, setInvoiceChoice] = useState("");
  const [receipt, setReceipt] = useState<SubmittedReturn | null>(null);
  const [confirmCart, setConfirmCart] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const nextRow = useRef(1);
  const dirtyRef = useRef(false);
  const historyIndex = useRef<number>(window.history.state?.idx ?? 0);
  const restoringPop = useRef<PendingNavigation | null>(null);
  dirtyRef.current = dirty;
  historyIndex.current = window.history.state?.idx ?? historyIndex.current;
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch {
      /* Local workflow stays usable without browser storage. */
    }
  }, [store]);
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuery(new URLSearchParams(location.search).get("q") || "");
    setPage(1);
    setError("");
    historyIndex.current = window.history.state?.idx ?? 0;
    document.querySelector(".wf-nav-menu[open]")?.removeAttribute("open");
  }, [location.search, location.pathname]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const link = (event: MouseEvent) => {
      if (
        !dirtyRef.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element).closest(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      )
        return;
      const url = new URL(anchor.href);
      if (
        url.origin !== window.location.origin ||
        (url.pathname === window.location.pathname &&
          url.search === window.location.search)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      setPending({
        url: url.pathname + url.search + url.hash,
        fullLoad: !url.pathname.startsWith(BASE),
      });
    };
    // BrowserRouter's installed history adapter stores a numeric idx. Restore the
    // current entry before React sees POP, then honor the original delta on discard.
    const pop = (event: PopStateEvent) => {
      if (!dirtyRef.current || typeof event.state?.idx !== "number") return;
      const delta = historyIndex.current - event.state.idx;
      if (restoringPop.current && delta === 0) {
        event.stopImmediatePropagation();
        setPending(restoringPop.current);
        restoringPop.current = null;
        return;
      }
      if (!delta) return;
      event.stopImmediatePropagation();
      restoringPop.current = {
        url: window.location.pathname + window.location.search,
        popDelta: -delta,
      };
      window.history.go(delta);
    };
    blockPop = pop;
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", link, true);
    return () => {
      if (blockPop === pop) blockPop = null;
      restoringPop.current = null;
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", link, true);
    };
  }, [dirty]);
  const go = (target: string) => {
    if (dirtyRef.current && target !== location.pathname + location.search) {
      setPending({ url: target });
      return;
    }
    setReceipt(null);
    setNotice("");
    setError("");
    navigate(target);
  };
  const changeStore = (changes: Partial<Store>) =>
    setStore((previous) => ({ ...previous, ...changes }));
  const makeRow = (): ReturnRow => ({
    id: `wf-row-${nextRow.current++}`,
    serial: "",
    unit: "Each",
    gtin: "",
    quantity: "1",
    invoiceId: "",
  });
  const updateItem = (id: string, changes: Partial<ReturnItem>) => {
    setDraft((previous) =>
      previous.map((item) =>
        item.productId === id ? { ...item, ...changes } : item,
      ),
    );
    setDirty(true);
    setError("");
  };
  const updateRow = (
    productId: string,
    rowId: string,
    changes: Partial<ReturnRow>,
  ) => {
    setDraft((previous) =>
      previous.map((item) =>
        item.productId === productId
          ? {
              ...item,
              rows: item.rows.map((row) =>
                row.id === rowId ? { ...row, ...changes } : row,
              ),
            }
          : item,
      ),
    );
    setDirty(true);
    setError("");
  };
  const addReturnProducts = (ids: string[]) => {
    const missing = ids.filter(
      (id) => !draft.some((item) => item.productId === id),
    );
    const added = missing.map((productId) => ({
      productId,
      reason: "",
      comment: "",
      rows: [makeRow()],
    }));
    setDraft((previous) => [...previous, ...added]);
    if (missing.length) setDirty(true);
    setPicker(false);
    setNotice(
      `${missing.length} product${missing.length === 1 ? "" : "s"} added to return request.`,
    );
    if (view !== "returns") navigate(paths.returns);
  };
  const selectedProducts = products.filter(
    (product) => Number(quantities[product.id]) > 0,
  );
  const addCart = () => {
    if (!selectedProducts.length) {
      setError(
        "Select a product or enter a quantity for at least one product.",
      );
      return;
    }
    for (const product of selectedProducts) {
      const total =
        Number(quantities[product.id]) +
        Number(
          store.cart.find((line) => line.productId === product.id)?.quantity ||
            0,
        );
      if (!validQuantity(String(total)) || total > product.stock) {
        setError(
          `Choose a total quantity of 1–${Math.min(99, product.stock)} for ${product.name}.`,
        );
        return;
      }
    }
    setStore((previous) => ({
      ...previous,
      cart: products.flatMap((product) => {
        const old = previous.cart.find((line) => line.productId === product.id);
        const added = Number(quantities[product.id]) || 0;
        return old || added
          ? [
              {
                productId: product.id,
                quantity: String(Number(old?.quantity || 0) + added),
                selected: old?.selected || false,
                noSubstitution: old?.noSubstitution || false,
              },
            ]
          : [];
      }),
    }));
    setQuantities({});
    setError("");
    setNotice(
      `${selectedProducts.length} product${selectedProducts.length === 1 ? "" : "s"} added to cart.`,
    );
  };
  const patchCart = (id: string, changes: Partial<Store["cart"][number]>) =>
    setStore((previous) => ({
      ...previous,
      cart: previous.cart.map((line) =>
        line.productId === id ? { ...line, ...changes } : line,
      ),
    }));
  const cartError = store.cart.some(
    (line) =>
      !validQuantity(line.quantity) ||
      Number(line.quantity) > byId(line.productId).stock,
  );
  const totalCents = store.cart.reduce(
    (n, line) => n + (Number(line.quantity) || 0) * byId(line.productId).cents,
    0,
  );
  const sortValue = (product: Product): string | number => {
    if (sortKey === "quantity") {
      const value = Number(quantities[product.id] || 0);
      return Number.isFinite(value) ? value : 0;
    }
    if (sortKey === "favorite")
      return Number(store.favorites.includes(product.id));
    return product[sortKey];
  };
  const filtered = products
    .filter(
      (product) =>
        `${product.name} ${product.cin} ${product.ndc}`
          .toLowerCase()
          .includes(
            new URLSearchParams(location.search).get("q")?.toLowerCase() || "",
          ) &&
        (!category || product.category === category) &&
        (!stockOnly || product.stock > 0),
    )
    .sort((a, b) => {
      const left = sortValue(a);
      const right = sortValue(b);
      const comparison =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right), undefined, {
              numeric: true,
            });
      return (
        (descending ? -comparison : comparison) ||
        a.id.localeCompare(b.id, undefined, { numeric: true })
      );
    });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(page, pages);
  const visible = filtered.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  );
  const selectableProducts = visible.filter((product) => product.stock > 0);
  const selectedCount = selectableProducts.filter(
    (product) => Number(quantities[product.id]) > 0,
  ).length;
  const allSelected =
    selectableProducts.length > 0 &&
    selectedCount === selectableProducts.length;
  const selectProduct = (id: string, checked: boolean) =>
    setQuantities((previous) => ({
      ...previous,
      [id]: checked ? (Number(previous[id]) > 0 ? previous[id] : "1") : "",
    }));
  const selectAllProducts = (checked: boolean) =>
    setQuantities((previous) => {
      const next = { ...previous };
      for (const product of selectableProducts) {
        next[product.id] = checked
          ? Number(previous[product.id]) > 0
            ? previous[product.id]
            : "1"
          : "";
      }
      return next;
    });
  const matchedItem =
    match && draft.find((item) => item.productId === match.productId);
  const matchedRow = matchedItem?.rows.find((row) => row.id === match?.rowId);
  const submitReturn = () => {
    const invalid = validateReturn(draft, store.history);
    if (invalid) {
      setError(invalid);
      return;
    }
    const request: SubmittedReturn = {
      id: `RGA-DEMO-${Date.now()}`,
      timestamp: new Date().toISOString(),
      comment,
      items: structuredClone(draft),
      totalCents: credit(draft),
      quantity: draft.reduce(
        (n, item) =>
          n +
          item.rows.reduce(
            (total, row) => total + quantity(byId(item.productId), row),
            0,
          ),
        0,
      ),
    };
    setStore((previous) => ({
      ...previous,
      history: [...previous.history, request].slice(-30),
    }));
    setReceipt(request);
    setDraft([]);
    setComment("");
    setDirty(false);
    dirtyRef.current = false;
    setError("");
  };
  const requestMatch = (productId: string, rowId: string) => {
    const item = draft.find((candidate) => candidate.productId === productId)!;
    const row = item.rows.find((candidate) => candidate.id === rowId)!;
    const invalid = rowError(byId(productId), row);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (
      byId(productId).serialized &&
      item.rows.some(
        (candidate) =>
          candidate.id !== row.id && candidate.serial === row.serial,
      )
    ) {
      setError("Serial numbers must be unique within a product.");
      return;
    }
    setInvoiceChoice(row.invoiceId);
    setMatch({ productId, rowId });
    setError("");
  };
  const doMatch = () => {
    if (!match || !matchedRow) return;
    const invoice = invoices.find(
      (i) => i.id === invoiceChoice && i.productId === match.productId,
    );
    if (!invoice) return;
    const reserved = draft
      .flatMap((item) =>
        item.rows
          .filter(
            (row) => row.id !== match.rowId && row.invoiceId === invoice.id,
          )
          .map((row) => quantity(byId(item.productId), row)),
      )
      .reduce((n, qty) => n + qty, 0);
    if (
      quantity(byId(match.productId), matchedRow) + reserved >
      remaining(invoice, store.history)
    ) {
      setError("Requested quantity exceeds the remaining invoice quantity.");
      return;
    }
    updateRow(match.productId, match.rowId, { invoiceId: invoice.id });
    setMatch(null);
    setNotice("Return row matched to invoice.");
  };
  return (
    <div className="pharmacy-workflow" data-testid="pharmacy-workflow">
      <header className="wf-header">
        <button className="wf-brand" onClick={() => go(paths.search)}>
          <span className="wf-brand-mark">
            <Package size={23} />
          </span>
          TruePhamacy<span>Practice HQ</span>
        </button>
        <nav aria-label="Pharmacy sections">
          <button
            className={view === "search" ? "active" : ""}
            onClick={() => go(paths.search)}
          >
            Products
          </button>
          <details className="wf-nav-menu">
            <summary>
              Orders <ChevronDown size={14} />
            </summary>
            <div>
              <button onClick={() => go(paths.cart)}>Carts</button>
              <button onClick={() => go(paths.invoices)}>
                Invoices &amp; credits
              </button>
              <button onClick={() => go(paths.returns)}>Return request</button>
              <button onClick={() => go(paths.history)}>Return history</button>
            </div>
          </details>
          <button onClick={() => go(paths.history)}>Return history</button>
          <button
            className="wf-cart-link"
            onClick={() => go(paths.cart)}
            aria-label={`Cart with ${store.cart.length} product lines`}
          >
            <ShoppingCart size={19} />
            <span>{store.cart.length}</span>
          </button>
        </nav>
      </header>
      <div className="wf-account-bar">
        <div>
          <strong>Demo pharmacy</strong>
          <span>Account # DEMO-001</span>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            go(`${paths.search}?q=${encodeURIComponent(query.trim())}`);
          }}
        >
          <label className="sr-only" htmlFor="wf-search">
            Search products
          </label>
          <input
            id="wf-search"
            type="search"
            value={query}
            placeholder="Search product name, CIN or NDC"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button aria-label="Search products">
            <Search size={20} />
          </button>
        </form>
        <button
          onClick={() => {
            setPickerSearch("");
            setPicker(true);
          }}
        >
          <Plus size={17} />
          Quick add to return
        </button>
      </div>
      <div className="wf-demo-strip">
        Practice store · Synthetic products and invoices · All submissions stay
        in this browser
      </div>
      <div className="wf-content">
        <div className="wf-breadcrumb">
          <button onClick={() => go(paths.search)}>Home</button>
          <span>/</span>
          <span>
            {
              {
                search: "Search results",
                cart: "Carts",
                returns: "Return request",
                history: "Return history",
                invoices: "Invoices & credits",
              }[view]
            }
          </span>
        </div>
        {notice && (
          <div className="wf-notice" role="status">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
            {view !== "cart" && notice.includes("added to cart") && (
              <button onClick={() => go(paths.cart)}>View cart</button>
            )}
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {error && (
          <div className="wf-error" role="alert">
            {error}
            <button onClick={() => setError("")} aria-label="Dismiss error">
              <X size={16} />
            </button>
          </div>
        )}
        {view === "search" && (
          <>
            <div className="wf-title">
              <div>
                <h1>Search results</h1>
                <p>
                  {filtered.length} products{" "}
                  {new URLSearchParams(location.search).get("q")
                    ? `matching “${new URLSearchParams(location.search).get("q")}”`
                    : "in the demo catalog"}
                </p>
              </div>
              <button
                onClick={() => {
                  setQuantities({});
                  setCategory("");
                  setStockOnly(false);
                  go(paths.search);
                }}
              >
                Clear filters
              </button>
            </div>
            <div className="wf-filterbar">
              <label>
                Category
                <select
                  aria-label="Category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All categories</option>
                  {["Skin care", "Cold chain", "Supplies"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="wf-check">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(event) => {
                    setStockOnly(event.target.checked);
                    setPage(1);
                  }}
                />
                In stock only
              </label>
              <span>{selectedProducts.length} products selected</span>
            </div>
            <div className="wf-actionbar">
              <button
                onClick={() =>
                  selectedProducts.length
                    ? addReturnProducts(
                        selectedProducts.map((product) => product.id),
                      )
                    : setError(
                        "Select a product or enter a quantity for at least one product.",
                      )
                }
              >
                <Plus size={16} />
                Add to return request
              </button>
              <button className="wf-primary" id="wf-add-cart" onClick={addCart}>
                Add to cart
              </button>
              <div className="wf-pagination">
                <label>
                  Items per page
                  <select
                    aria-label="Items per page"
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                  >
                    <option>5</option>
                    <option>10</option>
                    <option>50</option>
                    <option>100</option>
                    <option>200</option>
                    <option>500</option>
                  </select>
                </label>
                <button
                  aria-label="Previous product page"
                  disabled={activePage <= 1}
                  onClick={() => setPage(activePage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <span>
                  Page {activePage} of {pages}
                </span>
                <button
                  aria-label="Next product page"
                  disabled={activePage >= pages}
                  onClick={() => setPage(activePage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="wf-table-scroll">
              <table>
                <caption className="sr-only">Demo product catalog</caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <label className="wf-select-all">
                        <input
                          type="checkbox"
                          aria-label="Select all in-stock products on this page"
                          checked={allSelected}
                          disabled={!selectableProducts.length}
                          ref={(input) => {
                            if (input)
                              input.indeterminate =
                                selectedCount > 0 && !allSelected;
                          }}
                          onChange={(event) =>
                            selectAllProducts(event.target.checked)
                          }
                        />
                        Select all
                        <small>This page · in stock only</small>
                      </label>
                    </th>
                    {catalogColumns.map((column) => (
                      <th
                        key={column.key}
                        aria-sort={
                          sortKey === column.key
                            ? descending
                              ? "descending"
                              : "ascending"
                            : "none"
                        }
                      >
                        <button
                          onClick={() => {
                            setDescending(
                              sortKey === column.key ? !descending : false,
                            );
                            setSortKey(column.key);
                            setPage(1);
                          }}
                          aria-label={`Sort products by ${column.label}`}
                        >
                          {column.label}{" "}
                          {sortKey === column.key
                            ? descending
                              ? "↓"
                              : "↑"
                            : "↕"}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((product) => (
                    <tr key={product.id} data-testid={`product-${product.id}`}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${product.name}`}
                          checked={Number(quantities[product.id]) > 0}
                          disabled={!product.stock}
                          onChange={(event) =>
                            selectProduct(product.id, event.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max={Math.min(99, product.stock)}
                          step="1"
                          disabled={!product.stock}
                          aria-label={`Quantity for ${product.name}`}
                          value={quantities[product.id] || ""}
                          placeholder="0"
                          onChange={(event) =>
                            setQuantities((previous) => ({
                              ...previous,
                              [product.id]: event.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <small className="wf-tag">
                          {product.serialized ? "Serialized" : "Non-serialized"}
                        </small>
                        <button
                          className="wf-text-link"
                          onClick={() => addReturnProducts([product.id])}
                        >
                          Add to return request
                        </button>
                      </td>
                      <td>
                        <span
                          className={`wf-stock ${product.stock ? "" : "wf-no-stock"}`}
                        >
                          {product.stock ? "IN STOCK" : "OUT OF STOCK"}
                        </span>
                        <small>{product.stock} units available</small>
                      </td>
                      <td>{product.ndc}</td>
                      <td>
                        <span className="wf-text-link">{product.cin}</span>
                      </td>
                      <td>{product.packaging}</td>
                      <td>{currency(product.cents / 100)}</td>
                      <td>
                        <button
                          aria-label={`Favorite ${product.name}`}
                          aria-pressed={store.favorites.includes(product.id)}
                          onClick={() =>
                            changeStore({
                              favorites: store.favorites.includes(product.id)
                                ? store.favorites.filter(
                                    (id) => id !== product.id,
                                  )
                                : [...store.favorites, product.id],
                            })
                          }
                        >
                          <Heart
                            size={18}
                            fill={
                              store.favorites.includes(product.id)
                                ? "#e32832"
                                : "none"
                            }
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!visible.length && (
                <p className="wf-empty">No products match your search.</p>
              )}
            </div>
          </>
        )}
        {view === "cart" && (
          <>
            <div className="wf-title">
              <h1>Carts</h1>
              <button onClick={() => go(paths.search)}>
                Continue shopping
              </button>
            </div>
            <section className="wf-cart-card">
              <div className="wf-cart-summary">
                <div>
                  <h2>Default cart: DEMO-CART-001</h2>
                  <p>Order method: Standard · Demo pharmacy</p>
                  <div className="wf-fields">
                    <label htmlFor="wf-po">
                      PO number
                      <input
                        id="wf-po"
                        value={store.po}
                        maxLength={60}
                        placeholder="Enter PO number"
                        onChange={(event) =>
                          changeStore({ po: event.target.value })
                        }
                      />
                    </label>
                    <label htmlFor="wf-memo">
                      PO memo
                      <input
                        id="wf-memo"
                        value={store.memo}
                        maxLength={200}
                        placeholder="Optional memo"
                        onChange={(event) =>
                          changeStore({ memo: event.target.value })
                        }
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <span>Total cost</span>
                  <strong className="wf-total">
                    {currency(totalCents / 100)}
                  </strong>
                  <div className="wf-cart-submit-actions">
                    <button
                      onClick={() =>
                        setNotice(
                          cartError
                            ? "Review cart quantities before submission."
                            : `Cart ready: ${store.cart.length} lines, ${store.cart.reduce((n, line) => n + Number(line.quantity), 0)} units.`,
                        )
                      }
                    >
                      Analyze cart
                    </button>
                    <button
                      className="wf-primary"
                      disabled={!store.cart.length || cartError}
                      onClick={() => setConfirmCart(true)}
                    >
                      Submit cart
                    </button>
                  </div>
                </div>
              </div>
              <div className="wf-row-toolbar">
                <strong>
                  Cart overview · {store.cart.length} lines ·{" "}
                  {store.cart.filter((line) => line.selected).length} selected
                </strong>
                <button
                  disabled={!store.cart.some((line) => line.selected)}
                  onClick={() =>
                    changeStore({
                      cart: store.cart.filter((line) => !line.selected),
                    })
                  }
                >
                  <Trash2 size={15} />
                  Delete selected
                </button>
                <button
                  disabled={!store.cart.length || cartError}
                  onClick={() =>
                    addReturnProducts(
                      (store.cart.some((line) => line.selected)
                        ? store.cart.filter((line) => line.selected)
                        : store.cart
                      ).map((line) => line.productId),
                    )
                  }
                >
                  Create return request
                </button>
              </div>
              <div className="wf-table-scroll">
                <table>
                  <caption className="sr-only">Current cart</caption>
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Qty</th>
                      <th>Product name</th>
                      <th>Stock</th>
                      <th>Do not substitute</th>
                      <th>NDC</th>
                      <th>CIN</th>
                      <th>Unit cost</th>
                      <th>Line total</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.cart.map((line) => {
                      const product = byId(line.productId);
                      return (
                        <tr key={product.id} data-testid={`cart-${product.id}`}>
                          <td>
                            <input
                              type="checkbox"
                              aria-label={`Select ${product.name} in cart`}
                              checked={line.selected}
                              onChange={(event) =>
                                patchCart(product.id, {
                                  selected: event.target.checked,
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              max={Math.min(99, product.stock)}
                              aria-label={`Cart quantity for ${product.name}`}
                              value={line.quantity}
                              onChange={(event) =>
                                patchCart(product.id, {
                                  quantity: event.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <strong>{product.name}</strong>
                            <small>{product.packaging}</small>
                          </td>
                          <td>
                            <span className="wf-stock">IN STOCK</span>
                          </td>
                          <td>
                            <button
                              role="switch"
                              aria-label={`Do not substitute ${product.name}`}
                              aria-checked={line.noSubstitution}
                              className={`wf-switch ${line.noSubstitution ? "on" : ""}`}
                              onClick={() =>
                                patchCart(product.id, {
                                  noSubstitution: !line.noSubstitution,
                                })
                              }
                            >
                              <span />
                            </button>
                          </td>
                          <td>{product.ndc}</td>
                          <td>{product.cin}</td>
                          <td>{currency(product.cents / 100)}</td>
                          <td>
                            {currency(
                              ((Number(line.quantity) || 0) * product.cents) /
                                100,
                            )}
                          </td>
                          <td>
                            <button
                              aria-label={`Delete ${product.name} from cart`}
                              onClick={() =>
                                changeStore({
                                  cart: store.cart.filter(
                                    (item) => item.productId !== product.id,
                                  ),
                                })
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {!store.cart.length && (
                <div className="wf-empty">
                  <ShoppingCart size={28} />
                  <p>Your cart is empty.</p>
                  <button onClick={() => go(paths.search)}>
                    Find products
                  </button>
                </div>
              )}
              {cartError && (
                <p className="wf-error">
                  Cart quantities must be whole numbers within available stock
                  (maximum 99).
                </p>
              )}
            </section>
          </>
        )}
        {view === "returns" && (
          <div className="wf-returns-layout">
            <aside>
              <h2>Manage returns</h2>
              <button className="active" onClick={() => go(paths.returns)}>
                Return request
              </button>
              <button onClick={() => go(paths.history)}>Return history</button>
              <button onClick={() => go(paths.invoices)}>
                Invoices &amp; credits
              </button>
              <h3>Information</h3>
              <p>Match each return row to an invoice before submission.</p>
              <p>Case = 4 units in this practice store.</p>
            </aside>
            <section>
              {receipt ? (
                <div className="wf-success" role="status">
                  <CheckCircle2 size={38} />
                  <h1>Return request submitted</h1>
                  <p>
                    Reference <strong>{receipt.id}</strong>
                  </p>
                  <p>
                    {receipt.quantity} units · Estimated credit{" "}
                    {currency(receipt.totalCents / 100)}
                  </p>
                  <p>This is a local practice confirmation.</p>
                  <button
                    className="wf-primary"
                    onClick={() => go(paths.history)}
                  >
                    View return history
                  </button>
                  <button
                    onClick={() => {
                      setReceipt(null);
                      setNotice("");
                    }}
                  >
                    Create another return
                  </button>
                </div>
              ) : (
                <>
                  <div className="wf-title">
                    <div>
                      <h1>Return request</h1>
                      <p>
                        Add products, enter package details and match invoices.
                      </p>
                    </div>
                    <div className="wf-credit-summary">
                      <span>Estimated credit total</span>
                      <strong>{currency(credit(draft) / 100)}</strong>
                      <small>
                        {draft.length} product lines ·{" "}
                        {draft.reduce(
                          (n, item) =>
                            n +
                            item.rows.reduce(
                              (sum, row) =>
                                sum + quantity(byId(item.productId), row),
                              0,
                            ),
                          0,
                        )}{" "}
                        units
                      </small>
                    </div>
                  </div>
                  <div className="wf-return-actions">
                    <label htmlFor="wf-return-comment">
                      Request comment
                      <input
                        id="wf-return-comment"
                        value={comment}
                        maxLength={200}
                        placeholder="Comment will appear on the local credit record"
                        onChange={(event) => {
                          setComment(event.target.value);
                          setDirty(true);
                        }}
                      />
                    </label>
                    <button
                      onClick={() => {
                        setPickerSearch("");
                        setPicker(true);
                      }}
                    >
                      <Plus size={16} />
                      Add product
                    </button>
                    <button
                      className="wf-primary"
                      id="wf-submit-return"
                      disabled={!draft.length}
                      onClick={submitReturn}
                    >
                      Submit return request
                    </button>
                  </div>
                  {!draft.length && (
                    <div className="wf-empty">
                      <Package size={30} />
                      <h3>No products in this return request</h3>
                      <p>
                        Choose serialized or non-serialized demo products to
                        begin.
                      </p>
                      <button onClick={() => setPicker(true)}>
                        Add a product
                      </button>
                    </div>
                  )}
                  {draft.map((item) => (
                    <ReturnCard
                      key={item.productId}
                      product={byId(item.productId)}
                      item={item}
                      onItem={(changes) => updateItem(item.productId, changes)}
                      onRow={(rowId, changes) =>
                        updateRow(item.productId, rowId, changes)
                      }
                      onAddRow={() =>
                        updateItem(item.productId, {
                          rows: [...item.rows, makeRow()],
                        })
                      }
                      onRemoveRow={(id) =>
                        updateItem(item.productId, {
                          rows: item.rows.filter((row) => row.id !== id),
                        })
                      }
                      onRemove={() => {
                        setDraft((previous) =>
                          previous.filter(
                            (candidate) =>
                              candidate.productId !== item.productId,
                          ),
                        );
                        setDirty(true);
                      }}
                      onMatch={(rowId) => requestMatch(item.productId, rowId)}
                    />
                  ))}
                </>
              )}
            </section>
          </div>
        )}
        {view === "invoices" && (
          <>
            <div className="wf-title">
              <h1>Invoices &amp; credits</h1>
              <button onClick={() => go(paths.returns)}>
                Create return request
              </button>
            </div>
            <div className="wf-table-scroll">
              <table>
                <caption className="sr-only">Synthetic invoices</caption>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>PO #</th>
                    <th>Qty shipped</th>
                    <th>Previous returns</th>
                    <th>Available to return</th>
                    <th>Unit cost</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{byId(invoice.productId).name}</td>
                      <td>{invoice.date}</td>
                      <td>{invoice.po}</td>
                      <td>{invoice.shipped}</td>
                      <td>
                        {invoice.shipped - remaining(invoice, store.history)}
                      </td>
                      <td>{remaining(invoice, store.history)}</td>
                      <td>{currency(invoice.cents / 100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {view === "history" && (
          <>
            <div className="wf-title">
              <h1>Return history</h1>
              <button className="wf-primary" onClick={() => go(paths.returns)}>
                New return request
              </button>
            </div>
            <div className="wf-table-scroll">
              <table>
                <caption className="sr-only">
                  Submitted local return requests
                </caption>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Submitted (UTC)</th>
                    <th>Products / packages</th>
                    <th>Units</th>
                    <th>Estimated credit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...store.history].reverse().map((request) => (
                    <tr key={request.id}>
                      <td>
                        <details>
                          <summary>{request.id}</summary>
                          <p>{request.comment || "No request comment"}</p>
                          {request.items.map((item) => (
                            <p key={item.productId}>
                              {byId(item.productId).name} · {item.reason} ·{" "}
                              {item.rows
                                .map(
                                  (row) =>
                                    row.serial || `${row.quantity} units`,
                                )
                                .join(", ")}
                            </p>
                          ))}
                        </details>
                      </td>
                      <td>
                        {request.timestamp.slice(0, 19).replace("T", " ")}
                      </td>
                      <td>
                        {request.items.length} products /{" "}
                        {request.items.reduce(
                          (n, item) => n + item.rows.length,
                          0,
                        )}{" "}
                        rows
                      </td>
                      <td>{request.quantity}</td>
                      <td>{currency(request.totalCents / 100)}</td>
                      <td>
                        <span className="wf-tag wf-tag-green">
                          Submitted locally
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!store.history.length && (
                <p className="wf-empty">
                  No return requests have been submitted yet.
                </p>
              )}
            </div>
          </>
        )}
        <footer className="wf-footer">
          <span>TruePhamacy practice workflow</span>
          <button onClick={() => setResetDialog(true)}>Reset demo data</button>
        </footer>
      </div>
      {picker && (
        <Modal
          title="Add product to return request"
          wide
          onClose={() => setPicker(false)}
        >
          <label className="wf-modal-search">
            Search demo products
            <input
              autoFocus
              value={pickerSearch}
              onChange={(event) => setPickerSearch(event.target.value)}
            />
          </label>
          <div className="wf-picker-list">
            {products
              .filter((product) =>
                `${product.name} ${product.cin}`
                  .toLowerCase()
                  .includes(pickerSearch.toLowerCase()),
              )
              .map((product) => (
                <div key={product.id}>
                  <Package size={24} />
                  <div>
                    <strong>{product.name}</strong>
                    <small>
                      {product.cin} ·{" "}
                      {product.serialized ? "Serialized" : "Non-serialized"} ·{" "}
                      {product.packaging}
                    </small>
                  </div>
                  <button
                    disabled={draft.some(
                      (item) => item.productId === product.id,
                    )}
                    onClick={() => addReturnProducts([product.id])}
                    aria-label={`Add ${product.name} to return`}
                  >
                    {draft.some((item) => item.productId === product.id)
                      ? "Added"
                      : "Add product"}
                  </button>
                </div>
              ))}
          </div>
        </Modal>
      )}
      {match && matchedRow && (
        <Modal
          title={`Match invoice · ${byId(match.productId).name}`}
          wide
          onClose={() => {
            setMatch(null);
            setError("");
          }}
        >
          <p className="wf-modal-description">
            Return quantity: {quantity(byId(match.productId), matchedRow)}{" "}
            units. Select an invoice with enough remaining quantity.
          </p>
          <div className="wf-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>PO #</th>
                  <th>Shipped</th>
                  <th>Available</th>
                  <th>Unit cost</th>
                </tr>
              </thead>
              <tbody>
                {invoices
                  .filter((invoice) => invoice.productId === match.productId)
                  .map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <input
                          type="radio"
                          name="invoice-match"
                          aria-label={`Select invoice ${invoice.id}`}
                          checked={invoiceChoice === invoice.id}
                          onChange={() => setInvoiceChoice(invoice.id)}
                        />
                      </td>
                      <td>{invoice.id}</td>
                      <td>{invoice.date}</td>
                      <td>{invoice.po}</td>
                      <td>{invoice.shipped}</td>
                      <td>{remaining(invoice, store.history)}</td>
                      <td>{currency(invoice.cents / 100)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {error && (
            <p className="wf-error" role="alert">
              {error}
            </p>
          )}
          <div className="wf-modal-actions">
            <button
              onClick={() => {
                setMatch(null);
                setError("");
              }}
            >
              Cancel
            </button>
            <button
              className="wf-primary"
              disabled={!invoiceChoice}
              onClick={doMatch}
            >
              Apply invoice match
            </button>
          </div>
        </Modal>
      )}
      {pending && (
        <Modal
          title="Progress will not be saved"
          onClose={() => setPending(null)}
        >
          <p className="wf-modal-description">
            Leaving this page without submitting your return request will
            discard the current matching work. Match all products to an invoice
            and submit the return request first.
          </p>
          <div className="wf-modal-actions">
            <button
              onClick={() => {
                const target = pending;
                dirtyRef.current = false;
                setDirty(false);
                setDraft([]);
                setComment("");
                setReceipt(null);
                setPending(null);
                setError("");
                setNotice("Draft discarded.");
                if (target.popDelta) window.history.go(target.popDelta);
                else if (target.fullLoad) window.location.assign(target.url);
                else navigate(target.url);
              }}
            >
              Leave and discard changes
            </button>
            <button className="wf-primary" onClick={() => setPending(null)}>
              Go back and submit changes
            </button>
          </div>
        </Modal>
      )}
      {confirmCart && (
        <Modal
          title="Submit practice cart"
          onClose={() => setConfirmCart(false)}
        >
          <p className="wf-modal-description">
            {store.cart.length} product lines · Total{" "}
            {currency(totalCents / 100)}. This creates a local confirmation
            only.
          </p>
          <div className="wf-modal-actions">
            <button onClick={() => setConfirmCart(false)}>Cancel</button>
            <button
              className="wf-primary"
              onClick={() => {
                setConfirmCart(false);
                setNotice(
                  `Practice cart submitted locally · ORDER-DEMO-${Date.now()}. Cart retained for return exercises.`,
                );
              }}
            >
              Confirm local submission
            </button>
          </div>
        </Modal>
      )}
      {resetDialog && (
        <Modal title="Reset demo data?" onClose={() => setResetDialog(false)}>
          <p className="wf-modal-description">
            Clear this tab's cart, favorites, return history and current draft.
          </p>
          <div className="wf-modal-actions">
            <button onClick={() => setResetDialog(false)}>Cancel</button>
            <button
              className="wf-primary"
              onClick={() => {
                dirtyRef.current = false;
                setDirty(false);
                setStore(emptyStore());
                setDraft([]);
                setComment("");
                setQuantities({});
                setReceipt(null);
                setResetDialog(false);
                setError("");
                setNotice("Demo data reset.");
                nextRow.current = 1;
                navigate(paths.search);
              }}
            >
              Reset all demo data
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
