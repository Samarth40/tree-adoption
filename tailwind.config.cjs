/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#2D5A27',
        'sage-green': '#86A97C',
        'earth-brown': '#795548',
        'leaf-green': '#4CAF50',
        'sky-blue': '#03A9F4',
        'cream': '#F5F5DC',
      },
    },
  },
  plugins: [],
} 