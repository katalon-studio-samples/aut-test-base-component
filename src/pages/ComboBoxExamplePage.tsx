import React, { useState, useRef } from "react";

const options = [
  { value: "site-1", label: "Site 1" },
  { value: "site-2", label: "Site 2" },
  { value: "site-3", label: "Site 3" },
  { value: "region-4", label: "Region 4" },
  { value: "region-5", label: "Region 5" },
  { value: "region-6", label: "Region 6" },
];

const formTypeOptions = [
  { value: "user-profile", label: "User Profile Form" },
  { value: "contact-info", label: "Contact Information Form" },
  { value: "billing-details", label: "Billing Details Form" },
  { value: "preferences", label: "User Preferences Form" },
  { value: "security-settings", label: "Security Settings Form" },
];

// Form components that will be dynamically loaded
const UserProfileForm = () => (
  <div className="p-4 border rounded bg-blue-50">
    <h3 className="font-semibold mb-3">User Profile Form</h3>
    <div className="space-y-3">
      <input
        type="text"
        placeholder="First Name"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Last Name"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Bio"
        className="w-full p-2 border rounded h-20"
      ></textarea>
    </div>
  </div>
);

const ContactInfoForm = () => (
  <div className="p-4 border rounded bg-green-50">
    <h3 className="font-semibold mb-3">Contact Information Form</h3>
    <div className="space-y-3">
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Address"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="City"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Postal Code"
        className="w-full p-2 border rounded"
      />
    </div>
  </div>
);

const BillingDetailsForm = () => (
  <div className="p-4 border rounded bg-yellow-50">
    <h3 className="font-semibold mb-3">Billing Details Form</h3>
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Card Number"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Cardholder Name"
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="MM/YY"
          className="w-1/2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="CVV"
          className="w-1/2 p-2 border rounded"
        />
      </div>
    </div>
  </div>
);

const PreferencesForm = () => (
  <div className="p-4 border rounded bg-purple-50">
    <h3 className="font-semibold mb-3">User Preferences Form</h3>
    <div className="space-y-3">
      <select className="w-full p-2 border rounded">
        <option>Select Language</option>
        <option>English</option>
        <option>Spanish</option>
        <option>French</option>
      </select>
      <select className="w-full p-2 border rounded">
        <option>Select Theme</option>
        <option>Light</option>
        <option>Dark</option>
        <option>Auto</option>
      </select>
      <label className="flex items-center">
        <input type="checkbox" className="mr-2" />
        Enable notifications
      </label>
    </div>
  </div>
);

const SecuritySettingsForm = () => (
  <div className="p-4 border rounded bg-red-50">
    <h3 className="font-semibold mb-3">Security Settings Form</h3>
    <div className="space-y-3">
      <input
        type="password"
        placeholder="Current Password"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        className="w-full p-2 border rounded"
      />
      <label className="flex items-center">
        <input type="checkbox" className="mr-2" />
        Enable two-factor authentication
      </label>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

// Loading Form Placeholder
const LoadingFormPlaceholder = ({ formType }: { formType: string }) => {
  const getFormLabel = (type: string) => {
    const option = formTypeOptions.find((opt) => opt.value === type);
    return option ? option.label : "Form";
  };

  return (
    <div className="p-4 border rounded bg-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Loading {getFormLabel(formType)}...</h3>
        <LoadingSpinner />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export const ComboBoxExamplePage: React.FC = () => {
  // State for native select elements
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [selectedFormType, setSelectedFormType] = useState<string>("");
  const [loadedForms, setLoadedForms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingFormType, setLoadingFormType] = useState<string>("");

  // Track if change was triggered by user click
  const isUserTriggered = useRef<boolean>(false);

  // Handle form selection and loading with delay
  const handleFormSelection = async (formType: string) => {
    if (formType && !loadedForms.includes(formType)) {
      setIsLoading(true);
      setLoadingFormType(formType);

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLoadedForms((prev) => [...prev, formType]);
      setIsLoading(false);
      setLoadingFormType("");
    }
  };

  // Handle select change - only trigger form loading if user clicked
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedFormType(newValue);

    // Only trigger form loading if this was a user-initiated change
    if (isUserTriggered.current && newValue) {
      handleFormSelection(newValue);
    }

    // Reset the flag
    isUserTriggered.current = false;
  };

  // Handle mouse down to track user interaction
  const handleMouseDown = () => {
    isUserTriggered.current = true;
  };

  // Handle keyboard interaction (Enter/Space)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      isUserTriggered.current = true;
    }
  };

  // Render the appropriate form component
  const renderForm = (formType: string) => {
    switch (formType) {
      case "user-profile":
        return <UserProfileForm key={formType} />;
      case "contact-info":
        return <ContactInfoForm key={formType} />;
      case "billing-details":
        return <BillingDetailsForm key={formType} />;
      case "preferences":
        return <PreferencesForm key={formType} />;
      case "security-settings":
        return <SecuritySettingsForm key={formType} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Native Combobox Example with Dynamic Forms
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* First Native Select - Site Selection */}
        <div>
          <label
            htmlFor="site-select"
            className="block text-sm font-medium mb-2"
          >
            Site Selection
          </label>
          <select
            id="site-select"
            data-testid="subject-details-modal-site-input"
            className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="">Select Site ID</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Second Native Select - Form Type Selection */}
        <div>
          <label
            htmlFor="form-select"
            className="block text-sm font-medium mb-2"
          >
            Form Type Selection
          </label>
          <div className="relative">
            <select
              id="form-select"
              data-testid="form-type-input"
              className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              value={selectedFormType}
              onChange={handleSelectChange}
              onMouseDown={handleMouseDown}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            >
              <option value="">Select Form Type</option>
              {formTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isLoading && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Forms Section */}
      {(loadedForms.length > 0 || isLoading) && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Loaded Forms</h3>
          <div className="space-y-4">
            {/* Show loading placeholder if currently loading */}
            {isLoading && loadingFormType && (
              <div className="relative">
                <LoadingFormPlaceholder formType={loadingFormType} />
              </div>
            )}

            {/* Show loaded forms */}
            {loadedForms.map((formType) => (
              <div key={formType} className="relative">
                <button
                  onClick={() =>
                    setLoadedForms((prev) => prev.filter((f) => f !== formType))
                  }
                  className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  title="Remove form"
                >
                  ×
                </button>
                {renderForm(formType)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold mb-2">Instructions:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Use the first combobox to select a site ID</li>
          <li>
            • <strong>Click</strong> on the second combobox to select and load
            different form types
          </li>
          <li>
            • Forms will only load when you physically click/select an option
            (not from programmatic changes)
          </li>
          <li>
            • Each form has a 1.5 second loading delay with a loading indicator
          </li>
          <li>
            • The combobox is disabled during loading to prevent multiple
            simultaneous loads
          </li>
          <li>• Click the × button to remove loaded forms</li>
          <li>• You can load multiple forms of different types</li>
        </ul>
      </div>
    </div>
  );
};
