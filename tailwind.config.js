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
            DEFAULT: '#FFD700',
            light: '#FFECB3',
            dark: '#B8860B',
            shimmer: '#FFED4D',
            vibrant: '#FFC107',
          },
          white: {
            DEFAULT: '#FFFFFF',
            warm: '#fdfbf7',
            cream: '#FFFBED',
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
