import React from "react";
import { Link } from "react-router-dom";
import {
  FormInput,
  Table,
  GripHorizontal,
  Loader,
  Upload,
  Frame,
  MousePointer2,
  Bell,
  SplitSquareHorizontal,
  KeyRound,
  Image,
  CheckSquare,
  LogOut,
  Sliders,
  AlertCircle,
  Keyboard,
  Box,
  Download,
  Info,
} from "lucide-react";

const categories = [
  {
    name: "Basic",
    items: [
      {
        title: "About",
        path: "/about",
        description: "Learn more about Test Automation platform",
        icon: <Info className="w-6 h-6" />,
      },
      {
        title: "Forms",
        path: "/forms",
        description: "Practice form interactions and validation",
        icon: <FormInput className="w-6 h-6" />,
      },
      {
        title: "Tables",
        path: "/tables",
        description: "Work with sortable tables and dynamic data",
        icon: <Table className="w-6 h-6" />,
      },
    ],
  },
  {
    name: "Interaction",
    items: [
      {
        title: "Drag & Drop",
        path: "/drag-drop",
        description: "Practice drag and drop interactions",
        icon: <GripHorizontal className="w-6 h-6" />,
      },
      {
        title: "Dynamic Elements",
        path: "/dynamic-elements",
        description: "Handle elements that change over time",
        icon: <Loader className="w-6 h-6" />,
      },
      {
        title: "Hover States",
        path: "/hover",
        description: "Test hover interactions and states",
        icon: <MousePointer2 className="w-6 h-6" />,
      },
      {
        title: "Key Press",
        path: "/key-press",
        description: "Capture and validate keyboard inputs",
        icon: <Keyboard className="w-6 h-6" />,
      },
      {
        title: "Slider",
        path: "/slider",
        description: "Test slider interactions and values",
        icon: <Sliders className="w-6 h-6" />,
      },
    ],
  },
  {
    name: "Content",
    items: [
      {
        title: "File Upload",
        path: "/file-upload",
        description: "Test file upload capabilities",
        icon: <Upload className="w-6 h-6" />,
      },
      {
        title: "File Download",
        path: "/file-download",
        description: "Handle file download scenarios",
        icon: <Download className="w-6 h-6" />,
      },
      {
        title: "Iframes",
        path: "/iframes",
        description: "Work with iframe content and interactions",
        icon: <Frame className="w-6 h-6" />,
      },
      {
        title: "Broken Images",
        path: "/broken-images",
        description: "Handle broken image scenarios",
        icon: <Image className="w-6 h-6" />,
      },
      {
        title: "Shadow DOM",
        path: "/shadow-dom",
        description: "Work with Shadow DOM elements",
        icon: <Box className="w-6 h-6" />,
      },
    ],
  },
  {
    name: "Advanced",
    items: [
      {
        title: "Context Menu",
        path: "/context-menu",
        description: "Handle right-click context menus",
        icon: <MousePointer2 className="w-6 h-6" />,
      },
      {
        title: "Multi Tiered Menu",
        path: "/multi-tiered-menu",
        description: "Handle right-click context menus",
        icon: <MousePointer2 className="w-6 h-6" />,
      },
      {
        title: "Notifications",
        path: "/notifications",
        description: "Test notification systems",
        icon: <Bell className="w-6 h-6" />,
      },
      {
        title: "A/B Testing",
        path: "/ab-testing",
        description: "Work with A/B testing scenarios",
        icon: <SplitSquareHorizontal className="w-6 h-6" />,
      },
      {
        title: "Authentication",
        path: "/auth",
        description: "Test authentication flows",
        icon: <KeyRound className="w-6 h-6" />,
      },
      {
        title: "Checkboxes",
        path: "/checkboxes",
        description: "Handle checkbox interactions",
        icon: <CheckSquare className="w-6 h-6" />,
      },
      {
        title: "Exit Intent",
        path: "/exit-intent",
        description: "Detect user exit intent",
        icon: <LogOut className="w-6 h-6" />,
      },
      {
        title: "Alerts",
        path: "/alerts",
        description: "Work with different alert types",
        icon: <AlertCircle className="w-6 h-6" />,
      },
    ],
  },
];

export const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-12 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Test Automation Practice (Web and Mobile Web)
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A comprehensive platform for practicing test automation scenarios.
          Choose from various challenges below to enhance your testing skills.
        </p>
      </div>

      <div className="space-y-8 md:space-y-12 px-4">
        {categories.map((category) => (
          <div key={category.name} className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {category.items.map(({ title, path, description, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="group block p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                  data-test={`feature-card-${path.slice(1)}`}
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      {React.cloneElement(icon, {
                        className: `w-5 h-5 md:w-6 md:h-6 text-blue-500 dark:text-blue-400`,
                      })}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                        {description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
