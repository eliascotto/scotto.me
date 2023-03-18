/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{md,njk}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter var', ...defaultTheme.fontFamily.sans],
        'title': ['Sora', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
