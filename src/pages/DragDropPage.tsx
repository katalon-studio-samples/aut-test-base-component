import React, { useState } from "react";
import { DragDropList } from "../components/DragDropList";

export const DragDropPage: React.FC = () => {
  const [items, setItems] = useState([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
  ]);

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Drag and Drop
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Practice drag and drop interactions. Try reordering the items below
        using both mouse and keyboard controls.
      </p>
      <DragDropList items={items} onReorder={setItems} />
    </div>
  );
};
