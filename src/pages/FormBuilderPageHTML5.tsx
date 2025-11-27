import React, { useState, useEffect } from "react";
import {
  GripVertical,
  Type,
  List,
  Table,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

// Types
type ComponentType =
  | "textbox"
  | "list"
  | "table"
  | "checkbox"
  | "date"
  | "email"
  | "phone";

interface FormComponent {
  id: string;
  type: ComponentType;
  label: string;
}

interface Section {
  id: string;
  title: string;
  components: FormComponent[];
}

interface DroppedSection extends Section {
  components: FormComponent[];
}

// Component Library
const componentLibrary: FormComponent[] = [
  { id: "textbox", type: "textbox", label: "Text Input" },
  { id: "email", type: "email", label: "Email Input" },
  { id: "phone", type: "phone", label: "Phone Input" },
  { id: "date", type: "date", label: "Date Picker" },
  { id: "checkbox", type: "checkbox", label: "Checkbox" },
  { id: "list", type: "list", label: "Dropdown List" },
  { id: "table", type: "table", label: "Data Table" },
];

// Section Library
const sectionLibrary: Section[] = [
  {
    id: "contact",
    title: "Contact Information",
    components: [
      { id: "name", type: "textbox", label: "Full Name" },
      { id: "email-field", type: "email", label: "Email Address" },
      { id: "phone-field", type: "phone", label: "Phone Number" },
    ],
  },
  {
    id: "address",
    title: "Address Details",
    components: [
      { id: "street", type: "textbox", label: "Street Address" },
      { id: "city", type: "textbox", label: "City" },
      { id: "zip", type: "textbox", label: "ZIP Code" },
    ],
  },
  {
    id: "preferences",
    title: "User Preferences",
    components: [
      {
        id: "pref-newsletter",
        type: "checkbox",
        label: "Subscribe to Newsletter",
      },
      {
        id: "pref-notifications",
        type: "checkbox",
        label: "Enable Notifications",
      },
      { id: "pref-category", type: "list", label: "Preferred Category" },
    ],
  },
];

// Helper function to get component icon
const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case "textbox":
      return <Type className="w-4 h-4 text-blue-500" />;
    case "list":
      return <List className="w-4 h-4 text-green-500" />;
    case "table":
      return <Table className="w-4 h-4 text-purple-500" />;
    case "checkbox":
      return <CheckSquare className="w-4 h-4 text-orange-500" />;
    case "date":
      return <Calendar className="w-4 h-4 text-red-500" />;
    case "email":
      return <Mail className="w-4 h-4 text-indigo-500" />;
    case "phone":
      return <Phone className="w-4 h-4 text-teal-500" />;
    default:
      return null;
  }
};

