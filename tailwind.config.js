/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/index.html', './client/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A4B',
          deep: '#0B1D29',
        },
        coral: '#E07A5F',
        slate: '#4A6FA5',
        sand: '#D4C5B2',
        sage: '#6B9080',
        warm: {
          white: '#FAF9F6',
          grey: '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
