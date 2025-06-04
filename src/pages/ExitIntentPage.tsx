import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { useMouseLeave } from "../hooks/useMouseLeave";

export const ExitIntentPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  const handleMouseLeave = useCallback(() => {
    if (!modalDismissed) {
      setShowModal(true);
    }
  }, [modalDismissed]);

  useMouseLeave(handleMouseLeave);

  const handleDismiss = () => {
    setShowModal(false);
    setModalDismissed(true);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Exit Intent
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Move your mouse cursor outside the browser window (towards the top) to
        trigger the exit intent modal. The modal will only appear once.
      </p>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          data-test="exit-modal"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md relative">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              data-test="close-modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Wait! Don't Leave Yet!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Would you like to subscribe to our newsletter before you go?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                data-test="modal-no"
              >
                No, thanks
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                data-test="modal-yes"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
