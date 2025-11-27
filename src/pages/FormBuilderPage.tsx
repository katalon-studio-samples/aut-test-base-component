import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  position: number;
}

interface DropZone {
  id: string;
  type: "drop-zone";
  position: "before" | "after";
  sectionId?: string;
}

// Component definitions
const componentLibrary: FormComponent[] = [
  { id: "textbox", type: "textbox", label: "Text Input" },
  { id: "list", type: "list", label: "Dropdown List" },
  { id: "table", type: "table", label: "Data Table" },
  { id: "checkbox", type: "checkbox", label: "Checkbox" },
  { id: "date", type: "date", label: "Date Picker" },
  { id: "email", type: "email", label: "Email Input" },
  { id: "phone", type: "phone", label: "Phone Input" },
];

// Section definitions
const sectionLibrary: Section[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    components: [
      { id: "pi-name", type: "textbox", label: "Full Name" },
      { id: "pi-email", type: "email", label: "Email Address" },
      { id: "pi-phone", type: "phone", label: "Phone Number" },
    ],
  },
  {
    id: "address",
    title: "Address Details",
    components: [
      { id: "addr-street", type: "textbox", label: "Street Address" },
      { id: "addr-city", type: "textbox", label: "City" },
      { id: "addr-zip", type: "textbox", label: "Zip Code" },
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
  {
    id: "schedule",
    title: "Schedule & Availability",
    components: [
      { id: "sched-date", type: "date", label: "Preferred Date" },
      { id: "sched-time", type: "list", label: "Time Slot" },
      { id: "sched-table", type: "table", label: "Availability Calendar" },
    ],
  },
];

// Icon mapping
const getComponentIcon = (type: ComponentType) => {
  const iconProps = { className: "w-4 h-4" };
  switch (type) {
    case "textbox":
      return <Type {...iconProps} />;
    case "list":
      return <List {...iconProps} />;
    case "table":
      return <Table {...iconProps} />;
    case "checkbox":
      return <CheckSquare {...iconProps} />;
    case "date":
      return <Calendar {...iconProps} />;
    case "email":
      return <Mail {...iconProps} />;
    case "phone":
      return <Phone {...iconProps} />;
    default:
      return <Type {...iconProps} />;
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
          placeholder={component.label}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled
        />
      );
    case "list":
      return (
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled
        >
          <option>Select {component.label}</option>
        </select>
      );
    case "table":
      return (
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Column 1</th>
                <th className="px-3 py-2 text-left">Column 2</th>
                <th className="px-3 py-2 text-left">Column 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-t">Data</td>
                <td className="px-3 py-2 border-t">Data</td>
                <td className="px-3 py-2 border-t">Data</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4" disabled />
          <span>{component.label}</span>
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

// Draggable Component Item
const DraggableComponent: React.FC<{
  component: FormComponent;
  isDragging?: boolean;
  isInSection?: boolean;
  onRemove?: () => void;
  isOver?: boolean;
}> = ({ component, isDragging, isInSection, onRemove, isOver }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 bg-white border rounded-md ${
        isInSection ? "border-gray-300" : "border-blue-200 bg-blue-50"
      } ${isSortableDragging ? "shadow-lg" : ""}`}
      data-testid={`component-${component.id}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      {getComponentIcon(component.type)}
      <span className="flex-1 text-sm font-medium">{component.label}</span>
      {isInSection && onRemove && (
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1"
          title="Remove component"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Draggable Section
const DraggableSection: React.FC<{
  section: Section;
  isDragging?: boolean;
  isInPreview?: boolean;
  onRemove?: () => void;
  onAddComponent?: (component: FormComponent) => void;
  onRemoveComponent?: (componentId: string) => void;
  isOver?: boolean;
  activeComponentId?: string | null;
  overComponentId?: string | null;
}> = ({
  section,
  isDragging,
  isInPreview,
  onRemove,
  onAddComponent,
  onRemoveComponent,
  isOver,
  activeComponentId,
  overComponentId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isOver: isSortableOver,
  } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const showDropIndicator = isInPreview && (isOver || isSortableOver);
  const isComponentDragTarget =
    isInPreview && activeComponentId && !overComponentId;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg ${
        isInPreview
          ? "border-gray-300 bg-white"
          : "border-purple-200 bg-purple-50"
      } ${isDragging ? "shadow-lg" : ""} ${
        showDropIndicator ? "ring-2 ring-blue-500 ring-offset-2" : ""
      } ${
        isComponentDragTarget && isSortableOver
          ? "ring-2 ring-green-500 ring-offset-2"
          : ""
      }`}
      data-testid={`section-${section.id}`}
    >
      <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="flex-1 font-semibold text-gray-800">{section.title}</h3>
        {isInPreview && onRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remove section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div
        className={`p-3 transition-colors ${
          isComponentDragTarget && isSortableOver ? "bg-green-50" : ""
        }`}
      >
        {isInPreview ? (
          <SortableContext
            items={section.components.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 min-h-[40px]">
              {section.components.map((component, index) => {
                const isActiveComponent = activeComponentId === component.id;
                const isOverComponent = overComponentId === component.id;
                const showIndicatorBefore =
                  !isActiveComponent && isOverComponent && activeComponentId;

                return (
                  <React.Fragment key={component.id}>
                    {showIndicatorBefore && <DropIndicator type="component" />}
                    <DraggableComponent
                      component={component}
                      isInSection={true}
                      isOver={false}
                      onRemove={() => onRemoveComponent?.(component.id)}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </SortableContext>
        ) : (
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
        )}
      </div>
    </div>
  );
};

// Drop Indicator Component
const DropIndicator: React.FC<{ type?: "section" | "component" }> = ({
  type = "section",
}) => (
  <div
    className={`relative h-2 my-1 transition-all duration-200`}
    data-testid={`drop-indicator-${type}`}
  >
    <div
      className={`absolute inset-0 h-0.5 rounded-full ${
        type === "section" ? "bg-blue-500" : "bg-green-500"
      }`}
    />
    <div className="absolute left-1/2 -translate-x-1/2 -top-3">
      <span
        className={`text-white text-xs px-3 py-1 rounded-full shadow-lg whitespace-nowrap ${
          type === "section" ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        Drop here
      </span>
    </div>
  </div>
);

// Drop Zone Component for sections
const SectionDropZone: React.FC<{
  id: string;
  position: "before" | "after";
  isActive: boolean;
}> = ({ id, position, isActive }) => {
  const { setNodeRef, isOver } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-200 ${
        isActive ? "h-32 my-3" : "h-1"
      } ${
        isOver && isActive
          ? "bg-blue-100 border-4 border-dashed border-blue-500 rounded-xl shadow-lg"
          : isActive
            ? "bg-blue-50/50 border-4 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-100 hover:shadow-md"
            : ""
      }`}
      data-testid={`drop-zone-${position}`}
    >
      {isActive && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <span
            className={`text-base font-semibold ${
              isOver ? "text-blue-700" : "text-blue-500"
            }`}
          >
            {isOver
              ? "🎯 Release to drop here"
              : `Drop section ${position === "before" ? "above ⬆️" : "below ⬇️"}`}
          </span>
          {!isOver && (
            <span className="text-xs text-gray-500">
              Drag your section here
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Main Form Builder Page
export const FormBuilderPage: React.FC = () => {
  const [droppedSections, setDroppedSections] = useState<DroppedSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"section" | "component" | null>(
    null,
  );
  const [overId, setOverId] = useState<string | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);

    // Determine if dragging a section or component
    if (sectionLibrary.find((s) => s.id === event.active.id)) {
      setDragType("section");
    } else if (componentLibrary.find((c) => c.id === event.active.id)) {
      setDragType("component");
    } else {
      // Check if it's a component within a section (already dropped)
      const isComponentInSection = droppedSections.some((section) =>
        section.components.some((c) => c.id === event.active.id),
      );
      if (isComponentInSection) {
        setDragType("component");
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    const overId = over ? (over.id as string) : null;
    setOverId(overId);

    // Check if over a drop zone
    if (
      overId &&
      (overId.startsWith("drop-zone-before-") ||
        overId.startsWith("drop-zone-after-") ||
        overId === "drop-zone-empty")
    ) {
      setIsOverDropZone(true);
    } else {
      setIsOverDropZone(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setDragType(null);
      setOverId(null);
      setIsOverDropZone(false);
      return;
    }

    const overIdStr = over.id as string;

    // Handle section drop and reordering
    if (dragType === "section") {
      const section = sectionLibrary.find((s) => s.id === active.id);
      const draggedSection = droppedSections.find((s) => s.id === active.id);

      // Check if dropped in a valid drop zone
      const isValidDropZone =
        overIdStr === "drop-zone-empty" ||
        overIdStr.startsWith("drop-zone-before-") ||
        overIdStr.startsWith("drop-zone-after-");

      if (!isValidDropZone && !draggedSection) {
        // Invalid drop area for new section
        setActiveId(null);
        setDragType(null);
        setOverId(null);
        setIsOverDropZone(false);
        return;
      }

      if (
        section &&
        !droppedSections.find((s) => s.id.startsWith(section.id))
      ) {
        // New section being dropped
        const newSection: DroppedSection = {
          ...section,
          position: droppedSections.length,
          id: `${section.id}-${Date.now()}`,
          components: section.components.map((c) => ({
            ...c,
            id: `${c.id}-${Date.now()}`,
          })),
        };

        if (overIdStr === "drop-zone-empty") {
          setDroppedSections([newSection]);
        } else if (overIdStr.startsWith("drop-zone-before-")) {
          const targetSectionId = overIdStr.replace("drop-zone-before-", "");
          const targetIndex = droppedSections.findIndex(
            (s) => s.id === targetSectionId,
          );
          if (targetIndex !== -1) {
            const newSections = [...droppedSections];
            newSections.splice(targetIndex, 0, newSection);
            setDroppedSections(newSections);
          }
        } else if (overIdStr.startsWith("drop-zone-after-")) {
          const targetSectionId = overIdStr.replace("drop-zone-after-", "");
          const targetIndex = droppedSections.findIndex(
            (s) => s.id === targetSectionId,
          );
          if (targetIndex !== -1) {
            const newSections = [...droppedSections];
            newSections.splice(targetIndex + 1, 0, newSection);
            setDroppedSections(newSections);
          }
        }
      } else if (draggedSection && active.id !== over.id) {
        // Reordering existing sections
        if (overIdStr.startsWith("drop-zone-before-")) {
          const targetSectionId = overIdStr.replace("drop-zone-before-", "");
          const oldIndex = droppedSections.findIndex((s) => s.id === active.id);
          const targetIndex = droppedSections.findIndex(
            (s) => s.id === targetSectionId,
          );
          if (oldIndex !== -1 && targetIndex !== -1) {
            const newIndex =
              oldIndex < targetIndex ? targetIndex - 1 : targetIndex;
            setDroppedSections(arrayMove(droppedSections, oldIndex, newIndex));
          }
        } else if (overIdStr.startsWith("drop-zone-after-")) {
          const targetSectionId = overIdStr.replace("drop-zone-after-", "");
          const oldIndex = droppedSections.findIndex((s) => s.id === active.id);
          const targetIndex = droppedSections.findIndex(
            (s) => s.id === targetSectionId,
          );
          if (oldIndex !== -1 && targetIndex !== -1) {
            const newIndex =
              oldIndex < targetIndex ? targetIndex : targetIndex + 1;
            setDroppedSections(arrayMove(droppedSections, oldIndex, newIndex));
          }
        }
      }
    }

    // Handle component drop to section or reordering within section
    if (dragType === "component") {
      const component = componentLibrary.find((c) => c.id === active.id);

      // Check if reordering within a section
      const sourceSection = droppedSections.find((section) =>
        section.components.some((c) => c.id === active.id),
      );
      const targetSection = droppedSections.find(
        (section) =>
          section.components.some((c) => c.id === over.id) ||
          section.id === over.id,
      );

      if (
        sourceSection &&
        targetSection &&
        sourceSection.id === targetSection.id
      ) {
        // Reordering within the same section
        const oldIndex = sourceSection.components.findIndex(
          (c) => c.id === active.id,
        );
        const newIndex = sourceSection.components.findIndex(
          (c) => c.id === over.id,
        );

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          setDroppedSections(
            droppedSections.map((section) =>
              section.id === sourceSection.id
                ? {
                    ...section,
                    components: arrayMove(
                      section.components,
                      oldIndex,
                      newIndex,
                    ),
                  }
                : section,
            ),
          );
        }
      } else if (component) {
        // Adding new component from library
        const targetSectionId = overIdStr as string;
        let targetSection = droppedSections.find(
          (s) => s.id === targetSectionId,
        );
        let targetComponentId: string | null = null;

        // If not found directly, check if we're over a component in a section
        if (!targetSection) {
          targetSection = droppedSections.find((section) =>
            section.components.some((c) => c.id === targetSectionId),
          );
          if (targetSection) {
            targetComponentId = targetSectionId;
          }
        }

        if (targetSection) {
          const newComponent: FormComponent = {
            ...component,
            id: `${component.id}-${Date.now()}`,
          };

          setDroppedSections(
            droppedSections.map((section) => {
              if (section.id === targetSection.id) {
                // If dropped over a specific component, insert before it
                if (targetComponentId) {
                  const targetIndex = section.components.findIndex(
                    (c) => c.id === targetComponentId,
                  );
                  if (targetIndex !== -1) {
                    const newComponents = [...section.components];
                    newComponents.splice(targetIndex, 0, newComponent);
                    return { ...section, components: newComponents };
                  }
                }
                // Otherwise, append to the end
                return {
                  ...section,
                  components: [...section.components, newComponent],
                };
              }
              return section;
            }),
          );
        }
      }
    }

    setActiveId(null);
    setDragType(null);
    setOverId(null);
    setIsOverDropZone(false);
  };

  const removeSection = (sectionId: string) => {
    setDroppedSections(droppedSections.filter((s) => s.id !== sectionId));
  };

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

  const reorderComponents = (
    sectionId: string,
    oldIndex: number,
    newIndex: number,
  ) => {
    setDroppedSections(
      droppedSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              components: arrayMove(section.components, oldIndex, newIndex),
            }
          : section,
      ),
    );
  };

  const activeSection = sectionLibrary.find((s) => s.id === activeId);
  const activeComponent = componentLibrary.find((c) => c.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Advanced Form Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Drag sections and components to build your custom form
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Component Library */}
          <div className="space-y-6">
            {/* Pre-defined Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Pre-defined Sections
              </h2>
              <SortableContext
                items={sectionLibrary.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {sectionLibrary.map((section) => (
                    <DraggableSection key={section.id} section={section} />
                  ))}
                </div>
              </SortableContext>
            </div>

            {/* Individual Components */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Components
              </h2>
              <SortableContext
                items={componentLibrary.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {componentLibrary.map((component) => (
                    <DraggableComponent
                      key={component.id}
                      component={component}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>

          {/* Right Panel - Form Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-h-[600px]">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Form Preview
              </h2>

              {droppedSections.length === 0 ? (
                <SortableContext
                  items={["drop-zone-empty"]}
                  strategy={verticalListSortingStrategy}
                >
                  <SectionDropZone
                    id="drop-zone-empty"
                    position="before"
                    isActive={activeId !== null && dragType === "section"}
                  />
                  {!(activeId && dragType === "section") && (
                    <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg mt-2">
                      <p className="text-gray-500 text-center">
                        Drag sections here to start building your form
                      </p>
                    </div>
                  )}
                </SortableContext>
              ) : (
                <SortableContext
                  items={[
                    ...droppedSections.flatMap((s) => [
                      `drop-zone-before-${s.id}`,
                      s.id,
                      `drop-zone-after-${s.id}`,
                    ]),
                  ]}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {droppedSections.map((section, index) => {
                      const isActiveSection = activeId === section.id;
                      const isDraggingSection =
                        dragType === "section" && activeId !== null;

                      return (
                        <React.Fragment key={section.id}>
                          {/* Show drop zone before first section */}
                          {index === 0 && (
                            <SectionDropZone
                              id={`drop-zone-before-${section.id}`}
                              position="before"
                              isActive={isDraggingSection && !isActiveSection}
                            />
                          )}
                          <DraggableSection
                            section={section}
                            isInPreview={true}
                            isOver={false}
                            activeComponentId={
                              dragType === "component" ? activeId : null
                            }
                            overComponentId={
                              dragType === "component" ? overId : null
                            }
                            onRemove={() => removeSection(section.id)}
                            onRemoveComponent={(componentId) =>
                              removeComponent(section.id, componentId)
                            }
                          />
                          {/* Show drop zone after each section */}
                          <SectionDropZone
                            id={`drop-zone-after-${section.id}`}
                            position="after"
                            isActive={isDraggingSection && !isActiveSection}
                          />
                        </React.Fragment>
                      );
                    })}
                  </div>
                </SortableContext>
              )}

              {/* Live Form Preview Toggle Button */}
              {droppedSections.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => setShowLivePreview(!showLivePreview)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mb-4"
                    data-testid="toggle-live-preview"
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

                  {/* Render actual form components */}
                  {showLivePreview && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      {droppedSections.map((section) => (
                        <div
                          key={`preview-${section.id}`}
                          className="space-y-4"
                        >
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
            Instructions:
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              • Drag pre-defined sections from the left panel to the form
              preview
            </li>
            <li>
              • <strong>Drop zones</strong> appear when dragging sections -
              choose to drop above or below existing sections
            </li>
            <li>
              • Sections must be dropped in the highlighted drop zones (not on
              the left panel)
            </li>
            <li>
              • Drag individual components into sections to add more fields
            </li>
            <li>• Reorder components within sections by dragging them</li>
            <li>• Click the trash icon to remove sections or components</li>
            <li>
              • Click "Show Live Form Preview" button to see how the form will
              look with actual inputs
            </li>
          </ul>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId && dragType === "section" && activeSection && (
          <DraggableSection section={activeSection} isDragging={true} />
        )}
        {activeId && dragType === "component" && activeComponent && (
          <DraggableComponent component={activeComponent} isDragging={true} />
        )}
      </DragOverlay>
    </DndContext>
  );
};
