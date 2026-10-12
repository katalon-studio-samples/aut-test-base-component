export const MAX_ROWS = 10_000;
export const STATUSES = [
  "Completed",
  "In Process",
  "Shipped",
  "Canceled",
] as const;
export const ORDER_TYPES = ["REGULAR", "C2", "Cold chain"] as const;

export interface Order {
  id: string;
  confirmation: string;
  type: string;
  method: string;
  date: string;
  total: number;
  status: string;
  po: string;
  quantity: string;
  notes: string;
  selected: boolean;
}

export type SortKey =
  | "id"
  | "confirmation"
  | "type"
  | "method"
  | "date"
  | "total"
  | "po"
  | "status";
export type OrderEdit = Partial<
  Pick<Order, "po" | "quantity" | "notes" | "selected">
>;
export const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Stable synthetic values let the same workload be compared with/without the agent.
export function generateOrders(count: number): Order[] {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    return {
      id: `DEMO-${String(number).padStart(6, "0")}`,
      confirmation: `CONF-${String(number).padStart(6, "0")}`,
      type: ORDER_TYPES[index % ORDER_TYPES.length],
      method: index % 5 === 0 ? "Vantus HQ" : "OrderExpress",
      date: new Date(
        Date.UTC(2026, 9, 7 - (index % 30), 18, index % 60),
      ).toISOString(),
      total: ((number * 7919) % 500000) / 100 + 10,
      status: STATUSES[index % STATUSES.length],
      po: `PO-${String(number).padStart(6, "0")}`,
      quantity: String(1 + (index % 24)),
      notes: "",
      selected: false,
    };
  });
}

export function rowCountError(value: string): string {
  const count = Number(value);
  return value.trim() === "" ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > MAX_ROWS
    ? `Enter a whole number from 1 to ${MAX_ROWS.toLocaleString("en-US")}.`
    : "";
}

export interface OrderFilters {
  search: string;
  status: string;
  type: string;
  po: string;
  from: string;
  to: string;
}

export const EMPTY_FILTERS: OrderFilters = {
  search: "",
  status: "",
  type: "",
  po: "",
  from: "",
  to: "",
};

export function filterOrders(orders: Order[], filters: OrderFilters): Order[] {
  const query = filters.search.trim().toLowerCase();
  const po = filters.po.trim().toLowerCase();
  return orders.filter((order) => {
    const day = order.date.slice(0, 10);
    return (
      (!filters.status || order.status === filters.status) &&
      (!filters.type || order.type === filters.type) &&
      (!po || order.po.toLowerCase().includes(po)) &&
      (!filters.from || day >= filters.from) &&
      (!filters.to || day <= filters.to) &&
      (!query ||
        [
          order.id,
          order.confirmation,
          order.po,
          order.notes,
          order.method,
        ].some((value) => value.toLowerCase().includes(query)))
    );
  });
}

export function sortOrders(
  orders: Order[],
  key: SortKey,
  descending: boolean,
): Order[] {
  return [...orders].sort((a, b) => {
    const left = a[key],
      right = b[key];
    const result =
      typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right));
    return (descending ? -1 : 1) * result || a.id.localeCompare(b.id);
  });
}
