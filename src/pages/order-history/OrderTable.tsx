import { memo } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { currency, type Order, type OrderEdit, type SortKey } from "./orders";

const columns: { key: SortKey; label: string }[] = [
  { key: "id", label: "Order #" },
  { key: "confirmation", label: "Confirmation #" },
  { key: "type", label: "Order type" },
  { key: "method", label: "Order method" },
  { key: "date", label: "Order date" },
  { key: "total", label: "Total" },
  { key: "po", label: "PO #" },
  { key: "status", label: "Order status" },
];

interface RowProps {
  order: Order;
  onEdit: (id: string, changes: OrderEdit) => void;
}

// Stable row identity preserves input focus; editing one row need not render every sibling.
const OrderRow = memo(function OrderRow({ order, onEdit }: RowProps) {
  const date = new Date(order.date);
  return (
    <tr className="order-row" data-order-id={order.id}>
      <td>
        <div className="cell-content">
          <input
            type="checkbox"
            aria-label={`Select ${order.id}`}
            checked={order.selected}
            onChange={(event) =>
              onEdit(order.id, { selected: event.target.checked })
            }
          />
        </div>
      </td>
      <td>
        <div className="cell-content">
          <details>
            <summary>{order.id}</summary>
            <div className="order-detail">
              <strong>Order details</strong>
              <p>Demo pharmacy · {order.method}</p>
              <p>
                {order.quantity || "0"} units · {currency(order.total)}
              </p>
              <p>{order.notes || "No notes added"}</p>
            </div>
          </details>
        </div>
      </td>
      <td>
        <div className="cell-content">
          <span className="confirmation-number">{order.confirmation}</span>
        </div>
      </td>
      <td>
        <div className="cell-content">
          <span>{order.type}</span>
        </div>
      </td>
      <td>
        <div className="cell-content">
          <span>{order.method}</span>
        </div>
      </td>
      <td>
        <div className="cell-content">
          <time dateTime={order.date}>
            <span>{date.toLocaleDateString("en-US", { timeZone: "UTC" })}</span>
            <small>
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
              })}{" "}
              UTC
            </small>
          </time>
        </div>
      </td>
      <td>
        <div className="cell-content">
          <span>{currency(order.total)}</span>
        </div>
      </td>
      <td>
        <div className="cell-content">
          <input
            type="text"
            aria-label={`PO # for ${order.id}`}
            value={order.po}
            maxLength={80}
            onChange={(event) => onEdit(order.id, { po: event.target.value })}
          />
        </div>
      </td>
      <td>
        <div className="cell-content">
          <span
            className={`order-status status-${order.status.toLowerCase().replace(/ /g, "-")}`}
          >
            {order.status}
          </span>
        </div>
      </td>
      <td>
        <div className="cell-content">
          <input
            type="number"
            aria-label={`Quantity for ${order.id}`}
            min="0"
            max="9999"
            step="1"
            value={order.quantity}
            onChange={(event) =>
              onEdit(order.id, { quantity: event.target.value })
            }
          />
        </div>
      </td>
      <td>
        <div className="cell-content">
          <input
            type="text"
            aria-label={`Notes for ${order.id}`}
            placeholder="Add a note"
            value={order.notes}
            maxLength={200}
            onChange={(event) =>
              onEdit(order.id, { notes: event.target.value })
            }
          />
        </div>
      </td>
    </tr>
  );
});

interface TableProps {
  orders: Order[];
  sortKey: SortKey;
  descending: boolean;
  onSort: (key: SortKey) => void;
  onEdit: RowProps["onEdit"];
}

export function OrderTable({
  orders,
  sortKey,
  descending,
  onSort,
  onEdit,
}: TableProps) {
  return (
    <div
      className="order-table-scroll"
      tabIndex={0}
      role="region"
      aria-label="Order history table, scroll horizontally for editable fields"
    >
      <table id="order-history-table" className="table_data">
        <caption className="sr-only">
          Order history with editable purchase orders, quantities and notes
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Select order</span>
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={
                  sortKey === column.key
                    ? descending
                      ? "descending"
                      : "ascending"
                    : "none"
                }
              >
                <button
                  aria-label={`Sort by ${column.label}`}
                  onClick={() => onSort(column.key)}
                >
                  <span>{column.label}</span>
                  {sortKey === column.key ? (
                    descending ? (
                      <ArrowDown size={14} />
                    ) : (
                      <ArrowUp size={14} />
                    )
                  ) : (
                    <ChevronsUpDown size={14} />
                  )}
                </button>
              </th>
            ))}
            <th scope="col">Quantity</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map((order) => (
              <OrderRow key={order.id} order={order} onEdit={onEdit} />
            ))
          ) : (
            <tr>
              <td colSpan={11} className="order-empty">
                No orders match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
