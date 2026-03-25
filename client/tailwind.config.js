/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8f1f7',
          100: '#c5dcea',
          200: '#9cc3da',
          300: '#6da7c7',
          400: '#3d8ab3',
          500: '#0d6e9e',
          600: '#0d527e',
          700: '#0a4268',
          800: '#083351',
          900: '#05233a',
          950: '#031726',
        },
        gold: {
          50: '#fdf8ed',
          100: '#f9eed2',
          200: '#f3dda5',
          300: '#e8c578',
          400: '#e2b565',
          500: '#d4a04a',
          600: '#b8843a',
          700: '#976630',
          800: '#7a5129',
          900: '#644325',
        },
      },
    },
  },
  plugins: [],
}
