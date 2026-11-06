import type { FormEvent, InputHTMLAttributes } from "react";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { currency } from "../order-history/orders";
import { citiesForCountry, countries, regionForCity } from "./locations";
import {
  byId,
  deliveryCents,
  type CartLine,
  type CheckoutDetails,
} from "./model";

type TextField = Exclude<
  keyof CheckoutDetails,
  "deliveryMethod" | "paymentMethod" | "billingSameAsShipping"
>;

export interface CheckoutReceipt {
  id: string;
  email: string;
  recipient: string;
  lineCount: number;
  totalCents: number;
  deliveryMethod: CheckoutDetails["deliveryMethod"];
  paymentMethod: CheckoutDetails["paymentMethod"];
}

interface CheckoutProps {
  details: CheckoutDetails;
  cart: CartLine[];
  subtotalCents: number;
  po: string;
  memo: string;
  cartError: boolean;
  receipt: CheckoutReceipt | null;
  onChange: (changes: Partial<CheckoutDetails>) => void;
  onBack: () => void;
  onShop: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function Field({
  label,
  field,
  details,
  onChange,
  required,
  ...inputProps
}: {
  label: string;
  field: TextField;
  details: CheckoutDetails;
  onChange: CheckoutProps["onChange"];
  required?: boolean;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "value" | "onChange"
>) {
  const value =
    field === "region"
      ? regionForCity(details.country, details.city)
      : field === "billingRegion"
        ? regionForCity(details.billingCountry, details.billingCity)
        : details[field];
  return (
    <label className="wf-checkout-field">
      <span>
        {label} {required && <span aria-hidden="true">*</span>}
      </span>
      <input
        {...inputProps}
        name={field}
        value={value}
        required={required}
        onChange={(event) => onChange({ [field]: event.target.value })}
      />
    </label>
  );
}

function SelectField({
  label,
  field,
  value,
  options,
  placeholder,
  onValueChange,
  disabled = false,
}: {
  label: string;
  field: TextField;
  value: string;
  options: string[];
  placeholder: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="wf-checkout-field">
      <span>
        {label} <span aria-hidden="true">*</span>
      </span>
      <select
        name={field}
        value={options.includes(value) ? value : ""}
        required
        disabled={disabled}
        onChange={(event) => onValueChange(event.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkout({
  details,
  cart,
  subtotalCents,
  po,
  memo,
  cartError,
  receipt,
  onChange,
  onBack,
  onShop,
  onSubmit,
}: CheckoutProps) {
  if (receipt) {
    return (
      <div className="wf-checkout-confirmation" role="status">
        <CheckCircle2 size={42} aria-hidden="true" />
        <h2>Order placed</h2>
        <p>
          Practice order <strong>{receipt.id}</strong> was placed locally for{" "}
          {receipt.recipient}. A demo confirmation is addressed to{" "}
          <strong>{receipt.email}</strong>.
        </p>
        <div className="wf-checkout-confirmation-facts">
          <span>{receipt.lineCount} product lines</span>
          <span>
            {receipt.deliveryMethod === "express" ? "Express" : "Standard"}{" "}
            delivery
          </span>
          <strong>{currency(receipt.totalCents / 100)}</strong>
        </div>
        <p className="wf-checkout-help">
          No payment, email or shipment was sent. The cart remains available for
          return exercises.
        </p>
        {receipt.paymentMethod === "bank-transfer" && (
          <p className="wf-checkout-help">
            Bank transfer is simulated. Use {receipt.id} as the practice
            reference; no transfer is needed.
          </p>
        )}
        <div className="wf-checkout-actions">
          <button type="button" onClick={onBack}>
            Return to cart
          </button>
          <button type="button" className="wf-primary" onClick={onShop}>
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="wf-empty wf-checkout-empty">
        <ShoppingCart size={32} aria-hidden="true" />
        <h2>Your cart is empty.</h2>
        <p>Add a product before checking out.</p>
        <button type="button" onClick={onShop}>
          Continue shopping
        </button>
      </div>
    );
  }

  const shippingCents = deliveryCents(details.deliveryMethod);
  const totalCents = subtotalCents + shippingCents;
  return (
    <form
      id="wf-checkout-form"
      className="wf-checkout-layout"
      onSubmit={onSubmit}
    >
      <div className="wf-checkout-main">
        <section
          className="wf-checkout-panel"
          aria-labelledby="wf-contact-title"
        >
          <div className="wf-checkout-section-heading">
            <span>1</span>
            <div>
              <h2 id="wf-contact-title">Contact information</h2>
              <p>We use this information for the practice order summary.</p>
            </div>
          </div>
          <div className="wf-checkout-fields">
            <Field
              label="Full name"
              field="fullName"
              details={details}
              onChange={onChange}
              required
              autoComplete="name"
              maxLength={120}
            />
            <Field
              label="Email address"
              field="email"
              details={details}
              onChange={onChange}
              required
              type="email"
              autoComplete="email"
              maxLength={120}
            />
            <Field
              label="Phone number"
              field="phone"
              details={details}
              onChange={onChange}
              required
              type="tel"
              autoComplete="tel"
              pattern="[+0-9(). -]{7,20}"
              title="Enter a phone number with 7 to 20 digits or standard punctuation."
              maxLength={20}
            />
            <Field
              label="Pharmacy name"
              field="pharmacyName"
              details={details}
              onChange={onChange}
              required
              autoComplete="organization"
              maxLength={120}
            />
          </div>
        </section>

        <section
          className="wf-checkout-panel"
          aria-labelledby="wf-delivery-title"
        >
          <div className="wf-checkout-section-heading">
            <span>2</span>
            <div>
              <h2 id="wf-delivery-title">Delivery address</h2>
              <p>Enter the address that should receive this practice order.</p>
            </div>
          </div>
          <div className="wf-checkout-fields">
            <div className="wf-checkout-wide">
              <Field
                label="Street address"
                field="address1"
                details={details}
                onChange={onChange}
                required
                autoComplete="shipping address-line1"
                maxLength={120}
              />
            </div>
            <div className="wf-checkout-wide">
              <Field
                label="Apartment, suite, etc."
                field="address2"
                details={details}
                onChange={onChange}
                autoComplete="shipping address-line2"
                maxLength={120}
              />
            </div>
            <SelectField
              label="Country"
              field="country"
              value={details.country}
              options={countries}
              placeholder="Select a country"
              onValueChange={(country) =>
                onChange({ country, city: "", region: "", postalCode: "" })
              }
            />
            <SelectField
              label="City"
              field="city"
              value={details.city}
              options={citiesForCountry(details.country).map(
                (option) => option.name,
              )}
              placeholder="Select a city"
              disabled={!countries.includes(details.country)}
              onValueChange={(city) =>
                onChange({ city, region: regionForCity(details.country, city) })
              }
            />
            <Field
              label="State / province"
              field="region"
              details={details}
              onChange={onChange}
              required
              readOnly
              placeholder="Filled from city"
              autoComplete="shipping address-level1"
              maxLength={120}
            />
            <Field
              label="ZIP / postal code"
              field="postalCode"
              details={details}
              onChange={onChange}
              required
              autoComplete="shipping postal-code"
              maxLength={20}
            />
            <div className="wf-checkout-wide">
              <Field
                label="Delivery instructions (optional)"
                field="deliveryInstructions"
                details={details}
                onChange={onChange}
                maxLength={250}
                placeholder="Receiving hours or delivery notes"
              />
            </div>
          </div>
          <fieldset className="wf-checkout-options">
            <legend>Delivery method</legend>
            <label className="wf-checkout-option">
              <input
                type="radio"
                name="deliveryMethod"
                aria-label="Standard delivery"
                checked={details.deliveryMethod === "standard"}
                onChange={() => onChange({ deliveryMethod: "standard" })}
              />
              <span>
                <strong>Standard delivery</strong>
                <small>Practice delivery estimate: 3–5 business days</small>
              </span>
              <strong>Free</strong>
            </label>
            <label className="wf-checkout-option">
              <input
                type="radio"
                name="deliveryMethod"
                aria-label="Express delivery"
                checked={details.deliveryMethod === "express"}
                onChange={() => onChange({ deliveryMethod: "express" })}
              />
              <span>
                <strong>Express delivery</strong>
                <small>Practice delivery estimate: 1–2 business days</small>
              </span>
              <strong>{currency(12.95)}</strong>
            </label>
          </fieldset>
        </section>

        <section
          className="wf-checkout-panel"
          aria-labelledby="wf-billing-title"
        >
          <div className="wf-checkout-section-heading">
            <span>3</span>
            <div>
              <h2 id="wf-billing-title">Billing and payment</h2>
              <p>Demo account # DEMO-001. No real payment is collected.</p>
            </div>
          </div>
          <label className="wf-checkout-checkbox">
            <input
              type="checkbox"
              checked={details.billingSameAsShipping}
              onChange={(event) =>
                onChange({ billingSameAsShipping: event.target.checked })
              }
            />
            Billing address same as delivery address
          </label>
          {!details.billingSameAsShipping && (
            <div className="wf-checkout-fields wf-checkout-billing-fields">
              <Field
                label="Billing name"
                field="billingName"
                details={details}
                onChange={onChange}
                required
                autoComplete="billing name"
                maxLength={120}
              />
              <Field
                label="Billing street address"
                field="billingAddress1"
                details={details}
                onChange={onChange}
                required
                autoComplete="billing address-line1"
                maxLength={120}
              />
              <div className="wf-checkout-wide">
                <Field
                  label="Billing apartment, suite, etc."
                  field="billingAddress2"
                  details={details}
                  onChange={onChange}
                  autoComplete="billing address-line2"
                  maxLength={120}
                />
              </div>
              <SelectField
                label="Billing country"
                field="billingCountry"
                value={details.billingCountry}
                options={countries}
                placeholder="Select a country"
                onValueChange={(billingCountry) =>
                  onChange({
                    billingCountry,
                    billingCity: "",
                    billingRegion: "",
                    billingPostalCode: "",
                  })
                }
              />
              <SelectField
                label="Billing city"
                field="billingCity"
                value={details.billingCity}
                options={citiesForCountry(details.billingCountry).map(
                  (option) => option.name,
                )}
                placeholder="Select a city"
                disabled={!countries.includes(details.billingCountry)}
                onValueChange={(billingCity) =>
                  onChange({
                    billingCity,
                    billingRegion: regionForCity(
                      details.billingCountry,
                      billingCity,
                    ),
                  })
                }
              />
              <Field
                label="Billing state / province"
                field="billingRegion"
                details={details}
                onChange={onChange}
                required
                readOnly
                placeholder="Filled from city"
                autoComplete="billing address-level1"
                maxLength={120}
              />
              <Field
                label="Billing ZIP / postal code"
                field="billingPostalCode"
                details={details}
                onChange={onChange}
                required
                autoComplete="billing postal-code"
                maxLength={20}
              />
            </div>
          )}
          <fieldset className="wf-checkout-options">
            <legend>Payment method</legend>
            <label className="wf-checkout-option">
              <input
                type="radio"
                name="paymentMethod"
                aria-label="Invoice to pharmacy account"
                checked={details.paymentMethod === "invoice"}
                onChange={() => onChange({ paymentMethod: "invoice" })}
              />
              <span>
                <strong>Invoice to pharmacy account</strong>
                <small>Demo account billing; no payment details needed</small>
              </span>
            </label>
            <label className="wf-checkout-option">
              <input
                type="radio"
                name="paymentMethod"
                aria-label="Bank transfer (demo)"
                checked={details.paymentMethod === "bank-transfer"}
                onChange={() => onChange({ paymentMethod: "bank-transfer" })}
              />
              <span>
                <strong>Bank transfer (demo)</strong>
                <small>Instructions appear on the practice confirmation</small>
              </span>
            </label>
          </fieldset>
        </section>
      </div>

      <aside
        className="wf-checkout-panel wf-checkout-review"
        aria-labelledby="wf-review-title"
      >
        <h2 id="wf-review-title">Order summary</h2>
        <p>Review your products before placing this practice order.</p>
        <ul className="wf-checkout-products">
          {cart.map((line) => {
            const product = byId(line.productId);
            return (
              <li key={line.productId}>
                <div>
                  <strong>{product.name}</strong>
                  <small>
                    Qty {line.quantity} · {product.packaging}
                  </small>
                </div>
                <span>
                  {currency((Number(line.quantity) * product.cents) / 100)}
                </span>
              </li>
            );
          })}
        </ul>
        {(po || memo) && (
          <div className="wf-checkout-order-notes">
            {po && (
              <p>
                <strong>PO number:</strong> {po}
              </p>
            )}
            {memo && (
              <p>
                <strong>PO memo:</strong> {memo}
              </p>
            )}
          </div>
        )}
        <dl className="wf-checkout-totals">
          <div>
            <dt>Product subtotal</dt>
            <dd>{currency(subtotalCents / 100)}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>{shippingCents ? currency(shippingCents / 100) : "Free"}</dd>
          </div>
          <div className="wf-checkout-grand-total">
            <dt>Practice order total</dt>
            <dd>{currency(totalCents / 100)}</dd>
          </div>
        </dl>
        <p className="wf-checkout-help">
          Tax is not calculated in this practice checkout. No real order or
          payment is sent.
        </p>
        {cartError && (
          <p className="wf-error" role="alert">
            Review cart quantities before checkout.
          </p>
        )}
        <button
          className="wf-primary wf-checkout-place"
          type="submit"
          disabled={cartError}
        >
          Place practice order
        </button>
        <button className="wf-checkout-back" type="button" onClick={onBack}>
          Back to cart
        </button>
      </aside>
    </form>
  );
}
