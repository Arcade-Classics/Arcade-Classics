module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      zIndex: {
        back: "-9999",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
