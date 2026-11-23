/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        en: {
          light: "#dbeafe",   // blue-100
          DEFAULT: "#3b82f6", // blue-500
          dark: "#1e40af",    // blue-800
        },
        de: {
          light: "#fef3c7",   // amber-100
          DEFAULT: "#f59e0b", // amber-500
          dark: "#92400e",    // amber-800
        },
      },
    },
  },
  plugins: [],
};