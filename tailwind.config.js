/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{md,njk}'],
  theme: {
    extend: {
      colors: {
        specialred: {
          DEFAULT: '#CD123F',
        },
      },
      fontFamily: {
        'sans': ['InterVariable', ...defaultTheme.fontFamily.sans],
        'serif': ['"EB Garamond"', ...defaultTheme.fontFamily.serif],
        'title': ['Sora', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
