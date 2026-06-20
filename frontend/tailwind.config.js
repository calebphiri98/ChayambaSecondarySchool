/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F4C81',
        secondary: '#1E6F5C',
        accent: '#F9A826',
        neutralBg: '#F8FAFC',
        textDark: '#1F2937',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headings: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}   