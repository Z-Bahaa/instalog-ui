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
        'thn': { 'max': '999px' },
        'svn': { 'max': '720px' },
        'fft': { 'max': '550px' },
      },
    },
  },
  plugins: [],
}