import React, { useState, useMemo, useEffect } from "react";
import sampleData from "./sample.json";

type Item = { [key: string]: unknown };

export const CardListPage: React.FC = () => {
  const items: Item[] = Array.isArray(sampleData) ? sampleData : [];
  const [selected, setSelected] = useState<{ idx: number; key: string } | null>(null);
  const [filterKey, setFilterKey] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [filterKey2, setFilterKey2] = useState<string>("");
  const [filterValue2, setFilterValue2] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const allKeys = useMemo(() => {
    const keys = new Set<string>();
    items.forEach(item => Object.keys(item).forEach(k => keys.add(k)));
    return Array.from(keys);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const cond1 =
        !filterKey || !filterValue
          ? true
          : String(item[filterKey] ?? "")
              .toLowerCase()
              .includes(filterValue.toLowerCase());
      const cond2 =
        !filterKey2 || !filterValue2
          ? true
          : String(item[filterKey2] ?? "")
              .toLowerCase()
              .includes(filterValue2.toLowerCase());
      return cond1 && cond2;
    });
  }, [items, filterKey, filterValue, filterKey2, filterValue2]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey, filterValue, filterKey2, filterValue2, pageSize]);

  const handleClearFilters = () => {
    setFilterKey("");
    setFilterValue("");
    setFilterKey2("");
    setFilterValue2("");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Business Cards (All Attributes)</h1>
      <div className="flex items-center gap-4 mb-6">
        <select
          className="border rounded px-2 py-1"
          value={filterKey}
          onChange={e => setFilterKey(e.target.value)}
        >
          <option value="">Select attribute</option>
          {allKeys.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1"
          type="text"
          placeholder="Search value"
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
        />
        <span className="mx-2 text-gray-500">AND</span>
        <select
          className="border rounded px-2 py-1"
          value={filterKey2}
          onChange={e => setFilterKey2(e.target.value)}
        >
          <option value="">Select attribute</option>
          {allKeys.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1"
          type="text"
          placeholder="Search value"
          value={filterValue2}
          onChange={e => setFilterValue2(e.target.value)}
        />
        <button
          className="ml-4 px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
        <input
            className="border rounded px-2 py-1 bg-gray-100 w-32"
            type="text"
            readOnly
            value={`Total: ${filteredItems.length}`}
        />
        <label className="ml-4">
          Page size:&nbsp;
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100, 200, 500].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-6">
        {pagedItems.map((item, idx) => (
          <div
            key={idx + (currentPage - 1) * pageSize}
            className="bg-white shadow rounded p-6 w-80 border break-words"
          >
            {Object.entries(item).map(([key, value]) => (
              <div
                key={key}
                className={`py-1 px-2 rounded cursor-pointer transition ${
                  selected && selected.idx === idx + (currentPage - 1) * pageSize && selected.key === key
                    ? "bg-blue-100"
                    : ""
                }`}
                onClick={() => setSelected({ idx: idx + (currentPage - 1) * pageSize, key })}
              >
                <span className="font-semibold text-purple-700">{key}:</span>{" "}
                <span className="text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};