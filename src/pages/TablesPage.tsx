import React from "react";
import { DynamicTable } from "../components/DynamicTable";
import { DynamicTableInput } from "../components/TableInput";

const mockData = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    role: "Admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Inactive",
    role: "User",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Active",
    role: "Editor",
  },
];

const mockData1 = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    role: "Admin",
    action: "Add",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Inactive",
    role: "User",
    action: "Add",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Active",
    role: "Editor",
    action: "Delete",
  },
];

const mockData2 = [
  {
    __: "1",
    3000: "John Doe",
    true: "john@example.com",
    0.123: "Active",
    role: "Admin",
  },
  {
    __: "2",
    3000: "Jane Smith",
    true: "jane@example.com",
    0.123: "Inactive",
    role: "User",
  },
  {
    __: "3",
    3000: "Bob Johnson",
    true: "bob@example.com",
    0.123: "Active",
    role: "Editor",
  },
];


export const TablesPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Dynamic Tables
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Practice working with sortable tables, data grids, and dynamic content.
        Click on column headers to sort the data.
      </p>
      <DynamicTable data={mockData} />
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white mt-8">
        Dynamic Tables Have Input
      </h1>
      <DynamicTableInput data={mockData1} />
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white mt-3.5">
        Dynamic Tables V2
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Practice working with sortable tables, data grids, and dynamic content.
        Click on column headers to sort the data.
      </p>
      <DynamicTable data={mockData2} />
    </div>
  );
};
