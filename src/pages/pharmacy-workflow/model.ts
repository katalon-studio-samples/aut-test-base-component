export interface Product {
  id: string;
  name: string;
  category: string;
  serialized: boolean;
  packaging: string;
  stock: number;
  cents: number;
  caseSize: number;
  cin: string;
  ndc: string;
  gtin: string;
}
const featuredProducts: Product[] = [
  [
    "care-cream",
    "Demo Care Cream · 30 g",
    "Skin care",
    true,
    "Ambient",
    48,
    1295,
  ],
  [
    "cooling-pen",
    "Demo Cooling Pen · 2 pack",
    "Cold chain",
    true,
    "Refrigerated",
    24,
    4850,
  ],
  [
    "cleanser",
    "Demo Gentle Cleanser · 120 ml",
    "Skin care",
    false,
    "Ambient",
    72,
    875,
  ],
  ["care-gel", "Demo Care Gel · 60 g", "Skin care", true, "Ambient", 36, 1560],
  [
    "saline",
    "Demo Saline Supplies · 10 pack",
    "Supplies",
    false,
    "Ambient",
    96,
    640,
  ],
  [
    "syringe",
    "Demo Syringe Supplies · 20 pack",
    "Supplies",
    false,
    "Ambient",
    120,
    2290,
  ],
  [
    "dressing",
    "Demo Dressing Kit · 5 pack",
    "Supplies",
    false,
    "Ambient",
    0,
    1895,
  ],
  [
    "cooling-kit",
    "Demo Cooling Kit · 1 each",
    "Cold chain",
    true,
    "Refrigerated",
    16,
    3295,
  ],
].map((data, index) => ({
  id: data[0] as string,
  name: data[1] as string,
  category: data[2] as string,
  serialized: data[3] as boolean,
  packaging: data[4] as string,
  stock: data[5] as number,
  cents: data[6] as number,
  caseSize: 4,
  cin: `DEMO-${1001 + index}`,
  ndc: `DEMO-NDC-${1001 + index}`,
  gtin: `0000000000${1001 + index}`,
}));
// Keep the walkthrough products stable and fill the table with deterministic fixtures.
export const products: Product[] = [
  ...featuredProducts,
  ...Array.from(
    { length: 5000 - featuredProducts.length },
    (_, index): Product => {
      const number = index + featuredProducts.length + 1;
      const code = 1000 + number;
      return {
        id: `practice-product-${number}`,
        name: `Demo Practice Product ${String(number).padStart(4, "0")}`,
        category: "Supplies",
        serialized: number % 2 === 0,
        packaging: "Ambient",
        stock: number % 17 === 0 ? 0 : 20 + (number % 80),
        cents: 500 + (number % 45) * 125,
        caseSize: 4,
        cin: `DEMO-${code}`,
        ndc: `DEMO-NDC-${code}`,
        gtin: String(code).padStart(14, "0"),
      };
    },
  ),
];
export const byId = (id: string) =>
  products.find((product) => product.id === id)!;
