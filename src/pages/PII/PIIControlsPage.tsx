import React, { useMemo, useState } from "react";

interface PiiRecord {
  id: string;
  name: string;
  ssn: string;
  email: string;
  phone: string;
  address: string;
  account: string;
  card: string;
  passport: string;
}

const piiRecords: PiiRecord[] = [
  {
    id: "maya",
    name: "Maya Chen",
    ssn: "123-45-6789",
    email: "maya.chen@example.com",
    phone: "+1 (415) 555-0148",
    address: "742 Pine Street, San Francisco, CA 94108",
    account: "US00-0001-2345-6789",
    card: "4111 1111 1111 1111",
    passport: "X1234567",
  },
  {
    id: "iris",
    name: "Iris Patel",
    ssn: "987-65-4321",
    email: "iris.patel@example.net",
    phone: "+1 (212) 555-0199",
    address: "18 Hudson Yard, New York, NY 10001",
    account: "US00-0009-8765-4321",
    card: "5555 4444 3333 2222",
    passport: "P7654321",
  },
  {
    id: "noah",
    name: "Noah Brooks",
    ssn: "246-80-1357",
    email: "noah.brooks@example.org",
    phone: "+1 (206) 555-0175",
    address: "300 Lakeview Ave, Seattle, WA 98101",
    account: "US00-0024-6801-3579",
    card: "3782 822463 10005",
    passport: "N2468013",
  },
];

const piiCheckboxes = [
  {
    id: "email-consent",
    label: "Email consent for maya.chen@example.com",
    value: "maya.chen@example.com",
  },
  {
    id: "dob-verification",
    label: "DOB verification: 1985-04-12",
    value: "1985-04-12",
  },
  {
    id: "tax-retention",
    label: "Retain tax ID 98-7654321",
    value: "98-7654321",
  },
];

const piiRadioOptions = [
  "Primary phone +1 (415) 555-0148",
  "Backup phone +1 (212) 555-0199",
  "Emergency phone +1 (206) 555-0175",
];

const mixedContactOptions = [
  {
    id: "email-only",
    label: "maya.chen@example.com",
    value: "maya.chen@example.com",
  },
  {
    id: "phone-name",
    label: "Iris Patel | +1 (212) 555-0199",
    value: "+1 (212) 555-0199",
  },
  {
    id: "phone-email",
    label: "+1 (206) 555-0175 | noah.brooks@example.org",
    value: "+1 (206) 555-0175",
  },
];

