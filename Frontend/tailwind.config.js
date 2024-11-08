/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: '#2EBFA5',
        electricviolet:"#6434F8",
        darkblue:"#312787",
        waikawagray:"#5D7B9D",
        alto:"#D9D9D9"
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to bottom right, #5A48F9, #312787)',
      },
    },
  },
  plugins: [],
}
