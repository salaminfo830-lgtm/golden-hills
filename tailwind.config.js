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
            DEFAULT: '#c5a059',
            light: '#d4af37',
            dark: '#a68546',
            shimmer: '#FFD700',
          },
          white: {
            DEFAULT: '#FFFFFF',
            warm: '#fdfbf7',
            cream: '#F9F6EE',
          },
          black: {
            DEFAULT: '#1a1a1a',
            glass: 'rgba(26, 26, 26, 0.8)',
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
