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
        'sans': ['Inter var', ...defaultTheme.fontFamily.sans],
        'serif': ['"Source Serif 4"', ...defaultTheme.fontFamily.serif],
        'title': ['Sora', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
