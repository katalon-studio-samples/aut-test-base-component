import React, { useState, useEffect } from 'react';

export const OpenPopupPage: React.FC = () => {
  const [info, setInfo] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'popupFormData') {
        setInfo(event.data.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const openPopup = () => {
    window.open(
      '/popup-form',
      'PopupForm',
      'width=500,height=500'
    );
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">Open Popup Form</h1>
        <button
            onClick={openPopup}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors mb-6"
        >
          Open Form in New Window
        </button>
          {info && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">Submitted Info:</h2>
                  <div className="mb-2 text-gray-800 dark:text-gray-200"><span className="font-medium">Name:</span> {info.name}</div>
                  <div className="text-gray-800 dark:text-gray-200"><span className="font-medium">Email:</span> {info.email}</div>
                  <button
                      onClick={() => setInfo(null)}
                      className="mt-4 px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                  >
                      Clear
                  </button>
              </div>
          )}
      </div>
  );
};