export interface Invoice {
  id: string;
  productId: string;
  date: string;
  po: string;
  shipped: number;
  previousReturns: number;
  cents: number;
}
export const invoices: Invoice[] = products.flatMap((product) =>
  [0, 1].map((index) => ({
    id: `INV-${product.cin}-${index + 1}`,
    productId: product.id,
    date: index ? "2026-09-18" : "2026-10-01",
    po: `PO-DEMO-${index + 1}`,
    shipped: index ? 12 : 24,
    previousReturns: index ? 0 : 2,
    cents: product.cents,
  })),
);
export const reasons = [
  "Ordered in error",
  "Damaged packaging",
  "Product recall (demo)",
  "Other",
];
export interface CartLine {
  productId: string;
  quantity: string;
  selected: boolean;
  noSubstitution: boolean;
}
export interface ReturnRow {
  id: string;
  serial: string;
  unit: "Each" | "Case";
  gtin: string;
  quantity: string;
  invoiceId: string;
}
export interface ReturnItem {
  productId: string;
  reason: string;
  comment: string;
  rows: ReturnRow[];
}
export interface SubmittedReturn {
  id: string;
  timestamp: string;
  comment: string;
  items: ReturnItem[];
  totalCents: number;
  quantity: number;
}
export interface Store {
  version: 1;
  cart: CartLine[];
  po: string;
  memo: string;
  favorites: string[];
  history: SubmittedReturn[];
}
export const STORE_KEY = "truephamacy-workflow-v1";
export const emptyStore = (): Store => ({
  version: 1,
  cart: [],
  po: "",
  memo: "",
  favorites: [],
  history: [],
});
export function loadStore(): Store {
  try {
    const data = JSON.parse(
      sessionStorage.getItem(STORE_KEY) || "null",
    ) as Store | null;
    if (
      !data ||
      data.version !== 1 ||
      !Array.isArray(data.cart) ||
      !Array.isArray(data.history) ||
      !Array.isArray(data.favorites)
    )
      return emptyStore();
    if (
      data.cart.some(
        (line) =>
          !products.some((p) => p.id === line.productId) ||
          !validQuantity(line.quantity),
      ) ||
      data.history.some(
        (request) =>
          !request.items?.every(
            (item) =>
              products.some((p) => p.id === item.productId) &&
              Array.isArray(item.rows),
          ),
      )
    )
      return emptyStore();
    return {
      ...data,
      cart: data.cart.slice(0, products.length),
      history: data.history.slice(-30),
      favorites: data.favorites.filter((id) =>
        products.some((p) => p.id === id),
      ),
      po: String(data.po || "").slice(0, 60),
      memo: String(data.memo || "").slice(0, 200),
    };
  } catch {
    return emptyStore();
  }
}
export function validQuantity(value: string) {
  return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 99;
}
export function quantity(product: Product, row: ReturnRow) {
  return product.serialized
    ? row.unit === "Case"
      ? product.caseSize
      : 1
    : Number(row.quantity) || 0;
}
export function remaining(invoice: Invoice, history: SubmittedReturn[]) {
  const used = history
    .flatMap((request) => request.items)
    .reduce(
      (sum, item) =>
        sum +
        item.rows
          .filter((row) => row.invoiceId === invoice.id)
          .reduce((n, row) => n + quantity(byId(item.productId), row), 0),
      0,
    );
  return Math.max(0, invoice.shipped - invoice.previousReturns - used);
}
export function rowError(product: Product, row: ReturnRow) {
  if (product.serialized && !/^\d{1,20}$/.test(row.serial))
    return "Serial must contain 1–20 digits.";
  if (product.serialized && !/^\d{8,14}$/.test(row.gtin))
    return "GTIN must contain 8–14 digits.";
  if (!product.serialized && !validQuantity(row.quantity))
    return "Return quantity must be a whole number from 1 to 99.";
  return "";
}
export function validateReturn(
  items: ReturnItem[],
  history: SubmittedReturn[],
) {
  if (!items.length) return "Add at least one product to the return request.";
  const totals = new Map<string, number>();
  for (const item of items) {
    const product = byId(item.productId);
    if (!reasons.includes(item.reason))
      return `Choose a return reason for ${product.name}.`;
    if (!item.rows.length) return `Add a row for ${product.name}.`;
    const serials = new Set<string>();
    for (const row of item.rows) {
      const error = rowError(product, row);
      if (error) return `${product.name}: ${error}`;
      if (product.serialized && serials.has(row.serial))
        return `${product.name}: serial numbers must be unique.`;
      serials.add(row.serial);
      const invoice = invoices.find(
        (candidate) =>
          candidate.id === row.invoiceId && candidate.productId === product.id,
      );
      if (!invoice) return `Match every row for ${product.name} to an invoice.`;
      totals.set(
        invoice.id,
        (totals.get(invoice.id) || 0) + quantity(product, row),
      );
    }
  }
  for (const [id, total] of totals) {
    const invoice = invoices.find((i) => i.id === id)!;
    if (total > remaining(invoice, history))
      return `Return quantity exceeds the remaining quantity on ${id}.`;
  }
  return "";
}
export function credit(items: ReturnItem[]) {
  return items.reduce(
    (sum, item) =>
      sum +
      item.rows.reduce(
        (n, row) =>
          n +
          (row.invoiceId
            ? quantity(byId(item.productId), row) *
              (invoices.find((i) => i.id === row.invoiceId)?.cents || 0)
            : 0),
        0,
      ),
    0,
  );
}
