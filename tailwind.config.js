/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',  // ✅ dodane jsx, tsx
  ],
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
        'custom-blue': '#00B4D8',
        'lightMint': "#80EE98",
        'pastelTurquoise': "#46DFB1",
        'vividTurquoise': "#09D1C7",
        'deepTurquoise': "#15919B",
        'darkBlueGreen': "#0C6478",
        'navyBlue': "#213A58",
        'customGreen': 'bg-gray-300',
        gray: {
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
        },
        yellow: {
          500: "#FBBF24",
          600: "#D97706",
        },
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
        '20px': '20%'
      },
      animation: {
        'slide-in': 'slide-in 3s forwards',
        'slide-out': 'slide-out 3s forwards',
        'arrow': 'arrow 1s ease-in-out infinite',
        'float': "float 20s ease-in-out infinite",
        'drift': "drift 22s ease-in-out infinite",
        "pulse-glow": "pulse-glow 8s ease-in-out infinite",
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
        },
        'float': {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 40px) scale(0.95)" },
        },
        'drift': {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-50px, 30px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.15", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "0.25", transform: "translate(-50%, -50%) scale(1.2)" },
        },
      },
    },
  },
  variants: {},
  plugins: [],
}