import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, ShoppingCart } from "lucide-react";
import { OrderTable } from "./order-history/OrderTable";
import { WorkloadControls } from "./order-history/WorkloadControls";
import {
  EMPTY_FILTERS,
  ORDER_TYPES,
  STATUSES,
  filterOrders,
  generateOrders,
  sortOrders,
  type OrderEdit,
  type OrderFilters,
  type SortKey,
} from "./order-history/orders";
import "./order-history/order-history.css";

export function OrderHistoryPage() {
  const [orders, setOrders] = useState(() => generateOrders(250));
  const [filters, setFilters] = useState<OrderFilters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [descending, setDescending] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [allRows, setAllRows] = useState(false);
  const filtered = useMemo(
    () => sortOrders(filterOrders(orders, filters), sortKey, descending),
    [orders, filters, sortKey, descending],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = allRows ? 0 : (currentPage - 1) * pageSize;
  const visible = allRows ? filtered : filtered.slice(start, start + pageSize);
  const selectedCount = orders.filter((order) => order.selected).length;

  const editOrder = useCallback((id: string, changes: OrderEdit) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === id ? { ...order, ...changes } : order,
      ),
    );
  }, []);
  const changeFilter = (key: keyof OrderFilters, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };
  const changeSort = (key: SortKey) => {
    setDescending(key === sortKey ? !descending : false);
    setSortKey(key);
    setPage(1);
  };
  const generate = (count: number) => {
    setOrders(generateOrders(count));
    clearFilters();
  };

  return (
    <div className="vantus-order-history">
      <header className="vantus-header">
        <div className="vantus-header-inner">
          <Link
            to="/"
            className="vantus-brand"
            aria-label="Back to base component"
          >
            Vantus<sup>™</sup> HQ
          </Link>
          <nav aria-label="Fixture sections">
            <a href="#order-history-title">Products</a>
            <a href="#order-history-table" aria-current="page">
              Orders
            </a>
            <a href="#performance-workload">Reports</a>
            <a href="#fixture-support">Solutions</a>
          </nav>
          <span className="fixture-badge">Performance fixture</span>
          <ShoppingCart size={20} aria-hidden="true" />
        </div>
      </header>
      <div className="vantus-taskbar">
        <div className="vantus-taskbar-inner">
          <div className="demo-account">
            <strong>DEMO PHARMACY</strong>
            <span>Account # DEMO-001</span>
          </div>
          <label className="product-search">
            <span className="sr-only">Search orders</span>
            <input
              type="search"
              placeholder="Search order #, confirmation #, PO # or notes"
              value={filters.search}
              onChange={(event) => changeFilter("search", event.target.value)}
            />
            <Search size={20} aria-hidden="true" />
          </label>
          <a href="#performance-workload" className="workload-shortcut">
            Configure workload
          </a>
        </div>
      </div>
      <main className="vantus-content">
        <div className="vantus-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Order history</span>
        </div>
        <div className="order-title">
          <h1 id="order-history-title">Order history</h1>
          <span>Synthetic data · October 2026</span>
        </div>
        <section className="order-filters" aria-label="Filter orders">
          <span>Filter by:</span>
          <label>
            Order status
            <select
              aria-label="Order status"
              value={filters.status}
              onChange={(event) => changeFilter("status", event.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <label>
            Order type
            <select
              aria-label="Order type"
              value={filters.type}
              onChange={(event) => changeFilter("type", event.target.value)}
            >
              <option value="">All order types</option>
              {ORDER_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Purchase order
            <input
              type="search"
              placeholder="Select or type to filter"
              value={filters.po}
              onChange={(event) => changeFilter("po", event.target.value)}
            />
          </label>
          <button onClick={clearFilters}>Clear filters</button>
        </section>
        <div className="order-date-range">
          <span>Customize date range</span>
          <label>
            From date
            <input
              type="date"
              value={filters.from}
              onChange={(event) => changeFilter("from", event.target.value)}
            />
          </label>
          <span aria-hidden="true">–</span>
          <label>
            To date
            <input
              type="date"
              value={filters.to}
              onChange={(event) => changeFilter("to", event.target.value)}
            />
          </label>
          <span>
            {filters.from || "Any date"} — {filters.to || "Any date"}
          </span>
        </div>
        {filters.from && filters.to && filters.from > filters.to && (
          <p role="alert" className="workload-error">
            From date must not be after To date.
          </p>
        )}
        <div id="performance-workload">
          <WorkloadControls
            count={orders.length}
            allRows={allRows}
            onGenerate={generate}
            onAllRows={(value) => {
              setAllRows(value);
              setPage(1);
            }}
          />
        </div>
        <div className="order-results" role="status" aria-live="polite">
          <span>
            {filtered.length.toLocaleString("en-US")} matching orders ·{" "}
            {visible.length.toLocaleString("en-US")} rows mounted ·{" "}
            {selectedCount} selected
          </span>
          <span>PO #, Quantity and Notes are editable</span>
        </div>
        <OrderTable
          orders={visible}
          sortKey={sortKey}
          descending={descending}
          onSort={changeSort}
          onEdit={editOrder}
        />
        <div className="order-pagination">
          <label>
            Items per page:
            <select
              aria-label="Items per page"
              value={pageSize}
              disabled={allRows}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <span>
            {filtered.length ? start + 1 : 0}–{start + visible.length} of{" "}
            {filtered.length.toLocaleString("en-US")} items
          </span>
          <div className="pagination-buttons">
            <button
              aria-label="Previous page"
              disabled={allRows || currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              {allRows ? "All rows" : `${currentPage} of ${pageCount}`}
            </span>
            <button
              aria-label="Next page"
              disabled={allRows || currentPage === pageCount}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </main>
      <footer id="fixture-support" className="vantus-footer">
        <strong>Vantus HQ · Order history performance fixture</strong>
        <p>
          Use your test AUT's Traffic Agent configuration to compare collection
          and Session Replay workloads.
        </p>
        <Link to="/">Back to base component</Link>
      </footer>
    </div>
  );
}
