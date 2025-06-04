/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Extend the blue color palette for dark mode
        blue: {
          900: "#1e3a8a",
        },
      },
      backgroundColor: {
        dark: {
          100: "#374151",
          200: "#1f2937",
          300: "#111827",
          400: "#0f172a",
        },
      },
      textColor: {
        dark: {
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
        },
      },
    },
  },
  plugins: [],
};
