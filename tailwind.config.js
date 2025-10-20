/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: "#f2e4b7",
          DEFAULT: "#d4b978",
          dark: "#b9994b",
        },
        beige: {
          light: "#faf7f1",
          DEFAULT: "#f4efe6",
          dark: "#e7dcc5",
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
