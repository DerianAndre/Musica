/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

const darkTheme = {
  dark: {
    primary: '#1e40af',
    secondary: '#4b5563',
    accent: '#1FB2A5',
    neutral: '#1f2937',
    'base-100': '#101520',
    info: '#3ABFF8',
    success: '#166534',
    warning: '#FBBD23',
    error: '#be123c',
  },
};

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './renderer/app/**/*.{js,ts,jsx,tsx}',
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    {
      pattern: /grid-cols-./,
    },
  ],
  theme: {
    fontFamily: {
      headings: ['"Poppins"', ...defaultTheme.fontFamily.sans],
      sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
      mono: ['"Chivo Mono"', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      screens: {
        '3xl': '1700px',
        '4xl': '1850px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  variants: {
    extend: {
      backgroundColor: ['odd', 'even'],
      visibility: ['group-hover'],
    },
  },
  daisyui: {
    styled: true,
    themes: ['light', darkTheme],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
  },
};
