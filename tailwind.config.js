// tailwind.config.js
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
  // các đường dẫn khác...
];
export const theme = {
  extend: {
    animation: {
      in: "in 0.3s ease-out",
    },
    keyframes: {
      in: {
        "0%": { opacity: "0", transform: "scale(0.9)" },
        "100%": { opacity: "1", transform: "scale(1)" },
      },
    },
  },
};
export const plugins = [
  require("tailwindcss-animate"), // BẮT BUỘC CÀI PLUGIN NÀY
];
