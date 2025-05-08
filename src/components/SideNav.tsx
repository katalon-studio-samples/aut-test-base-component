import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    category: 'Basic',
    items: [
      { path: '/about', label: 'About' },
      { path: '/forms', label: 'Forms' },
      { path: '/tables', label: 'Tables' },
    ]
  },
  {
    category: 'Interaction',
    items: [
      { path: '/drag-drop', label: 'Drag & Drop' },
      { path: '/dynamic-elements', label: 'Dynamic Elements' },
      { path: '/hover', label: 'Hover States' },
      { path: '/key-press', label: 'Key Press' },
      { path: '/slider', label: 'Slider' },
    ]
  },
  {
    category: 'Content',
    items: [
      { path: '/file-upload', label: 'File Upload' },
      { path: '/file-download', label: 'File Download' },
      { path: '/iframes', label: 'Iframes' },
      { path: '/broken-images', label: 'Broken Images' },
      { path: '/shadow-dom', label: 'Shadow DOM' },
    ]
  },
  {
    category: 'Advanced',
    items: [
      { path: '/context-menu', label: 'Context Menu' },
      { path: '/multi-tiered-menu', label: 'Multi Tiered Menu' },
      { path: '/notifications', label: 'Notifications' },
      { path: '/ab-testing', label: 'A/B Testing' },
      { path: '/auth', label: 'Authentication' },
      { path: '/checkboxes', label: 'Checkboxes' },
      { path: '/exit-intent', label: 'Exit Intent' },
      { path: '/alerts', label: 'Alerts' },
      { path: '/open-popup', label: 'Open Popup' },
    ]
  }
];

export const SideNav: React.FC<SideNavProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow-lg h-screen overflow-y-auto transition-all duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:translate-x-0 md:sticky top-0 left-0 w-64`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          data-test="home-link"
          onClick={handleLinkClick}
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold">Home</span>
        </Link>
      </div>
      
      <nav className="p-4">
        {menuItems.map((category) => (
          <div key={category.category} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {category.category}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                      location.pathname === item.path
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    data-test={`nav-${item.path.slice(1)}`}
                    onClick={handleLinkClick}
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};