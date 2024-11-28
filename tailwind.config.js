/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        scythe: {
          red: '#FF4D4D',
          black: '#1A1A1A',
          gray: {
            50: '#F9F9F9',
            100: '#ECECEC',
            200: '#DFDFDF',
            300: '#CCCCCC',
            400: '#B3B3B3',
            500: '#999999',
            600: '#808080',
            700: '#666666',
            800: '#333333',
            900: '#1A1A1A',
          }
        }
      },
      fontFamily: {
        sans: ['Walfork', 'system-ui', 'sans-serif'],
        serif: ['TiemposHeadline', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
          },
        },
      },
    },
  },
  plugins: [],
}