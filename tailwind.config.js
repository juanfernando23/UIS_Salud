/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#13ec37",
        "primary-dark": "#0fb82b",
        "background-light": "#f6f8f6",
        "background-dark": "#102213",
        "surface-light": "#ffffff",
        "surface-dark": "#1a3320",
        "neutral-light": "#e2e8e2",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(19, 236, 55, 0.15)',
      }
    },
  },
  plugins: [],
}
