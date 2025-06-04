import React, { useState } from "react";
import type { NotificationMessage } from "../types";
import { X } from "lucide-react";

export const NotificationExample: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = (type: NotificationMessage["type"]) => {
    const newNotification: NotificationMessage = {
      id: Date.now().toString(),
      type,
      message: `This is a ${type} notification message.`,
    };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id),
      );
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4" data-test="notification-example">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => addNotification("success")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          data-test="add-success"
        >
          Success Message
        </button>
        <button
          onClick={() => addNotification("error")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          data-test="add-error"
        >
          Error Message
        </button>
        <button
          onClick={() => addNotification("info")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          data-test="add-info"
        >
          Info Message
        </button>
      </div>

      <div
        className="fixed top-4 right-4 space-y-2 w-[calc(100%-2rem)] sm:w-80 z-50"
        data-test="notification-container"
      >
        {notifications.map(({ id, type, message }) => (
          <div
            key={id}
            className={`p-4 rounded shadow-lg flex justify-between items-start ${
              type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : type === "error"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
            data-test={`notification-${id}`}
          >
            <p className="pr-2">{message}</p>
            <button
              onClick={() => removeNotification(id)}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex-shrink-0"
              data-test={`close-notification-${id}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
