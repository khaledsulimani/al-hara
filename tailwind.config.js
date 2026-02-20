/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ramadan: {
          dark: '#0d3b2a',
          green: '#0f5132',
          light: '#1a5c3e',
          gold: '#d4a84b',
          cream: '#f5f0e6',
        },
        hara: {
          blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe' },
          green: { 50: '#ecfdf5', 100: '#d1fae5', 600: '#059669' },
        },
      },
    },
  },
  plugins: [],
}
