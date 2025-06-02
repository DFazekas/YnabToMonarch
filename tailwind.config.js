/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.html",
    "./public/src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#005B96" // you may want your branded color for buttons/icons
      }
    }
  },
  plugins: []
}