export const PIIControlsPage: React.FC = () => {
  const [nativeSelection, setNativeSelection] = useState(piiRecords[0].id);
  const [emailSelection, setEmailSelection] = useState(piiRecords[0].email);
  const [customDropdownOpen, setCustomDropdownOpen] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [mixedContactDropdownOpen, setMixedContactDropdownOpen] =
    useState(false);
  const [customSelection, setCustomSelection] = useState(piiRecords[1]);
  const [phoneSelection, setPhoneSelection] = useState(piiRecords[2]);
  const [mixedContactSelection, setMixedContactSelection] = useState(
    mixedContactOptions[0],
  );
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState(piiRadioOptions[0]);
  const [lastAction, setLastAction] = useState("No PII action selected");

  const nativeRecord = useMemo(
    () => piiRecords.find((record) => record.id === nativeSelection),
    [nativeSelection],
  );

  const toggleCheckedValue = (value: string) => {
    setCheckedValues((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          data-test="pii-controls-heading"
        >
          PII Controls
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Synthetic personal data distributed across selectable controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Native Dropdown
          </h2>
          <label
            htmlFor="native-pii-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select customer identity
          </label>
          <select
            id="native-pii-select"
            data-test="native-pii-select"
            value={nativeSelection}
            onChange={(event) => setNativeSelection(event.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100"
          >
            {piiRecords.map((record) => (
              <option
                key={record.id}
                value={record.id}
                data-test={`native-pii-option-${record.id}`}
              >
                {record.name} | SSN {record.ssn} | Card {record.card}
              </option>
            ))}
          </select>
          <div
            className="mt-4 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-200"
            data-test="native-pii-selection"
          >
            Selected: {nativeRecord?.name} - Passport {nativeRecord?.passport}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Normal Dropdown
          </h2>
          <div className="relative">
            <button
              type="button"
              data-test="custom-pii-dropdown-button"
              aria-haspopup="listbox"
              aria-expanded={customDropdownOpen}
              onClick={() => setCustomDropdownOpen((open) => !open)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-left text-gray-900 dark:text-gray-100"
            >
              {customSelection.name} - {customSelection.email}
            </button>
            {customDropdownOpen && (
              <ul
                role="listbox"
                data-test="custom-pii-dropdown-list"
                className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg"
              >
                {piiRecords.map((record) => (
                  <li key={record.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={customSelection.id === record.id}
                      data-test={`custom-pii-option-${record.id}`}
                      onClick={() => {
                        setCustomSelection(record);
                        setCustomDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                    >
                      {record.email} | {record.phone} | {record.address}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className="mt-4 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-200"
            data-test="custom-pii-selection"
          >
            Selected: {customSelection.account}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Email Dropdown
          </h2>
          <label
            htmlFor="email-pii-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select recovery email
          </label>
          <select
            id="email-pii-select"
            data-test="email-pii-select"
            value={emailSelection}
            onChange={(event) => setEmailSelection(event.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100"
          >
            {piiRecords.map((record) => (
              <option
                key={record.email}
                value={record.email}
                data-test={`email-pii-option-${record.id}`}
              >
                {record.email}
              </option>
            ))}
          </select>
          <div
            className="mt-4 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-200"
            data-test="email-pii-selection"
          >
            Selected email: {emailSelection}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phone Number Dropdown
          </h2>
          <div className="relative">
            <button
              type="button"
              data-test="phone-pii-dropdown-button"
              aria-haspopup="listbox"
              aria-expanded={phoneDropdownOpen}
              onClick={() => setPhoneDropdownOpen((open) => !open)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-left text-gray-900 dark:text-gray-100"
            >
              {phoneSelection.name} - {phoneSelection.phone}
            </button>
            {phoneDropdownOpen && (
              <ul
                role="listbox"
                data-test="phone-pii-dropdown-list"
                className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg"
              >
                {piiRecords.map((record) => (
                  <li key={record.phone}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={phoneSelection.id === record.id}
                      data-test={`phone-pii-option-${record.id}`}
                      onClick={() => {
                        setPhoneSelection(record);
                        setPhoneDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                    >
                      {record.phone} | {record.name} | {record.email}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className="mt-4 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-200"
            data-test="phone-pii-selection"
          >
            Selected phone: {phoneSelection.phone}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mixed Contact Dropdown
          </h2>
          <div className="relative">
            <button
              type="button"
              data-test="mixed-contact-dropdown-button"
              aria-haspopup="listbox"
              aria-expanded={mixedContactDropdownOpen}
              onClick={() => setMixedContactDropdownOpen((open) => !open)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-left text-gray-900 dark:text-gray-100"
            >
              {mixedContactSelection.label}
            </button>
            {mixedContactDropdownOpen && (
              <ul
                role="listbox"
                data-test="mixed-contact-dropdown-list"
                className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg"
              >
                {mixedContactOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={mixedContactSelection.id === option.id}
                      data-test={`mixed-contact-option-${option.id}`}
                      onClick={() => {
                        setMixedContactSelection(option);
                        setMixedContactDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className="mt-4 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-200"
            data-test="mixed-contact-selection"
          >
            Selected mixed contact: {mixedContactSelection.value}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Buttons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {piiRecords.map((record) => (
              <button
                key={record.id}
                type="button"
                data-test={`pii-action-button-${record.id}`}
                onClick={() =>
                  setLastAction(
                    `Action queued for ${record.name}: ${record.phone}`,
                  )
                }
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Send OTP to {record.phone}
              </button>
            ))}
          </div>
          <div
            className="mt-4 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-200"
            data-test="pii-button-result"
          >
            {lastAction}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Checkbox and Radio
          </h2>
          <div className="space-y-3">
            {piiCheckboxes.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 text-sm text-gray-800 dark:text-gray-100"
              >
                <input
                  type="checkbox"
                  data-test={`pii-checkbox-${item.id}`}
                  value={item.value}
                  checked={checkedValues.includes(item.value)}
                  onChange={() => toggleCheckedValue(item.value)}
                  className="mt-1"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>

          <fieldset className="mt-5 space-y-3">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact preference
            </legend>
            {piiRadioOptions.map((option) => (
              <label
                key={option}
                className="flex items-start gap-3 text-sm text-gray-800 dark:text-gray-100"
              >
                <input
                  type="radio"
                  name="pii-contact-preference"
                  data-test={`pii-radio-${option.split(" ")[0].toLowerCase()}`}
                  value={option}
                  checked={radioValue === option}
                  onChange={(event) => setRadioValue(event.target.value)}
                  className="mt-1"
                />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
        </section>
      </div>

      <section className="mt-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Control State
        </h2>
        <pre
          className="overflow-auto rounded-md bg-gray-950 p-4 text-sm text-gray-100"
          data-test="pii-control-state"
        >
          {JSON.stringify(
            {
              nativeSelection: nativeRecord,
              emailSelection,
              customSelection,
              phoneSelection,
              mixedContactSelection,
              checkedValues,
              radioValue,
              lastAction,
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
};
