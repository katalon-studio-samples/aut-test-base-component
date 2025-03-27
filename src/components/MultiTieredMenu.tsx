import React, { useState } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
}

interface MultiTieredMenuProps {
  items: MenuItem[];
}

const MultiTieredMenu: React.FC<MultiTieredMenuProps> = ({ items }) => {
  const [hoveredPath, setHoveredPath] = useState<string[]>([]);

  const handleMouseEnter = (itemId: string, level: number) => {
    // Keep all parent levels and add this new level
    setHoveredPath(prev => [...prev.slice(0, level), itemId]);
  };

  const handleMouseLeave = (level: number) => {
    // Remove this level and all deeper levels
    setHoveredPath(prev => prev.slice(0, level));
  };

  const handleClick = (item: MenuItem) => {
    if (!item.children || item.children.length === 0) {
      alert(`You clicked: ${item.label}`);
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
            flex items-center justify-between gap-1 whitespace-nowrap
            ${level === 0 
              ? 'h-14 px-4 text-gray-700 hover:text-blue-600 font-medium text-base' 
              : 'w-full px-4 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }
          `}
          onClick={() => handleClick(item)}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <svg
              className="w-4 h-4"
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
              absolute bg-white shadow-lg rounded-md py-2 min-w-[200px] z-10
              ${level === 0 ? 'left-0 top-[95%]' : 'left-[95%] top-0'}
            `}
          >
            <ul>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-stretch">
          {items.map(item => renderMenuItem(item))}
        </ul>
      </div>
    </nav>
  );
};

export default MultiTieredMenu; 