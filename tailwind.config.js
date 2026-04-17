/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: {
            DEFAULT: '#D4AF37', // Champagne Gold
            light: '#F4E7B5',
            dark: '#A68546',
            shimmer: '#EDD196',
            vibrant: '#F9D976',
          },
          white: {
            DEFAULT: '#FFFFFF',
            warm: '#fdfbf7',
            cream: '#FFFBED',
          },
          black: {
            DEFAULT: '#121212',
            glass: 'rgba(18, 18, 18, 0.7)',
            vapor: 'rgba(18, 18, 18, 0.4)',
          }
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