// Render component preview
const ComponentPreview: React.FC<{ component: FormComponent }> = ({
  component,
}) => {
  switch (component.type) {
    case "textbox":
    case "email":
    case "phone":
      return (
        <input
          type={component.type === "textbox" ? "text" : component.type}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Enter ${component.label.toLowerCase()}`}
          disabled
        />
      );
    case "list":
      return (
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled
        >
          <option>Select an option</option>
        </select>
      );
    case "table":
      return (
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-sm text-gray-500">
            Table component placeholder
          </div>
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4" disabled />
          <span className="text-sm">{component.label}</span>
        </label>
      );
    case "date":
      return (
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled
        />
      );
    default:
      return null;
  }
};

// Main Form Builder Page with HTML5 Drag and Drop
export const FormBuilderPageHTML5: React.FC = () => {
  const [droppedSections, setDroppedSections] = useState<DroppedSection[]>([]);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{
    type: "section" | "component";
    data: Section | FormComponent;
  } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  // Handle dragstart event
  const handleDragStart = (
    e: React.DragEvent,
    type: "section" | "component",
    data: Section | FormComponent,
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
      }),
    );

    setDraggedItem({ type, data });

    // Dispatch custom event for tracking
    const dragStartEvent = new CustomEvent("katalon:dragstart", {
      bubbles: true,
      detail: {
        itemId: data.id,
        itemType: type,
        itemLabel: "title" in data ? data.title : data.label,
        timestamp: new Date().toISOString(),
      },
    });
    window.dispatchEvent(dragStartEvent);

    console.log("[HTML5 Drag Start]", {
      itemId: data.id,
      itemType: type,
      itemLabel: "title" in data ? data.title : data.label,
    });
  };

  // Handle dragover event
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget(targetId);
  };

  // Handle drop event
  const handleDrop = (
    e: React.DragEvent,
    dropTarget: {
      type: "section" | "component" | "empty";
      id?: string;
      sectionId?: string;
    },
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const transferData = e.dataTransfer.getData("text/plain");
    if (!transferData) return;

    const { type, data } = JSON.parse(transferData);

    if (type === "section") {
      handleSectionDrop(data as Section, dropTarget);
    } else if (type === "component") {
      handleComponentDrop(data as FormComponent, dropTarget);
    }

    setDraggedItem(null);
    setDragOverTarget(null);

    // Dispatch drop event
    const dropEvent = new CustomEvent("katalon:drop", {
      bubbles: true,
      detail: {
        itemId: data.id,
        itemType: type,
        dropTarget: dropTarget.id || "empty",
        dropSuccess: true,
        timestamp: new Date().toISOString(),
      },
    });
    window.dispatchEvent(dropEvent);

    console.log("[HTML5 Drop]", {
      itemId: data.id,
      itemType: type,
      dropTarget: dropTarget.id || "empty",
      dropSuccess: true,
    });
  };

  // Handle section drop
  const handleSectionDrop = (
    section: Section,
    dropTarget: { type: string; id?: string },
  ) => {
    const newSection: DroppedSection = {
      ...section,
      id: `${section.id}-${Date.now()}`,
      components: section.components.map((c) => ({
        ...c,
        id: `${c.id}-${Date.now()}`,
      })),
    };

    if (dropTarget.type === "empty") {
      setDroppedSections([newSection]);
    } else if (dropTarget.type === "section") {
      const targetIndex = droppedSections.findIndex(
        (s) => s.id === dropTarget.id,
      );
      if (targetIndex !== -1) {
        const newSections = [...droppedSections];
        newSections.splice(targetIndex + 1, 0, newSection);
        setDroppedSections(newSections);
      }
    }
  };

  // Handle component drop
  const handleComponentDrop = (
    component: FormComponent,
    dropTarget: { type: string; id?: string; sectionId?: string },
  ) => {
    if (dropTarget.sectionId) {
      const newComponent: FormComponent = {
        ...component,
        id: `${component.id}-${Date.now()}`,
      };

      setDroppedSections(
        droppedSections.map((section) =>
          section.id === dropTarget.sectionId
            ? { ...section, components: [...section.components, newComponent] }
            : section,
        ),
      );
    }
  };

  // Remove section
  const removeSection = (sectionId: string) => {
    setDroppedSections(droppedSections.filter((s) => s.id !== sectionId));
  };

  // Remove component
  const removeComponent = (sectionId: string, componentId: string) => {
    setDroppedSections(
      droppedSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              components: section.components.filter(
                (c) => c.id !== componentId,
              ),
            }
          : section,
      ),
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Advanced Form Builder (HTML5 Drag & Drop)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Sections */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Pre-defined Sections
            </h2>
            <div className="space-y-2">
              {sectionLibrary.map((section) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, "section", section)}
                  className="border border-purple-200 bg-purple-50 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
                  data-dragzone="true"
                  data-drag-type="section"
                  data-testid={`section-${section.id}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-800">
                      {section.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {section.components.map((component) => (
                      <div
                        key={component.id}
                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-sm"
                      >
                        {getComponentIcon(component.type)}
                        <span>{component.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Components Library */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Components
            </h2>
            <div className="space-y-2">
              {componentLibrary.map((component) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, "component", component)
                  }
                  className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md cursor-move hover:shadow-md transition-shadow"
                  data-dragzone="true"
                  data-drag-type="component"
                  data-testid={`component-${component.id}`}
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  {getComponentIcon(component.type)}
                  <span className="flex-1 text-sm font-medium">
                    {component.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Form Preview
            </h2>

            {droppedSections.length === 0 ? (
              <div
                onDragOver={(e) => handleDragOver(e, "empty")}
                onDrop={(e) => handleDrop(e, { type: "empty" })}
                className={`flex items-center justify-center h-96 border-2 border-dashed rounded-lg ${
                  dragOverTarget === "empty"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                data-dragzone="true"
                data-drop-zone="true"
                data-testid="drop-zone-empty"
              >
                <p className="text-gray-500 text-center">
                  Drag sections here to start building your form
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {droppedSections.map((section) => (
                  <div
                    key={section.id}
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDrop={(e) =>
                      handleDrop(e, { type: "section", id: section.id })
                    }
                    className={`border rounded-lg ${
                      dragOverTarget === section.id
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : "border-gray-300"
                    } bg-white`}
                    data-dragzone="true"
                    data-drag-type="section"
                    data-testid={`section-${section.id}`}
                  >
                    <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
                      <h3 className="flex-1 font-semibold text-gray-800">
                        {section.title}
                      </h3>
                      <button
                        onClick={() => removeSection(section.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div
                      className="p-3 min-h-[60px]"
                      onDragOver={(e) =>
                        handleDragOver(e, `${section.id}-drop`)
                      }
                      onDrop={(e) =>
                        handleDrop(e, {
                          type: "component",
                          sectionId: section.id,
                        })
                      }
                      data-dragzone="true"
                      data-drop-zone="true"
                    >
                      <div className="space-y-2">
                        {section.components.map((component) => (
                          <div
                            key={component.id}
                            className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded"
                            data-testid={`component-${component.id}`}
                          >
                            {getComponentIcon(component.type)}
                            <span className="flex-1 text-sm">
                              {component.label}
                            </span>
                            <button
                              onClick={() =>
                                removeComponent(section.id, component.id)
                              }
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove component"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Form Preview Toggle */}
            {droppedSections.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mb-4"
                >
                  {showLivePreview ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Live Form Preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show Live Form Preview
                    </>
                  )}
                </button>

                {showLivePreview && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {droppedSections.map((section) => (
                      <div key={`preview-${section.id}`} className="space-y-4">
                        <h4 className="font-semibold text-gray-700">
                          {section.title}
                        </h4>
                        {section.components.map((component) => (
                          <div key={`preview-comp-${component.id}`}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {component.label}
                            </label>
                            <ComponentPreview component={component} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
          Instructions (HTML5 Native):
        </h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Uses native HTML5 draggable attribute and drag/drop events</li>
          <li>
            • Drag pre-defined sections from the left panel to the form preview
          </li>
          <li>• Drag individual components into sections to add more fields</li>
          <li>• Click the trash icon to remove sections or components</li>
          <li>
            • Click "Show Live Form Preview" to see how the form will look
          </li>
          <li>
            • All events use standard dragstart and drop for test automation
          </li>
        </ul>
      </div>
    </div>
  );
};
