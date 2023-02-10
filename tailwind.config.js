/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const darkTheme = {
  dark: {
    primary: "#1e40af",
    secondary: "#4b5563",
    accent: "#1FB2A5",
    neutral: "#1f2937",
    "base-100": "#101520",
    info: "#3ABFF8",
    success: "#166534",
    warning: "#FBBD23",
    error: "#be123c",
  },
};

module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./renderer/app/**/*.{js,ts,jsx,tsx}",
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

  daisyui: {
    styled: true,
    themes: ["light", darkTheme],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
    theme: {
      fontFamily: {
        headings: ["Montserrat", ...defaultTheme.fontFamily.sans],
        body: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
