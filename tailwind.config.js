/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './',
    './src/**/*.tsx',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.js'
  ],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dracula"]
  }
}
