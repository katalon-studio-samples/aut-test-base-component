import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export interface MenuItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  children?: MenuItem[];
}

interface MultiTieredMenuProps {
  items: MenuItem[];
}

const MultiTieredMenu: React.FC<MultiTieredMenuProps> = ({ items }) => {
  const [hoveredPath, setHoveredPath] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [clickedItemLabel, setClickedItemLabel] = useState<string | null>(null);

  const handleMouseEnter = (itemId: string, level: number) => {
    // Keep all parent levels and add this new level
    setHoveredPath((prev) => [...prev.slice(0, level), itemId]);
  };

  const handleMouseLeave = (level: number) => {
    // Remove this level and all deeper levels
    setHoveredPath((prev) => prev.slice(0, level));
  };

  const handleClick = (item: MenuItem) => {
    if (!item.children || item.children.length === 0) {
      setClickedItemLabel(item.label);
      setOpen(true);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isInPath = hoveredPath[level] === item.id;
    const shouldShowChildren = isInPath && hasChildren;

    return (
      <li
        key={item.id}
        className="relative"
        onMouseEnter={() => handleMouseEnter(item.id, level)}
        onMouseLeave={() => handleMouseLeave(level)}
      >
        <button
          className={`
            flex w-full items-center justify-between gap-2
            ${
              level === 0
                ? "min-h-14 px-4 py-3 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-300 font-medium text-base"
                : "px-4 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-blue-300 dark:hover:bg-gray-700"
            }
          `}
          onClick={() => handleClick(item)}
          data-test={`multi-tier-menu-item-${item.id}`}
        >
          <span className="flex-1 text-left leading-tight">
            {item.content ?? item.label}
          </span>
          {hasChildren && (
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={level === 0 ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          )}
        </button>
        {shouldShowChildren && item.children && (
          <div
            className={`
              absolute bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 min-w-[200px] z-10
              ${level === 0 ? "left-0 top-[95%]" : "left-[95%] top-0"}
            `}
          >
            <ul>
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-stretch">
            {items.map((item) => renderMenuItem(item))}
          </ul>
        </div>
      </nav>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              ".dark &": { backgroundColor: "#1f2937", color: "#f9fafb" },
            },
          },
        }}
      >
        <DialogTitle>Item Clicked</DialogTitle>
        <DialogContent>
          <p>You clicked: {clickedItemLabel}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MultiTieredMenu;
