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
            DEFAULT: '#D4AF37',
            shimmer: '#EDD196',
            vibrant: '#F9D976',
            dark: '#A68546',
          },
          black: {
            DEFAULT: '#0A0A0A',
            glass: 'rgba(10, 10, 10, 0.7)',
            vapor: 'rgba(10, 10, 10, 0.4)',
          },
          cream: '#FDFBF7',
          'white-warm': '#FAF9F6',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
        '2xl': '40px',
      },
      boxShadow: {
        gold: '0 20px 40px -10px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}


