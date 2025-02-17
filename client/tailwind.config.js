/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#40513b",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
