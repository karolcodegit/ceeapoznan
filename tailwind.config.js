/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  darkMode: 'selector',
  theme: {
    extend: {
      lineHeight: {
        'big': '5rem',
      },
      backgroundImage: {
        'input-bg': "url('/src/assets/images/other/input.svg')",
      },
      colors: {
        'darker': '#03045e',
        'dark': '#0077b6',
        'medium': '#00b4d8',
        'light': '#006BBA',
        'lighter': '#88C8EC',

        'blue': '#00B4D8',
        'lightMint': "#80EE98",
        'pastelTurquoise': "#46DFB1",
        'vividTurquoise': "#09D1C7",
        'deepTurquoise': "#15919B",
        'darkBlueGreen': "#0C6478",
        'navyBlue': "#213A58",
        

        // 'LavenderMist': '#C3C7F4',
        // 'Lilac': '#C8A8E9',
        // 'PastelPink': '#E3AADD',
        // 'PeachPuff': '#F6BCBA',
        // 'MistyRose': '#F2DDDC',
        // 'LightLavender': '#F4E7FB'
      },
      skew: {
        '40': '40deg',
      },
      width: {
        '27': '27%',
      },
      height: {
        '500': '31.25rem',
      },
      top: {
        '10vh': '10vh'
      },
      right: {
        '20p': '20%'
      },
      animation: {
        'slide-in': 'slide-in 3s forwards',
        'slide-out': 'slide-out 3s forwards',
        'arrow': 'arrow 1s ease-in-out infinite',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'arrow': {
          '0%': {transform: 'scaleX(.5)'},
          '100%': {transform: 'scaleX(1)'},
        }
      }
    },
  },
  variants: {},
  plugins: [],
}

