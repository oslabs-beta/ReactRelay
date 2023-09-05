/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './',
    './src/**/*.tsx',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#4DA5CB',
          secondary: '#FFD059',
          accent: '#FF7959',
          neutral: '#A6D9EF',
          'base-100': '#A6D9EF',
          // 'tree-background': '#22303C',
          info: '#73BEDE',
          success: '#36d399',
          warning: '#FFB909',
          error: '#f87272',
        },
        borderWidth: {
          DEFAULT: '1px',
          0: '0',
          2: '2px',
          3: '3px',
          4: '4px',
          6: '6px',
          8: '8px',
        },
      },
    ],
  },
};
