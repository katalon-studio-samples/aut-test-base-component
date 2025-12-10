import { useEffect, useMemo, useRef, useState } from "react";

interface CustomDropdownProps {
  id: string;
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const CustomDropdown = ({
  id,
  label,
  required,
  options,
  value,
  placeholder = "Select an option",
  onChange,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const randomSuffix = useMemo(
    () =>
      [
        Math.random().toString(36).slice(2),
        Math.random().toString(36).slice(2),
        Math.random().toString(36).slice(2),
      ].join("-"),
    [id, options.length],
  );

  const getOptionIds = (index: number) => {
    const base = `application-${id}-segment-${randomSuffix}-stack-${index + 1}`;
    const itemId = `__item${index + 1}-${base}-form-${randomSuffix}-select-${index + 1}`;
    const sapUiId = `${itemId}-sap-ui`;
    return { itemId, sapUiId };
  };

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={toggleDropdown}
          className="mt-1 w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? "" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <svg
            className="h-4 w-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <ul
          role="listbox"
          className={`absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {options.map((option, index) => {
            const optionId = `${id}-option-${index + 1}`;
            const { itemId, sapUiId } = getOptionIds(index);
            const isSelected = option === value;
            return (
              <li
                key={optionId}
                role="option"
                aria-selected={isSelected}
                aria-setsize={options.length}
                aria-posinset={index + 1}
                tabIndex={-1}
                id={itemId}
                data-sap-ui={sapUiId}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
              >
                {option}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const DropdownListPage = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("USA");
  const [gender, setGender] = useState("");
  const [citizenshipStatus, setCitizenshipStatus] = useState("");
  const [i9Status, setI9Status] = useState("I-9 Not on File");
  const [suffix, setSuffix] = useState("");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Home Address
        </h1>
        <div className="mt-2 h-[1px] w-full bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="card p-6 space-y-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Note:
          </div>
          <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
            For non-US addresses please contact Human Resources at 517-353-4434
            or 800-353-4434.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="address-line-1"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Address Line 1:
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="address-line-1"
              type="text"
              placeholder="11 Tardis"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="address-line-2"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Address Line 2:
            </label>
            <input
              id="address-line-2"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              City:
              <span className="text-red-500 ml-0.5">*</span>
            </div>
            <CustomDropdown
              id="city"
              label="City"
              required
              value={city}
              options={[
                "Los Angeles",
                "New York",
                "Boston",
                "San Francisco",
                "Seattle",
              ]}
              onChange={setCity}
              placeholder="Select a city"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              State:
              <span className="text-red-500 ml-0.5">*</span>
            </div>
            <CustomDropdown
              id="state"
              label="State"
              required
              value={state}
              options={["CA", "NY", "MA", "WA", "TX", "MI", "OH"]}
              onChange={setState}
              placeholder="Select a state"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="zip-code"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ZIP Code:
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="zip-code"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Country:
              <span className="text-red-500 ml-0.5">*</span>
            </div>
            <CustomDropdown
              id="country"
              label="Country"
              required
              value={country}
              options={["USA", "Canada", "United Kingdom", "Germany", "Japan"]}
              onChange={setCountry}
              placeholder="Select a country"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone:
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="phone"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (Format: 5173551234)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Restrict Address:
            </span>
            <input
              id="restrict-address"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Restrict Phone:
            </span>
            <input
              id="restrict-phone"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Legal Name
        </h2>
        <div className="mt-2 h-[1px] w-full bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="card p-6 space-y-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Note:
          </div>
          <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
            Legal Name exactly as it appears on Social Security Card.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Action:
            </span>
            <div className="mt-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
              Hire
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="effective-date"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Effective Date:
            </label>
            <input
              id="effective-date"
              type="text"
              placeholder="11/26/2025"
              className="mt-1 block w-full rounded-md border border-dashed border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="legal-first-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Legal First Name:
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="legal-first-name"
              type="text"
              className="mt-1 block w-full rounded-md border border-dashed border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="legal-middle-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Legal Middle name:
            </label>
            <input
              id="legal-middle-name"
              type="text"
              className="mt-1 block w-full rounded-md border border-dashed border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="legal-last-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Legal Last name:
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="legal-last-name"
              type="text"
              className="mt-1 block w-full rounded-md border border-dashed border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Legal Suffix:
            </div>
            <CustomDropdown
              id="legal-suffix"
              label="Legal Suffix"
              value={suffix}
              options={["Jr.", "Sr.", "II", "III", "IV", "PhD", "MD"]}
              onChange={setSuffix}
              placeholder="Select a suffix"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="zpid"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ZPID:
            </label>
            <input
              id="zpid"
              type="text"
              className="mt-1 block w-full rounded-md border border-dashed border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender:
              <span className="text-red-500 ml-0.5">*</span>
            </div>
            <CustomDropdown
              id="gender"
              label="Gender"
              required
              value={gender}
              options={["Female", "Male", "Non-binary", "Prefer not to say"]}
              onChange={setGender}
              placeholder="Select gender"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <label
              htmlFor="date-of-birth"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date of birth:
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="date-of-birth"
                type="text"
                placeholder="e.g. 12/31/2025"
                className="mt-1 block w-full rounded-md border border-dashed border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Citizenship Status:
              <span className="text-red-500 ml-0.5">*</span>
            </div>
            <CustomDropdown
              id="citizenship-status"
              label="Citizenship Status"
              required
              value={citizenshipStatus}
              options={[
                "U.S. Citizen",
                "Permanent Resident",
                "Work Visa",
                "Student Visa",
                "Other",
              ]}
              onChange={setCitizenshipStatus}
              placeholder="Select status"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:items-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              I-9 Status:
            </div>
            <CustomDropdown
              id="i9-status"
              label="I-9 Status"
              value={i9Status}
              options={[
                "I-9 Not on File",
                "I-9 Complete",
                "I-9 Expired",
                "Reverification Required",
              ]}
              onChange={setI9Status}
              placeholder="Select I-9 status"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownListPage;
