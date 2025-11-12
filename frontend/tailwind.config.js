/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // This includes all files in src/ using JS/TS with JSX
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#FFCE1A',
        'secondary':"#0d0842",
        'blackBG':'#F3F3F3',
        'Favoirte':'#FF5841'
      },
      fontFamily:{
        'primary': ["Montserrat", "sans-serif"],
        'secondary': ["Nunito Sans", "sans-serif"],
      }
    },
  },
  plugins: [],
};
