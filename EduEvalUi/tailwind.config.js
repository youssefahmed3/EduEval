/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary_navy_blue: "#002B4C", // Custom color
        secondary_gold: "#D4AF37",
        accent_blue: "#4B91E2",
        accent_blue: "#4B91E2",
        background: "#F8F8F8",
        text: "#333333",
        danger: "#E53935",
        success: "#4CAF50",
      },
    },
  },
  plugins: [
    require("daisyui"),
    function ({ addBase, theme }) {
      const colors = theme("colors");
      const cssVariables = Object.keys(colors).reduce((acc, key) => {
        if (typeof colors[key] === "string") {
          acc[`--color-${key}`] = colors[key];
        }
        return acc;
      }, {});

      addBase({
        ":root": cssVariables,
      });
    },
  ],
};
