import React from "react";
import { NotificationExample } from "../components/NotificationExample";

export const NotificationsPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Notifications
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Practice working with dynamic notifications, including different types
        of messages and auto-dismissing alerts.
      </p>
      <NotificationExample />
    </div>
  );
};
