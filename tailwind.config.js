/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md': { 'min': '500px' },
        'sm': { 'max': '499px' },
      },
    },
  },
  plugins: [],
}