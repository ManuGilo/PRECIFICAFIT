/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fit: {
          green: '#10B981', // emerald-500
          darkgreen: '#059669', // emerald-600
          lightgreen: '#D1FAE5', // emerald-100
          orange: '#F97316', // orange-500
          softorange: '#FFEDD5', // orange-100
          dark: '#0F172A', // slate-900
          card: '#1E293B' // slate-800
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
