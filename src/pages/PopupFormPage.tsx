import React, { useState } from "react";

export const PopupFormPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.opener) {
      window.opener.postMessage({ type: "popupFormData", data: form }, "*");
    }
    window.close();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Enter Info</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-sm mx-auto"
      >
        <div>
          <label
            className="block text-gray-700 dark:text-gray-200 font-medium mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 dark:text-gray-200 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => window.close()}
          className="w-full mt-2 px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors shadow"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
