import React, { useState } from "react";

interface Checkbox {
  id: string;
  label: string;
  checked: boolean;
}

export const CheckboxesPage: React.FC = () => {
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([
    { id: "checkbox1", label: "Checkbox 1", checked: false },
    { id: "checkbox2", label: "Checkbox 2", checked: true },
    { id: "checkbox3", label: "Checkbox 3", checked: false },
  ]);

  const handleCheckboxChange = (id: string) => {
    setCheckboxes(
      checkboxes.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox,
      ),
    );
  };

  const handleCheckAll = () => {
    setCheckboxes(
      checkboxes.map((checkbox) => ({
        ...checkbox,
        checked: true,
      })),
    );
  };

  const handleUncheckAll = () => {
    setCheckboxes(
      checkboxes.map((checkbox) => ({
        ...checkbox,
        checked: false,
      })),
    );
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Checkboxes
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="space-y-4" data-test="checkbox-group">
          {checkboxes.map(({ id, label, checked }) => (
            <label
              key={id}
              className="flex items-center space-x-2 cursor-pointer"
              data-test={`checkbox-label-${id}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange(id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-blue-600"
                data-test={`checkbox-${id}`}
              />
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 space-x-4">
          <button
            onClick={handleCheckAll}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            data-test="check-all-button"
          >
            Check All
          </button>
          <button
            onClick={handleUncheckAll}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            data-test="uncheck-all-button"
          >
            Uncheck All
          </button>
        </div>
      </div>
    </div>
  );
};
