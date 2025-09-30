import React from "react";

export const NativeElementsPage: React.FC = () => {
  // Get current date in YYYY-MM-DD format for default values
  const today = new Date().toISOString().split("T")[0];
  // Calculate dates for min/max restrictions
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoStr = oneMonthAgo.toISOString().split("T")[0];

  const oneYearAhead = new Date();
  oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);
  const oneYearAheadStr = oneYearAhead.toISOString().split("T")[0];

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Native Elements Examples
      </h1>
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Input Native Elements
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This section showcases various native HTML input elements with
              different configurations and attributes.
            </p>

            {/* Date Inputs Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                Date Input Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic date input */}
                <div className="space-y-2">
                  <label
                    htmlFor="basic-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Basic Date Input
                  </label>
                  <input
                    type="date"
                    id="basic-date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    data-test="basic-date-input"
                  />
                </div>

                {/* Date with default value */}
                <div className="space-y-2">
                  <label
                    htmlFor="default-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Date Input with Default Value (Today)
                  </label>
                  <input
                    type="date"
                    id="default-date"
                    defaultValue={today}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    data-test="default-date-input"
                  />
                </div>

                {/* Date with min/max */}
                <div className="space-y-2">
                  <label
                    htmlFor="restricted-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Date Input with Range Restriction
                  </label>
                  <input
                    type="date"
                    id="restricted-date"
                    min={oneMonthAgoStr}
                    max={oneYearAheadStr}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    data-test="restricted-date-input"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Range: Last month to one year from now
                  </p>
                </div>

                {/* Required date */}
                <div className="space-y-2">
                  <label
                    htmlFor="required-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Required Date Input
                  </label>
                  <input
                    type="date"
                    id="required-date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    data-test="required-date-input"
                  />
                </div>

                {/* Datetime-local input */}
                <div className="space-y-2">
                  <label
                    htmlFor="datetime-local"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Date and Time Input
                  </label>
                  <input
                    type="datetime-local"
                    id="datetime-local"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    data-test="datetime-local-input"
                  />
                </div>

                {/* Week input */}
                <div className="space-y-2">
                  <label
                    htmlFor="week-input"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Week Selector
                  </label>
                  <input
                    type="week"
                    id="week-input"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    data-test="week-input"
                  />
                </div>

                {/* Month input */}
                <div className="space-y-2">
                  <label
                    htmlFor="month-input"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Month Selector
                  </label>
                  <input
                    type="month"
                    id="month-input"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    data-test="month-input"
                  />
                </div>

                {/* Disabled date input */}
                <div className="space-y-2">
                  <label
                    htmlFor="disabled-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Disabled Date Input
                  </label>
                  <input
                    type="date"
                    id="disabled-date"
                    disabled
                    defaultValue={today}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                    data-test="disabled-date-input"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
