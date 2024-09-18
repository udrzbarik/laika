/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    '*.html',
  ],
  theme: {
    extend: {
      borderWidth: {
        1: "1px"
      }
    },
  },
  plugins: [],
}

