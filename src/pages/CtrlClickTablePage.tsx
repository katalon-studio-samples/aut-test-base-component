import React, { useState } from "react";

// --- Table 1 data ---
const tableData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  department: ["Engineering", "Marketing", "Sales", "HR", "Finance"][i % 5],
  status: i % 3 === 0 ? "Inactive" : "Active",
}));

// --- Table 2 data ---
type Product = {
  id: number;
  product: string;
  category: string;
  price: string;
  stock: string;
};

const categories = ["Electronics", "Clothing", "Books", "Food", "Tools"];
const initialTable2Data: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  product: `Product ${i + 1}`,
  category: categories[i % 5],
  price: ((i + 1) * 4.99).toFixed(2),
  stock: String((i % 4) * 10 + 5),
}));

export const CtrlClickTablePage: React.FC = () => {
  // --- Table 1 state ---
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleRowClick = (e: React.MouseEvent, id: number) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // --- Table 2 state ---
  const [table2Data, setTable2Data] = useState<Product[]>(initialTable2Data);
  const [selectedIds2, setSelectedIds2] = useState<Set<number>>(new Set());
  const [editingRow, setEditingRow] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState<Product | null>(null);

  const handleRow2Click = (e: React.MouseEvent, id: number) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds2((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    } else {
      setSelectedIds2(new Set([id]));
    }
  };

  const handleRow2DblClick = (row: Product) => {
    setEditingRow(row);
    setFormValues({ ...row });
  };

  const handleModalSave = () => {
    if (!formValues) return;
    setTable2Data((prev) =>
      prev.map((r) => (r.id === formValues.id ? { ...formValues } : r)),
    );
    setEditingRow(null);
    setFormValues(null);
  };

  const handleModalClose = () => {
    setEditingRow(null);
    setFormValues(null);
  };

  const handleFormChange = (field: keyof Product, value: string) => {
    setFormValues((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* ===== TABLE 1 ===== */}
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Ctrl+Click Row Selection
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Click a row to select it. Hold{" "}
        <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
          Ctrl
        </kbd>{" "}
        (or{" "}
        <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
          ⌘
        </kbd>
        ) and click to select multiple rows.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <span
          className="text-sm text-gray-600 dark:text-gray-300"
          data-test="selected-count"
        >
          {selectedIds.size === 0
            ? "No rows selected"
            : `${selectedIds.size} row${selectedIds.size > 1 ? "s" : ""} selected`}
        </span>
        {selectedIds.size > 0 && (
          <button
            onClick={clearSelection}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            data-test="clear-selection-btn"
          >
            Clear selection
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table
          className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          data-test="ctrl-click-table"
        >
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tableData.map((row) => {
              const isSelected = selectedIds.has(row.id);
              return (
                <tr
                  key={row.id}
                  onClick={(e) => handleRowClick(e, row.id)}
                  className={`cursor-pointer select-none transition-colors ${
                    isSelected
                      ? "bg-blue-100 dark:bg-blue-900/50"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  data-test={`table-row-${row.id}`}
                  aria-selected={isSelected}
                >
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {row.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {row.department}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                      data-test={`status-${row.id}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedIds.size > 0 && (
        <div
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300"
          data-test="selected-rows-summary"
        >
          Selected row IDs:{" "}
          <span data-test="selected-ids">
            {Array.from(selectedIds)
              .sort((a, b) => a - b)
              .join(", ")}
          </span>
        </div>
      )}

      {/* ===== TABLE 2 ===== */}
      <h2 className="text-2xl font-bold mt-12 mb-2 text-gray-900 dark:text-white">
        Ctrl+Click &amp; Double-Click to Edit
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Hold{" "}
        <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
          Ctrl
        </kbd>{" "}
        and click to select multiple rows.{" "}
        <strong className="text-gray-700 dark:text-gray-200">
          Double-click
        </strong>{" "}
        any row to open its edit form.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <span
          className="text-sm text-gray-600 dark:text-gray-300"
          data-test="table2-selected-count"
        >
          {selectedIds2.size === 0
            ? "No rows selected"
            : `${selectedIds2.size} row${selectedIds2.size > 1 ? "s" : ""} selected`}
        </span>
        {selectedIds2.size > 0 && (
          <button
            onClick={() => setSelectedIds2(new Set())}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            data-test="table2-clear-selection-btn"
          >
            Clear selection
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table
          className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          data-test="ctrl-dblclick-table"
        >
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price ($)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table2Data.map((row) => {
              const isSelected = selectedIds2.has(row.id);
              return (
                <tr
                  key={row.id}
                  onClick={(e) => handleRow2Click(e, row.id)}
                  onDoubleClick={() => handleRow2DblClick(row)}
                  className={`cursor-pointer select-none transition-colors ${
                    isSelected
                      ? "bg-blue-100 dark:bg-blue-900/50"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  data-test={`table2-row-${row.id}`}
                  aria-selected={isSelected}
                >
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {row.product}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {row.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {row.price}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {row.stock}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedIds2.size > 0 && (
        <div
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300"
          data-test="table2-selected-rows-summary"
        >
          Selected row IDs:{" "}
          <span data-test="table2-selected-ids">
            {Array.from(selectedIds2)
              .sort((a, b) => a - b)
              .join(", ")}
          </span>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editingRow && formValues && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={handleModalClose}
          data-test="row-edit-modal-overlay"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
            data-test="row-edit-modal"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
              Edit Row #{editingRow.id}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product
                </label>
                <input
                  type="text"
                  value={formValues.product}
                  onChange={(e) => handleFormChange("product", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-test="modal-field-product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formValues.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-test="modal-field-category"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="text"
                  value={formValues.price}
                  onChange={(e) => handleFormChange("price", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-test="modal-field-price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock
                </label>
                <input
                  type="text"
                  value={formValues.stock}
                  onChange={(e) => handleFormChange("stock", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-test="modal-field-stock"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                data-test="modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                data-test="modal-save-btn"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
