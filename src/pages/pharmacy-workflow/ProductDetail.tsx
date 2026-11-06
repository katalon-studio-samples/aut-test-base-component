import { useState, type FormEvent } from "react";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { currency } from "../order-history/orders";
import type { Product } from "./model";
import "./product-detail.css";

type PurchaseUnit = "Each" | "Pack" | "Case" | "Carton";

interface OrderDraft {
  productId: string;
  unit: PurchaseUnit;
  quantity: string;
  noSubstitution: boolean;
}

export interface ProductDetailProps {
  product: Product;
  cartQuantity: number;
  noSubstitution: boolean;
  onAdd: (units: number, noSubstitution: boolean) => void;
  onBack: () => void;
  onViewCart: () => void;
}

export function ProductDetail({
  product,
  cartQuantity,
  noSubstitution,
  onAdd,
  onBack,
  onViewCart,
}: ProductDetailProps) {
  const [draft, setDraft] = useState<OrderDraft>(() => ({
    productId: product.id,
    unit: "Each",
    quantity: "1",
    noSubstitution,
  }));
  // The detail page can receive another product without remounting.
  const currentDraft =
    draft.productId === product.id
      ? draft
      : {
          productId: product.id,
          unit: "Each" as const,
          quantity: "1",
          noSubstitution,
        };
  const caseSize = Math.max(1, product.caseSize);
  // These demo groupings are converted to catalog units before entering the cart.
  const purchaseUnits = [
    { value: "Each", units: 1, singular: "each", plural: "each" },
    { value: "Pack", units: 2, singular: "pack", plural: "packs" },
    { value: "Case", units: caseSize, singular: "case", plural: "cases" },
    {
      value: "Carton",
      units: caseSize * 3,
      singular: "carton",
      plural: "cartons",
    },
  ] as const;
  const unitsInCart = Math.max(0, cartQuantity);
  const availableUnits = Math.max(0, Math.min(99, product.stock) - unitsInCart);
  const requestedUnit =
    purchaseUnits.find((option) => option.value === currentDraft.unit) ??
    purchaseUnits[0];
  const selectedOption =
    requestedUnit.units <= availableUnits ? requestedUnit : purchaseUnits[0];
  const selectedUnit = selectedOption.value;
  const unitsPerSelection = selectedOption.units;
  const maxQuantity = Math.floor(availableUnits / unitsPerSelection);
  const quantityIsWhole = /^[1-9]\d*$/.test(currentDraft.quantity);
  const enteredQuantity = quantityIsWhole ? Number(currentDraft.quantity) : 0;
  const validQuantity =
    availableUnits > 0 && quantityIsWhole && enteredQuantity <= maxQuantity;
  const selectedUnits = validQuantity ? enteredQuantity * unitsPerSelection : 0;
  const quantityLabel =
    enteredQuantity === 1 ? selectedOption.singular : selectedOption.plural;
  const quantityError =
    availableUnits === 0
      ? "No more units are available to add."
      : currentDraft.quantity === ""
        ? "Enter a quantity."
        : !quantityIsWhole
          ? "Enter a whole number greater than zero."
          : enteredQuantity > maxQuantity
            ? `Only ${maxQuantity} ${selectedUnit === "Each" ? "units" : maxQuantity === 1 ? selectedOption.singular : selectedOption.plural} can be added.`
            : "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validQuantity) return;
    onAdd(selectedUnits, currentDraft.noSubstitution);
  }

  return (
    <section
      className="wf-product-detail"
      data-testid="product-detail"
      aria-labelledby="wf-product-detail-title"
    >
      <button type="button" className="wf-product-detail-back" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to product list
      </button>

      <div className="wf-product-detail-header">
        <div className="wf-product-detail-symbol" aria-hidden="true">
          <Package size={32} strokeWidth={1.8} />
        </div>
        <div>
          <p className="wf-product-detail-eyebrow">Product details</p>
          <h1 id="wf-product-detail-title">{product.name}</h1>
          <div className="wf-product-detail-badges">
            <span>{product.category}</span>
            <span>{product.serialized ? "Serialized" : "Not serialized"}</span>
            <span
              className={
                product.stock > 0
                  ? "wf-product-detail-stock-in"
                  : "wf-product-detail-stock-out"
              }
            >
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>
      </div>

      <div className="wf-product-detail-layout">
        <section
          className="wf-product-detail-info"
          aria-labelledby="wf-product-detail-info-heading"
        >
          <h2 id="wf-product-detail-info-heading">Product information</h2>
          <p className="wf-product-detail-description">
            Review the product identifiers and ordering details before adding it
            to your practice cart.
          </p>
          <dl className="wf-product-detail-facts">
            <div>
              <dt>Category</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Serialized</dt>
              <dd>{product.serialized ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt>Storage / handling</dt>
              <dd>{product.packaging}</dd>
            </div>
            <div>
              <dt>Case size</dt>
              <dd>{caseSize} each per case</dd>
            </div>
            <div>
              <dt>CIN</dt>
              <dd>{product.cin}</dd>
            </div>
            <div>
              <dt>NDC</dt>
              <dd>{product.ndc}</dd>
            </div>
            <div>
              <dt>GTIN</dt>
              <dd>{product.gtin}</dd>
            </div>
          </dl>
        </section>

        <form
          className="wf-product-detail-order"
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="wf-product-detail-order-heading"
        >
          <h2 id="wf-product-detail-order-heading">Add to cart</h2>
          <div className="wf-product-detail-price">
            <strong>{currency(product.cents / 100)}</strong>
            <span>per each</span>
          </div>
          <p
            className="wf-product-detail-availability"
            data-available={availableUnits > 0}
          >
            <span aria-hidden="true" />
            {product.stock} units available
            {unitsInCart > 0 && ` · ${unitsInCart} already in cart`}
          </p>

          <label
            className="wf-product-detail-field"
            htmlFor="wf-product-detail-unit"
          >
            <span>Purchase unit</span>
            <select
              id="wf-product-detail-unit"
              data-testid="product-detail-unit"
              value={selectedUnit}
              disabled={availableUnits === 0}
              onChange={(event) =>
                setDraft({
                  ...currentDraft,
                  unit: event.target.value as PurchaseUnit,
                  quantity: "1",
                })
              }
            >
              {purchaseUnits.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.units > availableUnits}
                >
                  {option.value} ({option.units}{" "}
                  {option.units === 1 ? "unit" : "units"})
                </option>
              ))}
            </select>
          </label>
          <p className="wf-product-detail-help">
            {selectedUnit === "Each"
              ? `You can add up to ${availableUnits} catalog units.`
              : `One ${selectedOption.singular} adds ${unitsPerSelection} catalog units to the cart.`}
          </p>

          <label
            className="wf-product-detail-field"
            htmlFor="wf-product-detail-quantity"
          >
            <span>Quantity</span>
            <input
              id="wf-product-detail-quantity"
              data-testid="product-detail-quantity"
              type="number"
              inputMode="numeric"
              min={1}
              max={Math.max(1, maxQuantity)}
              step={1}
              value={availableUnits === 0 ? "" : currentDraft.quantity}
              disabled={availableUnits === 0}
              aria-invalid={Boolean(quantityError)}
              aria-describedby="wf-product-detail-quantity-help"
              onChange={(event) =>
                setDraft({ ...currentDraft, quantity: event.target.value })
              }
            />
          </label>
          <p
            id="wf-product-detail-quantity-help"
            className={
              quantityError
                ? "wf-product-detail-error"
                : "wf-product-detail-help"
            }
            role={quantityError ? "alert" : undefined}
          >
            {quantityError ||
              `Up to ${maxQuantity} ${selectedUnit === "Each" ? "units" : maxQuantity === 1 ? selectedOption.singular : selectedOption.plural} available to add.`}
          </p>

          <label className="wf-product-detail-checkbox">
            <input
              type="checkbox"
              data-testid="product-detail-no-substitution"
              checked={currentDraft.noSubstitution}
              onChange={(event) =>
                setDraft({
                  ...currentDraft,
                  noSubstitution: event.target.checked,
                })
              }
            />
            <span>Do not substitute</span>
          </label>

          <div className="wf-product-detail-total" aria-live="polite">
            <span>
              {validQuantity
                ? `${enteredQuantity} ${quantityLabel} · ${selectedUnits} ${selectedUnits === 1 ? "unit" : "units"}`
                : availableUnits === 0
                  ? product.stock === 0
                    ? "Out of stock"
                    : "Cart limit reached"
                  : "Select a valid quantity"}
            </span>
            <strong>
              {validQuantity
                ? currency((product.cents * selectedUnits) / 100)
                : "—"}
            </strong>
          </div>

          <button
            className="wf-primary wf-product-detail-add"
            type="submit"
            data-testid="product-detail-add-cart"
            disabled={!validQuantity}
          >
            <ShoppingCart size={17} aria-hidden="true" />
            Add to cart
          </button>
          <button
            className="wf-product-detail-view-cart"
            type="button"
            onClick={onViewCart}
          >
            View cart
          </button>
        </form>
      </div>
    </section>
  );
}
