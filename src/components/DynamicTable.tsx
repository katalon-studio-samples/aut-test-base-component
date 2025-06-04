import React, { useState } from "react";
import type { TableData } from "../types";

interface DynamicTableProps {
  data: TableData[];
}

export const DynamicTable: React.FC<DynamicTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof TableData>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof TableData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <div className="overflow-x-auto -mx-4 sm:-mx-0" data-test="dynamic-table">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof TableData)}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  data-test={`table-header-${key}`}
                >
                  <div className="flex items-center">
                    <span className="mr-1">{key}</span>
                    {sortField === key && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((row) => (
              <tr
                key={row.id}
                data-test={`table-row-${row.id}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {Object.entries(row).map(([key, value]) => (
                  <td
                    key={key}
                    className="px-3 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300"
                    data-test={`table-cell-${key}-${row.id}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
