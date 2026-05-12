import { useEffect, useRef, useState } from "react";

const US_STATES = [
  "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL",
  "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA",
  "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE",
  "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY",
];

const DOCUMENT_TYPES = [
  "Refinance", "Purchase", "Home Equity", "Reverse Mortgage",
  "HELOC", "Construction Loan", "Commercial Loan",
];

const TIME_ZONES = [
  "Eastern (ET)", "Central (CT)", "Mountain (MT)", "Pacific (PT)",
  "Alaska (AKT)", "Hawaii (HT)",
];

const NOTARY_TYPES = [
  "Traditional Notary", "Remote Online Notary (RON)",
  "In-Person Electronic Notary (IPEN)", "Mobile Notary",
];

const COUNTY_OPTIONS = [
  "Jefferson", "Madison", "Franklin", "Monroe", "Washington",
  "Lincoln", "Hamilton", "Jackson", "Adams", "Union",
];

interface NgSelectProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (val: string) => void;
}

// Mimics Angular ng-select DOM structure:
// question-group > question-selectbox > div > .custom > .ng-select-container
// and dropdown panel with role="option" divs
const NgSelectField = ({
  id,
  label,
  options,
  value,
  placeholder = "Select an option",
  required,
  onChange,
}: NgSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const open = () => {
    setIsOpen(true);
    setQuery("");
    inputRef.current?.focus();
  };

  // Only open on focus if not already open (prevents Tab reopening a just-closed dropdown)
  const handleFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
      setQuery("");
    }
  };

  // Delay close so option mousedown fires before blur removes the panel
  const handleBlur = () => {
    setTimeout(close, 150);
  };

  const select = (opt: string) => {
    onChange(opt);
    close();
  };

  const panelId = `ng-dropdown-panel-${id}`;

  return (
    // question-group custom element wrapping — mirrors Angular component host element
    <question-group data-field={id}>
      <div className="question-label">
        <label htmlFor={`ng-input-${id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>
      {/* question-selectbox mirrors the Angular select component host */}
      <question-selectbox>
        <div className="ng-select-wrapper" ref={containerRef as unknown as React.Ref<HTMLDivElement>}>
          <div className="custom ng-select ng-select-single ng-select-searchable ng-select-clearable ng-untouched ng-pristine ng-valid">
            {/* .ng-select-container mirrors ng-select internal structure */}
            <div className="ng-select-container" onClick={open} data-test={`ng-select-container-${id}`}>
              <div className="ng-value-container">
                {!value && !isOpen && (
                  <div className="ng-placeholder">{placeholder}</div>
                )}
                {value && !isOpen && (
                  <div className="ng-value">
                    <span className="ng-value-label">{value}</span>
                  </div>
                )}
                <div className="ng-input">
                  <input
                    ref={inputRef}
                    id={`ng-input-${id}`}
                    type="text"
                    role="combobox"
                    aria-label={label}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-autocomplete="list"
                    aria-controls={panelId}
                    autoComplete="off"
                    value={isOpen ? query : ""}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="ng-select-input"
                    data-test={`ng-input-${id}`}
                  />
                </div>
              </div>
              <span className="ng-arrow-wrapper" aria-hidden="true">
                <span className="ng-arrow" />
              </span>
            </div>

            {/* .ng-dropdown-panel mirrors ng-select dropdown panel */}
            {isOpen && (
              <div
                id={panelId}
                className="ng-dropdown-panel ng-select-bottom"
                role="listbox"
                aria-label={label}
                data-test={`ng-dropdown-panel-${id}`}
              >
                <div className="ng-dropdown-panel-items scroll-host">
                  {/* First child is the virtual-scroll padding element */}
                  <div id={`${panelId}-padding-top`} style={{ height: 0 }} />
                  {/* Second child holds the actual option rows */}
                  <div>
                    {filtered.map((opt, idx) => (
                      <div
                        key={opt}
                        role="option"
                        id={`${panelId}-option-${idx}`}
                        aria-selected={opt === value}
                        className={`ng-option${opt === value ? " ng-option-selected" : ""}${idx === 0 ? " ng-option-marked" : ""}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          select(opt);
                        }}
                        data-test={`${id}-option-${idx + 1}`}
                      >
                        {opt}
                      </div>
                    ))}
                    {filtered.length === 0 && (
                      <div className="ng-option ng-option-disabled">No items found</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </question-selectbox>
    </question-group>
  );
};

