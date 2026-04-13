/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosa: {
          DEFAULT: '#E85D93',
          light: '#FFE4ED',
          dark: '#D95288',
        },
        coral: '#FF8A7A',
        dorado: '#F3C86A',
        ciruela: '#7A466A',
        bg: '#FFF8F4',
        surface: '#FFFFFF',
        'surface-soft': '#FFF1F4',
        texto: {
          primary: '#2D2430',
          secondary: '#6E6572',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(45, 36, 48, 0.06)',
        md: '0 4px 16px rgba(45, 36, 48, 0.08)',
        lg: '0 8px 32px rgba(45, 36, 48, 0.12)',
      },
    },
  },
  plugins: [],
};