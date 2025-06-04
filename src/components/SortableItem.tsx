import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
  id: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center p-4 bg-white dark:bg-gray-800 rounded shadow-sm"
      data-test={`sortable-item-${id}`}
    >
      <button
        className="mr-2 cursor-grab"
        {...attributes}
        {...listeners}
        data-test={`drag-handle-${id}`}
      >
        <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </button>
      <span className="text-gray-900 dark:text-white">{id}</span>
    </div>
  );
};