const TextQuestion = ({
  id,
  label,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <question-group data-field={id}>
    <div className="question-label">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    </div>
    <question-text>
      <div className="ng-input-wrapper">
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          data-test={id}
        />
      </div>
    </question-text>
  </question-group>
);

export const NgSelectDropdownPage = () => {
  const [docType, setDocType] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [notaryType, setNotaryType] = useState("");
  const [county, setCounty] = useState("");
  const [signingState, setSigningState] = useState("");
  const [titleState, setTitleState] = useState("");
  const [lenderState, setLenderState] = useState("");

  return (
    <>
      <style>{`
        question-group,
        question-selectbox,
        question-text {
          display: block;
        }

        .ng-select-wrapper {
          position: relative;
        }

        .ng-select-container {
          display: flex;
          align-items: center;
          min-height: 38px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
          padding: 0 8px;
          user-select: none;
        }

        .dark .ng-select-container {
          background: #1f2937;
          border-color: #374151;
          color: #f9fafb;
        }

        .ng-select-container:hover {
          border-color: #9ca3af;
        }

        .ng-value-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 4px;
          overflow: hidden;
          padding: 4px 0;
          min-height: 30px;
          position: relative;
        }

        .ng-placeholder {
          color: #9ca3af;
          font-size: 14px;
          position: absolute;
          pointer-events: none;
        }

        .ng-value {
          font-size: 14px;
          color: #111827;
        }

        .dark .ng-value {
          color: #f9fafb;
        }

        .ng-input {
          flex: 1;
          position: relative;
        }

        .ng-select-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          width: 100%;
          color: #111827;
          padding: 0;
        }

        .dark .ng-select-input {
          color: #f9fafb;
        }

        .ng-arrow-wrapper {
          padding: 0 4px;
          display: flex;
          align-items: center;
        }

        .ng-arrow {
          border-color: #6b7280 transparent transparent;
          border-style: solid;
          border-width: 5px 4px 2.5px;
          display: inline-block;
        }

        .ng-dropdown-panel {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 1050;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          margin-top: 2px;
        }

        .dark .ng-dropdown-panel {
          background: #1f2937;
          border-color: #374151;
        }

        .ng-dropdown-panel-items {
          max-height: 220px;
          overflow-y: auto;
          border-radius: 6px;
        }

        .ng-option {
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          color: #374151;
          white-space: nowrap;
        }

        .dark .ng-option {
          color: #e5e7eb;
        }

        .ng-option:hover,
        .ng-option-marked {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .dark .ng-option:hover,
        .dark .ng-option-marked {
          background: #1e3a5f;
          color: #93c5fd;
        }

        .ng-option-selected {
          background: #dbeafe;
          color: #1e40af;
          font-weight: 500;
        }

        .dark .ng-option-selected {
          background: #1e3a5f;
          color: #60a5fa;
        }

        .ng-option-disabled {
          color: #9ca3af;
          cursor: default;
          font-style: italic;
        }

        /* Question grid layout */
        .question-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .question-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Notary Signing Order
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Complete all required fields to submit a signing request.
          </p>
          <div className="mt-3 h-px w-full bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Signer Information</h2>

          <div className="question-row">
            {/* question-group div:nth-child(1) */}
            <TextQuestion id="first-name" label="First Name" placeholder="John" required />
            {/* question-group div:nth-child(2) */}
            <TextQuestion id="last-name" label="Last Name" placeholder="Doe" required />
          </div>

          <div className="question-row">
            {/* question-group div:nth-child(3) */}
            <TextQuestion id="email" label="Email Address" placeholder="john.doe@example.com" required />
            {/* question-group div:nth-child(4) */}
            <TextQuestion id="phone" label="Phone Number" placeholder="(555) 000-0000" required />
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Document Details</h2>

          <div className="question-row">
            {/* question-group div:nth-child(5) */}
            <NgSelectField
              id="document-type"
              label="Document Type"
              options={DOCUMENT_TYPES}
              value={docType}
              placeholder="Select document type"
              required
              onChange={setDocType}
            />
            {/* question-group div:nth-child(6) */}
            <TextQuestion id="loan-number" label="Loan Number" placeholder="LN-000000" />
          </div>

          <div className="question-row">
            {/* question-group div:nth-child(7) */}
            <TextQuestion id="loan-amount" label="Loan Amount" placeholder="$0.00" />
            {/* question-group div:nth-child(8) */}
            <TextQuestion id="closing-date" label="Closing Date" placeholder="MM/DD/YYYY" required />
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Signing Appointment</h2>

          <div className="question-row">
            {/* question-group div:nth-child(9) */}
            <NgSelectField
              id="notary-type"
              label="Notary Type"
              options={NOTARY_TYPES}
              value={notaryType}
              placeholder="Select notary type"
              required
              onChange={setNotaryType}
            />
            {/* question-group div:nth-child(10) */}
            <NgSelectField
              id="time-zone"
              label="Time Zone"
              options={TIME_ZONES}
              value={timeZone}
              placeholder="Select time zone"
              required
              onChange={setTimeZone}
            />
          </div>

          <div className="question-row">
            {/* question-group div:nth-child(11) */}
            <TextQuestion id="appointment-date" label="Appointment Date" placeholder="MM/DD/YYYY" required />
            {/* question-group div:nth-child(12) */}
            <TextQuestion id="appointment-time" label="Appointment Time" placeholder="HH:MM AM/PM" required />
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Property &amp; Signing Location</h2>

          <div className="question-row">
            {/* question-group div:nth-child(13) — the exact nth-child from the bug report */}
            <NgSelectField
              id="signing-state"
              label="Signing State"
              options={US_STATES}
              value={signingState}
              placeholder="Select state"
              required
              onChange={setSigningState}
            />
            {/* question-group div:nth-child(14) */}
            <NgSelectField
              id="county"
              label="County"
              options={COUNTY_OPTIONS}
              value={county}
              placeholder="Select county"
              onChange={setCounty}
            />
          </div>

          <div className="question-row">
            {/* question-group div:nth-child(15) */}
            <TextQuestion id="property-address" label="Property Address" placeholder="123 Main St" required />
            {/* question-group div:nth-child(16) */}
            <TextQuestion id="property-city" label="City" placeholder="Springfield" required />
          </div>

          <div className="question-row">
            {/* question-group div:nth-child(17) */}
            <TextQuestion id="property-zip" label="ZIP Code" placeholder="00000" required />
            {/* question-group div:nth-child(18) */}
            <TextQuestion id="apn" label="APN / Parcel Number" placeholder="000-000-000" />
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Title &amp; Lender</h2>

          <div className="question-row">
            {/* question-group div:nth-child(19) */}
            <TextQuestion id="title-company" label="Title Company" placeholder="ABC Title Co." />
            {/* question-group div:nth-child(20) */}
            <NgSelectField
              id="title-state"
              label="Title State"
              options={US_STATES}
              value={titleState}
              placeholder="Select state"
              onChange={setTitleState}
            />
          </div>

          <div className="question-row">
            {/* question-group div:nth-child(21) */}
            <TextQuestion id="lender-name" label="Lender Name" placeholder="First National Bank" />
            {/* question-group div:nth-child(22) */}
            <NgSelectField
              id="lender-state"
              label="Lender State"
              options={US_STATES}
              value={lenderState}
              placeholder="Select state"
              onChange={setLenderState}
            />
          </div>

          <div className="question-row">
            {/* question-group div:nth-child(23) */}
            <TextQuestion id="escrow-number" label="Escrow Number" placeholder="ESC-0000000" />
            {/* question-group div:nth-child(24) */}
            <TextQuestion id="file-number" label="File Number" placeholder="FILE-0000000" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            data-test="btn-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-test="btn-submit"
          >
            Submit Signing Order
          </button>
        </div>
      </div>
    </>
  );
};

export default NgSelectDropdownPage;
