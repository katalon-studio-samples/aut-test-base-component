import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { currency } from "../order-history/orders";
import {
  Product,
  ReturnItem,
  ReturnRow,
  invoices,
  quantity,
  reasons,
} from "./model";
export function ReturnCard({
  product,
  item,
  onItem,
  onRow,
  onAddRow,
  onRemoveRow,
  onRemove,
  onMatch,
}: {
  product: Product;
  item: ReturnItem;
  onItem: (changes: Partial<ReturnItem>) => void;
  onRow: (id: string, changes: Partial<ReturnRow>) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onRemove: () => void;
  onMatch: (id: string) => void;
}) {
  const count = item.rows.reduce((n, row) => n + quantity(product, row), 0);
  const cents = item.rows.reduce(
    (n, row) =>
      n +
      quantity(product, row) *
        (invoices.find((invoice) => invoice.id === row.invoiceId)?.cents || 0),
    0,
  );
  return (
    <article
      className="wf-return-card"
      data-testid={`return-card-${product.id}`}
    >
      <div className="wf-return-card-header">
        <div>
          <h3>
            {product.name}{" "}
            <span
              className={`wf-tag ${product.serialized ? "wf-tag-blue" : ""}`}
            >
              {product.serialized ? "Serialized" : "Non-serialized"}
            </span>
          </h3>
          <p>
            CIN: {product.cin} · NDC: {product.ndc} · Packaging:{" "}
            {product.packaging}
          </p>
        </div>
        <div className="wf-card-credit">
          <span>
            Estimated credit <strong>{currency(cents / 100)}</strong>
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from return`}
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>
      <div className="wf-fields">
        <label htmlFor={`reason-${product.id}`}>
          <span className="wf-field-label">
            Return reason <span className="wf-required">*</span>
          </span>
          <select
            id={`reason-${product.id}`}
            value={item.reason}
            onChange={(event) => onItem({ reason: event.target.value })}
          >
            <option value="">Select return reason</option>
            {reasons.map((reason) => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
        </label>
        <label htmlFor={`comment-${product.id}`}>
          Product comment
          <input
            id={`comment-${product.id}`}
            value={item.comment}
            maxLength={200}
            placeholder="Enter comment if applicable"
            onChange={(event) => onItem({ comment: event.target.value })}
          />
        </label>
      </div>
      <details open className="wf-return-overview">
        <summary>
          <ChevronDown size={16} />
          Return overview <span>Return quantity: {count}</span>
        </summary>
        <div className="wf-row-toolbar">
          <span>
            {item.rows.length} {item.rows.length === 1 ? "row" : "rows"} ·{" "}
            {product.serialized
              ? "Each serial is one package; a Case contains 4 units."
              : "Enter the quantity to return."}
          </span>
          <button
            type="button"
            onClick={onAddRow}
            disabled={item.rows.length >= 40}
          >
            <Plus size={15} />
            Add new row
          </button>
        </div>
        <div className="wf-table-scroll">
          <table>
            <caption className="sr-only">
              Return rows for {product.name}
            </caption>
            <thead>
              <tr>
                {product.serialized && (
                  <>
                    <th>Serial # *</th>
                    <th>Unit *</th>
                    <th>GTIN # *</th>
                  </>
                )}
                <th>Invoice #</th>
                <th>Invoice date</th>
                <th>PO #</th>
                <th>Return qty</th>
                <th>Match</th>
                <th>
                  <span className="sr-only">Remove row</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {item.rows.map((row, index) => {
                const invoice = invoices.find(
                  (candidate) => candidate.id === row.invoiceId,
                );
                const label = `${product.name} row ${index + 1}`;
                return (
                  <tr key={row.id} data-testid={`return-row-${row.id}`}>
                    {product.serialized && (
                      <>
                        <td>
                          <input
                            aria-label={`Serial for ${label}`}
                            id={`${row.id}-serial`}
                            inputMode="numeric"
                            value={row.serial}
                            maxLength={20}
                            placeholder="Serial 1–20 digits"
                            onChange={(event) =>
                              onRow(row.id, {
                                serial: event.target.value,
                                invoiceId: "",
                              })
                            }
                          />
                        </td>
                        <td>
                          <select
                            aria-label={`Unit for ${label}`}
                            id={`${row.id}-unit`}
                            value={row.unit}
                            onChange={(event) =>
                              onRow(row.id, {
                                unit: event.target.value as ReturnRow["unit"],
                                invoiceId: "",
                              })
                            }
                          >
                            <option>Each</option>
                            <option>Case</option>
                          </select>
                        </td>
                        <td>
                          <input
                            aria-label={`GTIN for ${label}`}
                            id={`${row.id}-gtin`}
                            inputMode="numeric"
                            maxLength={14}
                            value={row.gtin}
                            placeholder="GTIN 8–14 digits"
                            onChange={(event) =>
                              onRow(row.id, {
                                gtin: event.target.value,
                                invoiceId: "",
                              })
                            }
                          />
                        </td>
                      </>
                    )}
                    <td>
                      {invoice ? (
                        <span className="wf-invoice-ref">{invoice.id}</span>
                      ) : (
                        <span className="wf-muted">Not matched</span>
                      )}
                    </td>
                    <td>{invoice?.date || "—"}</td>
                    <td>{invoice?.po || "—"}</td>
                    <td>
                      {product.serialized ? (
                        quantity(product, row)
                      ) : (
                        <input
                          type="number"
                          min="1"
                          max="99"
                          step="1"
                          aria-label={`Return quantity for ${label}`}
                          value={row.quantity}
                          onChange={(event) =>
                            onRow(row.id, {
                              quantity: event.target.value,
                              invoiceId: "",
                            })
                          }
                        />
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onMatch(row.id)}
                        aria-label={`Match ${label} to invoice`}
                      >
                        {invoice ? "Change invoice" : "Match to invoice"}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onRemoveRow(row.id)}
                        aria-label={`Delete ${label}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!item.rows.length && (
          <p className="wf-empty">
            No rows to display. Add a row to begin matching.
          </p>
        )}
      </details>
    </article>
  );
}
