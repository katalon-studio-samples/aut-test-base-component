import React from 'react';
import {DynamicTableInput} from "../components/TableInput.tsx";


const mockData1 = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin', action: 'Add' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', role: 'User', action: 'Add' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', role: 'Editor', action: 'Delete' },
];

export const IframePageNested2Level: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white mt-8">Dynamic Tables Have Input</h1>
      <DynamicTableInput data={mockData1}/>
    </div>
  );
}; 