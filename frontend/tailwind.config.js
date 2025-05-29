/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ active le mode sombre via une classe
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
